#!/usr/bin/env bash
# Shared screenshot redaction helpers.

apply_redactions() {
  local src=$1
  local dest=$2
  local fill=$3
  shift 3

  local args=("$src")
  while [[ $# -ge 4 ]]; do
    local x=$1 y=$2 w=$3 h=$4
    shift 4
    args+=(-fill "$fill" -draw "rectangle ${x},${y} $((x + w)),$((y + h))")
  done

  magick "${args[@]}" PNG:"$dest"
}

apply_blurs() {
  local src=$1
  local dest=$2
  local radius=$3
  shift 3

  local current
  current=$(mktemp -t redact.XXXXXX)
  current="${current}.png"
  cp "$src" "$current"

  while [[ $# -ge 4 ]]; do
    local x=$1 y=$2 w=$3 h=$4
    shift 4
    local tmp
    tmp=$(mktemp -t redact.XXXXXX)
    tmp="${tmp}.png"
    magick "$current" \
      \( -clone 0 -crop "${w}x${h}+${x}+${y}" +repage -blur "0x${radius}" \) \
      -geometry "+${x}+${y}" -composite "$tmp"
    rm -f "$current"
    current=$tmp
  done

  magick "$current" PNG:"$dest"
  rm -f "$current"
}

profile_chip() {
  echo "768 0 256 76"
}

mac_corner() {
  local w=$1 h=$2
  echo "$((w - 232)) $((h - 158)) 216 150"
}
