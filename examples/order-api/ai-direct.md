# 對照 A：AI 直接實作

此實作會正確篩選、計數和分頁，也用具名參數避免把輸入值串進 SQL。它的工程問題來自違反本合成專案明定的慣例，而不是查詢功能寫錯。

## Controller 與查詢元件

以下省略一般 import。`OrderRepository` 在此直接承接 HTTP 呼叫者的整個查詢需求，並操作 JDBC；專案既定的 Service／DAO／MyBatis XML 邊界沒有保留。

```java
@RestController
public class OrderController {
    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/api/orders")
    public ApiResponse<List<OrderResponse>> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        OrderRepository.SearchResult result = orderRepository.search(
                status, fromDate, toDate, page, pageSize);
        return ApiResponse.page(result.items(), result.totalCount());
    }
}

@Repository
public class OrderRepository {
    private final NamedParameterJdbcTemplate jdbc;

    public OrderRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public SearchResult search(String status, LocalDate fromDate, LocalDate toDate,
                               int page, int pageSize) {
        validate(fromDate, toDate, page, pageSize);

        StringBuilder where = new StringBuilder(" WHERE 1 = 1");
        MapSqlParameterSource filters = new MapSqlParameterSource();
        if (status != null) {
            where.append(" AND status = :status");
            filters.addValue("status", status);
        }
        if (fromDate != null) {
            where.append(" AND created_at >= :fromInclusive");
            filters.addValue("fromInclusive", fromDate.atStartOfDay());
            where.append(" AND created_at < :toExclusive");
            filters.addValue("toExclusive", toDate.plusDays(1).atStartOfDay());
        }

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM orders" + where, filters, Long.class);
        var pageParams = new MapSqlParameterSource(filters.getValues())
                .addValue("limit", pageSize)
                .addValue("offset", Math.multiplyExact((long) page, pageSize));
        String sql = "SELECT id, customer_id, status, created_at FROM orders" + where
                + " ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset";
        List<OrderResponse> items = jdbc.query(sql, pageParams, (rs, row) ->
                new OrderResponse(rs.getLong("id"), rs.getLong("customer_id"),
                        rs.getString("status"),
                        rs.getTimestamp("created_at").toLocalDateTime()));
        return new SearchResult(items, total);
    }

    private void validate(LocalDate fromDate, LocalDate toDate,
                          int page, int pageSize) {
        if ((fromDate == null) != (toDate == null)
                || (fromDate != null && fromDate.isAfter(toDate))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Provide an ordered fromDate/toDate pair");
        }
        if (page < 0 || pageSize < 1 || pageSize > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "page must be non-negative and pageSize must be 1..100");
        }
    }

    public record SearchResult(List<OrderResponse> items, long totalCount) {}
}

public record OrderResponse(long id, long customerId, String status,
                            LocalDateTime createdAt) {}
```

## 為分頁修改共用回應型別

原專案只有 `code`、`message`、`data`。這個版本為了支援單一分頁端點，在共用型別加入 `totalCount` 欄位和 `page(...)` 工廠；若序列化設定包含 null，既有端點的 JSON 也會多出 `totalCount: null`。

```java
public record ApiResponse<T>(String code, String message, T data,
                             Long totalCount) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>("OK", "success", data, null);
    }

    public static <T> ApiResponse<T> page(T data, long totalCount) {
        return new ApiResponse<>("OK", "success", data, totalCount);
    }
}
```

此端點的回應會是 `{"code":"OK","message":"success","data":[...],"totalCount":42}`。若序列化設定包含 null，沿用 `ok(...)` 的既有端點也會多出 `"totalCount":null`；即使設定排除 null，共用型別仍被擴充。這種 shape 可用，但與案例中既有共用回應契約不相容。
