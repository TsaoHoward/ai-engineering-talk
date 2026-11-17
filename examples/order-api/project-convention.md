# 對照 B：符合專案慣例的實作

此實作提供與 [AI 直接實作](ai-direct.md)相同的查詢條件、日期邊界、分頁預設值、上下限、排序和總筆數語意。差異在於它沿用既有元件責任和 API 契約。

以下省略一般 import、DTO getter/setter boilerplate 與共用 `ApiResponse<T>` 實作；`OrderQueryDto` 有標準 setters 供 Spring 綁定 query parameters，`ApiResponse.ok(data)` 回傳固定的 `{ code, message, data }` 外殼。

## DTO 與 HTTP 邊界

```java
public class OrderQueryDto {
    private String status;
    private LocalDate fromDate;
    private LocalDate toDate;
    private int page = 0;
    private int pageSize = 20;

    public String getStatus() { return status; }
    public LocalDate getFromDate() { return fromDate; }
    public LocalDate getToDate() { return toDate; }
    public int getPage() { return page; }
    public int getPageSize() { return pageSize; }
    public LocalDateTime getFromInclusive() {
        return fromDate == null ? null : fromDate.atStartOfDay();
    }
    public LocalDateTime getToExclusive() {
        return toDate == null ? null : toDate.plusDays(1).atStartOfDay();
    }
    public long getOffset() { return Math.multiplyExact((long) page, pageSize); }
}

public record OrderItemDto(long id, long customerId, String status,
                           LocalDateTime createdAt) {}

public record OrderPageDto(List<OrderItemDto> items, long totalCount) {}

@RestController
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/api/orders")
    public ApiResponse<OrderPageDto> search(
            @ModelAttribute OrderQueryDto query) {
        return ApiResponse.ok(orderService.search(query));
    }
}
```

## Service 與 DAO 介面

```java
@Service
public class OrderService {
    private final OrderDao orderDao;

    public OrderService(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    public OrderPageDto search(OrderQueryDto query) {
        if ((query.getFromDate() == null) != (query.getToDate() == null)
                || (query.getFromDate() != null
                    && query.getFromDate().isAfter(query.getToDate()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Provide an ordered fromDate/toDate pair");
        }
        if (query.getPage() < 0 || query.getPageSize() < 1
                || query.getPageSize() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "page must be non-negative and pageSize must be 1..100");
        }

        List<OrderItemDto> items = orderDao.selectPage(query);
        long total = orderDao.count(query);
        return new OrderPageDto(items, total);
    }
}

@Mapper
public interface OrderDao {
    List<OrderItemDto> selectPage(OrderQueryDto query);
    long count(OrderQueryDto query);
}
```

## MyBatis XML：`resources/mapper/OrderDao.xml`

```xml
<mapper namespace="com.example.order.dao.OrderDao">
  <select id="selectPage" resultType="com.example.order.dto.OrderItemDto">
    SELECT id, customer_id AS customerId, status, created_at AS createdAt
    FROM orders
    <where>
      <if test="status != null">
        AND status = #{status}
      </if>
      <if test="fromDate != null">
        AND created_at &gt;= #{fromInclusive}
      </if>
      <if test="toDate != null">
        AND created_at &lt; #{toExclusive}
      </if>
    </where>
    ORDER BY created_at DESC, id DESC
    LIMIT #{pageSize} OFFSET #{offset}
  </select>

  <select id="count" resultType="long">
    SELECT COUNT(*) FROM orders
    <where>
      <if test="status != null">
        AND status = #{status}
      </if>
      <if test="fromDate != null">
        AND created_at &gt;= #{fromInclusive}
      </if>
      <if test="toDate != null">
        AND created_at &lt; #{toExclusive}
      </if>
    </where>
  </select>
</mapper>
```

## 回應契約

不修改共用外殼 `ApiResponse<T> = { code, message, data }`。`data` 為 `OrderPageDto`，所以 JSON shape 是 `{"code":"OK","message":"success","data":{"items":[...],"totalCount":42}}`。分頁資訊屬於此端點的資料，不變成所有端點共用的頂層欄位。
