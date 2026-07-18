#!/usr/bin/env bash
set -euo pipefail

icon_dir="public/icons/blank"
fallback="$icon_dir/empty.svg"

if [[ ! -f "$fallback" ]]; then
  echo "Missing icon fallback: $fallback" >&2
  exit 1
fi

echo "Icon fallback verified: $fallback"
