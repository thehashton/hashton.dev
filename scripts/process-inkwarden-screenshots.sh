#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/lib-redact.sh"

DESKTOP="/Users/hashton/Desktop"
ASSETS="/Users/hashton/.cursor/projects/Users-hashton-Sites-hashton/assets"
OUT="/Users/hashton/Sites/hashton/public/images/work/inkwarden"
BLUR=14
MAX_WIDTH=2800

mkdir -p "$OUT"

desktop_shot() {
  local time=$1
  echo "$DESKTOP/Screenshot 2026-06-26 at ${time}.png"
}

resolve_src() {
  local time=$1
  local desktop
  desktop=$(desktop_shot "$time")
  if [[ -f "$desktop" ]]; then
    echo "$desktop"
    return
  fi
  local match
  match=$(ls $ASSETS/Screenshot_2026-06-26_at_${time}-*.png 2>/dev/null | head -1)
  if [[ -n "$match" && -f "$match" ]]; then
    echo "$match"
    return
  fi
  echo "Missing source for $time" >&2
  exit 1
}

export_hires() {
  local src=$1
  local dest=$2
  magick "$src" -resize "${MAX_WIDTH}x>" -strip -define png:compression-level=6 PNG:"$OUT/$dest"
  echo "Wrote $dest"
}

scale_blur() {
  local src=$1
  local dest=$2
  local base_w=$3
  local base_h=$4
  shift 4

  local tmp
  tmp=$(mktemp -t ink-hires.XXXXXX)
  tmp="${tmp}.png"
  magick "$src" -resize "${MAX_WIDTH}x>" -strip PNG:"$tmp"

  local out_w out_h
  out_w=$(magick identify -format "%w" "$tmp")
  out_h=$(magick identify -format "%h" "$tmp")

  local scaled=()
  while [[ $# -ge 4 ]]; do
    local x=$1 y=$2 w=$3 h=$4
    shift 4
    scaled+=($((x * out_w / base_w)) $((y * out_h / base_h)) $((w * out_w / base_w)) $((h * out_h / base_h)))
  done

  apply_blurs "$tmp" "$OUT/$dest" "$BLUR" "${scaled[@]}"
  rm -f "$tmp"
  echo "Wrote $dest"
}

# Uncensored — full-resolution originals
export_hires "$(resolve_src "14.59.35")" "marketing-hero.png"
export_hires "$(resolve_src "15.15.50")" "world-character-sheet.png"
export_hires "$(resolve_src "15.15.41")" "dashboard.png"
export_hires "$(resolve_src "15.16.40")" "blog-posts.png"
export_hires "$(resolve_src "15.16.23")" "blog-editor.png"

# Workspace GIF — keep animated original
GIF_SRC="/Users/hashton/Downloads/inkwarden-comp.gif"
if [[ -f "$GIF_SRC" ]]; then
  cp "$GIF_SRC" "$OUT/workspace-ai.gif"
  echo "Wrote workspace-ai.gif"
fi

# Censored — hi-res source with scaled blur regions (base coords are 1024-wide assets)
scale_blur "$(resolve_src "15.17.22")" "profile-settings.png" 1024 584 \
  930 20 72 32 \
  520 218 280 28 \
  378 268 200 40

scale_blur "$(resolve_src "15.15.56")" "admin-overview.png" 1024 585 \
  256 100 520 56

scale_blur "$(resolve_src "15.17.14")" "users-admin.png" 1024 585 \
  48 334 178 252 \
  232 334 248 252

scale_blur "$(resolve_src "15.16.33")" "feedback-modal.png" 751 1024 \
  28 244 696 92
