# Build / Deploy / Zip 指南（不踩雷版）

## 你會需要的兩包
1) demo_source.zip：給你或工程改版用（不含 node_modules、不含 secrets）
2) demo_release.zip：給展示/部署用（包含 dist/build 等產物）

## 一鍵打包（推薦）
到 scripts/ 執行：
```bash
bash scripts/package_demo.sh /path/to/your/demo-root
```

會在你 demo-root 的同層輸出：
- demo_source.zip
- demo_release.zip

## secrets 管理（必要規範）
- `.env` / `.env.production` 一律不進 zip
- 改用：
  - `.env.example`（放入必填欄位名稱）
  - Cloud Run Secrets（或你部署平台的 secret manager）
