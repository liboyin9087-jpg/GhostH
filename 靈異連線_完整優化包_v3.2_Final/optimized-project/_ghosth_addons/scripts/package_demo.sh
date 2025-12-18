#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-}"
if [[ -z "$ROOT" ]]; then
  echo "用法：bash scripts/package_demo.sh /path/to/demo-root"
  exit 1
fi
if [[ ! -d "$ROOT" ]]; then
  echo "找不到資料夾：$ROOT"
  exit 1
fi

cd "$ROOT"

echo "==> [1/4] 偵測專案型態"
if [[ -f "package.json" ]]; then
  echo " - Node 專案：OK"
else
  echo " - 警告：找不到 package.json（可能是純靜態或其他架構）"
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$(dirname "$ROOT")/demo_pack_out_$STAMP"
mkdir -p "$OUT_DIR"

echo "==> [2/4] 產出 demo_source.zip（排除肥料與 secrets）"
SRC_ZIP="$OUT_DIR/demo_source.zip"
zip -r "$SRC_ZIP" . \
  -x "node_modules/*" "dist/*" "build/*" ".next/*" ".turbo/*" ".cache/*" ".vite/*" ".parcel-cache/*" "coverage/*" \
     ".git/*" ".github/*" "*.log" ".DS_Store" \
     ".env" ".env.*" \
     "out/*"

echo "==> [3/4] 嘗試 build（若有 package.json 才執行）"
RELEASE_DIR="$OUT_DIR/demo_release"
mkdir -p "$RELEASE_DIR"

if [[ -f "package.json" ]]; then
  if command -v npm >/dev/null 2>&1; then
    npm ci || npm install
    npm run build || true
  else
    echo " - 找不到 npm，跳過 build"
  fi
fi

echo "==> [4/4] 產出 demo_release.zip（收集 dist/build/public/server/api）"
cp -r dist "$RELEASE_DIR/" 2>/dev/null || true
cp -r build "$RELEASE_DIR/" 2>/dev/null || true
cp -r out "$RELEASE_DIR/" 2>/dev/null || true
cp -r public "$RELEASE_DIR/" 2>/dev/null || true
cp -r server "$RELEASE_DIR/" 2>/dev/null || true
cp -r api "$RELEASE_DIR/" 2>/dev/null || true
cp package.json "$RELEASE_DIR/" 2>/dev/null || true
cp .env.example "$RELEASE_DIR/" 2>/dev/null || true
cp README* "$RELEASE_DIR/" 2>/dev/null || true

( cd "$OUT_DIR" && zip -r demo_release.zip demo_release >/dev/null )

echo ""
echo "完成："
echo " - $SRC_ZIP"
echo " - $OUT_DIR/demo_release.zip"
