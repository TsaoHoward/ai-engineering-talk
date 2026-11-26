#!/usr/bin/env bash
# preview-slidev.sh - Start Slidev dev server

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Arguments
SLIDES_FILE="${1:-slides.md}"
PORT="${2:-3030}"
OPEN_BROWSER="${3:-true}"

# Prefer a global CLI, but accept the project-local CLI used by Codex projects.
SLIDEV_CMD=()
if command -v slidev &> /dev/null; then
    SLIDEV_CMD=(slidev)
elif [[ -x "${PWD}/node_modules/.bin/slidev" ]]; then
    SLIDEV_CMD=("${PWD}/node_modules/.bin/slidev")
else
    echo -e "${YELLOW}⚠ Slidev not found. Please install it first.${NC}"
    exit 1
fi

# Check if slides file exists
if [[ ! -f "$SLIDES_FILE" ]]; then
    echo -e "${YELLOW}⚠ Slides file not found: $SLIDES_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}Starting Slidev preview...${NC}"
echo -e "${BLUE}File: $SLIDES_FILE${NC}"
echo -e "${BLUE}Port: $PORT${NC}"
echo -e "${GREEN}Server will be available at: http://localhost:$PORT${NC}"

# Start Slidev in background
if [[ "$OPEN_BROWSER" == "false" ]]; then
    "${SLIDEV_CMD[@]}" "$SLIDES_FILE" --port "$PORT" --no-open &
else
    "${SLIDEV_CMD[@]}" "$SLIDES_FILE" --port "$PORT" &
fi
SLIDEV_PID=$!

# Save PID to file for later stopping
echo $SLIDEV_PID > /tmp/slidev-preview.pid

echo -e "${GREEN}✓ Slidev started (PID: $SLIDEV_PID)${NC}"
echo -e "${BLUE}To stop: kill $SLIDEV_PID${NC}"
