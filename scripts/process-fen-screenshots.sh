#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/lib-redact.sh"

ASSETS="/Users/hashton/.cursor/projects/Users-hashton-Sites-hashton/assets"
OUT="/Users/hashton/Sites/hashton/public/images/work/front-end-now"
FILL="#080C16"
BLUR=22

mkdir -p "$OUT"

process() {
  local src_name=$1
  local dest_name=$2
  shift 2
  local src="$ASSETS/$src_name"
  if [[ $# -eq 0 ]]; then
    magick "$src" PNG:"$OUT/$dest_name"
  else
    apply_redactions "$src" "$OUT/$dest_name" "$FILL" "$@"
  fi
  echo "Wrote $dest_name"
}

blur() {
  local src_name=$1
  local dest_name=$2
  shift 2
  local src="$ASSETS/$src_name"
  apply_blurs "$src" "$OUT/$dest_name" "$BLUR" "$@"
  echo "Wrote $dest_name"
}

process "Screenshot_2026-06-26_at_14.54.03-151b50de-dd09-4226-badd-57389039e17a.png" "syntax-arena-home.png"
process "Screenshot_2026-06-26_at_14.53.49-62643502-83b3-4df6-bd9d-7078b5bbfa9e.png" "css-lesson-editor.png"
process "Screenshot_2026-06-26_at_14.54.20-1a14127c-9cad-481a-9fe8-9fa752ffc61f.png" "code-sandbox.png"
process "Screenshot_2026-06-26_at_14.53.20-000795b1-6eb5-4355-99b2-9f07d1d7f8a4.png" "admin-posts.png"
process "Screenshot_2026-06-26_at_14.53.42-d29731d1-966d-4d30-864c-ee1edaf4876f.png" "syntax-arena-css.png"

# Student record — blur names, emails, phone, fees only (input values, not labels)
blur "Screenshot_2026-06-26_at_14.52.59-99a3040b-e731-42f2-9eb3-19c2f2ebce3e.png" "student-dashboard.png" \
  198 63 145 28 \
  430 63 75 28 \
  560 63 175 28 \
  250 136 430 34 \
  228 188 248 36 \
  398 188 248 36 \
  568 188 208 36 \
  398 372 248 36 \
  568 372 208 36 \
  228 432 248 36 \
  568 488 208 36 \
  228 524 548 44

# Student table — blur name, closer, coach columns only
blur "Screenshot_2026-06-26_at_14.52.43-22072d1f-a2c4-4461-aefd-a454b6fb0290.png" "student-management.png" \
  48 334 178 252 \
  452 334 92 252 \
  544 334 132 252

# Profile — blur personal + link fields only (keep location + avatar panel)
blur "Screenshot_2026-06-26_at_14.54.33-d4f85204-94ab-4753-a563-1ef1a87e19de.png" "profile-settings.png" \
  24 112 336 42 \
  24 192 336 42 \
  24 272 336 42 \
  24 412 336 42 \
  24 472 336 42 \
  24 532 336 42

process "Screenshot_2026-06-26_at_14.53.28-9081c592-d551-4f4b-a892-eea8600892b0.png" "syntax-arena-dashboard.png"

# Course tiers — blur pricing figures only
blur "Screenshot_2026-06-26_at_14.53.09-87056380-574c-4231-83bc-9a8301d42438.png" "course-tiers.png" \
  24 128 248 52 \
  280 128 248 52 \
  536 128 248 52 \
  792 128 224 52

process "Screenshot_2026-06-26_at_15.29.05-5545ca2f-51bf-431e-b333-794ef01f0a5c.png" "coach-page.png"
process "Screenshot_2026-06-26_at_15.28.55-7834ed72-a93d-4eb4-9deb-c002d4e23f6c.png" "bootcamp-checklist.png"
process "Screenshot_2026-06-26_at_15.29.14-6e322602-744b-4410-95fb-964abdef99d2.png" "faq.png"

magick "$ASSETS/Screenshot_2026-06-26_at_15.29.25-6eb41e9e-f98c-4f27-8adf-3724bb7befe2.png" PNG:"/Users/hashton/Sites/hashton/public/images/work/front-end-now-preview.png"
echo "Wrote front-end-now-preview.png"
