#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
base_url="${1:-http://127.0.0.1:3030}"
base_url="${base_url%/}"
slide_number="${SLIDE_NUMBER:-2}"
output_dir="${2:-$repo_root/artifacts/visual-acceptance}"

if [[ ! "$slide_number" =~ ^[1-9][0-9]*$ ]]; then
  printf 'SLIDE_NUMBER must be a positive integer; got: %s\n' "$slide_number" >&2
  exit 2
fi

find_chromium() {
  if [[ -n "${CHROME_BIN:-}" ]]; then
    printf '%s\n' "$CHROME_BIN"
    return
  fi

  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then
      command -v "$candidate"
      return
    fi
  done

  local browser_cache="${PLAYWRIGHT_BROWSERS_PATH:-${HOME:-}/.cache/ms-playwright}"
  if [[ -d "$browser_cache" ]]; then
    find "$browser_cache" -type f -path '*/chrome-linux64/chrome' -perm -u+x -print \
      | sort -V \
      | tail -n 1
  fi
}

browser_bin="$(find_chromium)"
if [[ -z "$browser_bin" || ! -x "$browser_bin" ]]; then
  printf 'Chromium not found. Set CHROME_BIN or install Chromium.\n' >&2
  exit 1
fi

mkdir -p "$output_dir"
output_dir="$(cd "$output_dir" && pwd)"

capture() {
  local name="$1"
  local url="$2"
  local image="$output_dir/$name.png"

  "$browser_bin" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1600,900 \
    --virtual-time-budget=12000 \
    --screenshot="$image" \
    "$url" >/dev/null 2>&1

  local details
  details="$(file -b "$image")"
  if [[ "$details" != *'PNG image data, 1600 x 900'* ]]; then
    printf 'Unexpected screenshot dimensions for %s: %s\n' "$image" "$details" >&2
    exit 1
  fi
  printf '%s  %s\n' "$image" "$details"
}

# Verify the Slidev server is reachable.
curl --fail --silent --show-error \
  --max-time 5 \
  --output /dev/null \
  "$base_url/"

capture cover "$base_url/"
capture "slide-${slide_number}-click-0" "$base_url/$slide_number?clicks=0"
capture "slide-${slide_number}-click-1" "$base_url/$slide_number?clicks=1"
