#!/usr/bin/env python3
import os, sys, csv
from PIL import Image

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp"}

def main(root: str):
    bad = []
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            ext = os.path.splitext(fn)[1].lower()
            if ext not in IMG_EXT:
                continue
            path = os.path.join(dirpath, fn)
            try:
                im = Image.open(path)
                w, h = im.size
                if w != h:
                    bad.append((path, "not_square", f"{w}x{h}"))
            except Exception as e:
                bad.append((path, "unreadable", str(e)))

    print(f"掃描完成：{root}")
    if not bad:
        print("✅ 沒有發現問題（至少在可讀性/方形比例上）")
        return 0

    print("⚠️ 發現問題：")
    for row in bad:
        print(" -", row)
    return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法：python scripts/verify_assets.py /path/to/assets")
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
