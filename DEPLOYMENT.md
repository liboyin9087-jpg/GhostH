# 部署指南 (Deployment Guide)

## 📋 部署前準備

### 必要條件

1. **Google Cloud Platform 帳號**
   - 建立 GCP 專案
   - 啟用 Cloud Run API
   - 啟用 Artifact Registry API
   - 啟用 Cloud Build API

2. **服務帳號設定**
   - 建立服務帳號
   - 授予以下權限：
     - Cloud Run Admin
     - Artifact Registry Admin
     - Service Account User
   - 產生 JSON 金鑰

### GitHub Secrets 設定

在 GitHub 儲存庫設定中新增以下 Secrets：

| Secret 名稱 | 說明 | 範例 |
|------------|------|------|
| `GCP_PROJECT_ID` | GCP 專案 ID | `my-project-123456` |
| `GCP_SA_KEY` | 服務帳號 JSON 金鑰 | 完整的 JSON 內容 |

## 🚀 部署流程

### 自動部署（推薦）

1. 將變更推送到 `main` 分支：
   ```bash
   git add .
   git commit -m "Deploy to Cloud Run"
   git push origin main
   ```

2. GitHub Actions 會自動執行：
   - 建置 Docker 映像
   - 推送到 Artifact Registry
   - 部署到 Cloud Run

3. 查看部署狀態：
   - 前往 GitHub Actions 頁面
   - 查看 "Deploy to Cloud Run" 工作流程

### 手動部署

也可以手動觸發部署：
1. 前往 GitHub Actions 頁面
2. 選擇 "Deploy to Cloud Run" 工作流程
3. 點擊 "Run workflow"

## 🔧 本地測試

### Docker 本地測試

```bash
# 建置 Docker 映像
docker build -t ghosth-test .

# 執行容器
docker run -p 8080:8080 ghosth-test

# 在瀏覽器開啟 http://localhost:8080
```

### 本地開發

```bash
cd 靈異連線_完整優化包_v3.2_Final/optimized-project
npm install
npm run dev
```

## 📦 Cloud Run 設定說明

### 當前配置

- **地區**: `asia-east1` (台灣)
- **記憶體**: 512Mi
- **CPU**: 1
- **最小實例**: 0 (節省成本)
- **最大實例**: 10
- **逾時**: 300 秒
- **端口**: 8080
- **訪問權限**: 公開（allow-unauthenticated）

### 調整配置

若需修改設定，編輯 `.github/workflows/deploy-cloud-run.yml` 中的以下參數：

```yaml
--memory 512Mi        # 記憶體大小
--cpu 1              # CPU 數量
--min-instances 0    # 最小實例數
--max-instances 10   # 最大實例數
```

## 🔍 部署檢查清單

部署前請確認：

- [ ] GCP 專案已建立並啟用必要 API
- [ ] 服務帳號已建立並設定權限
- [ ] GitHub Secrets 已正確設定
- [ ] Artifact Registry 儲存庫已建立
- [ ] 程式碼可在本地成功建置
- [ ] Docker 映像可在本地成功執行

## ⚠️ 常見問題

### 1. 權限錯誤

**錯誤訊息**: "Permission denied"

**解決方法**:
- 確認服務帳號擁有所有必要權限
- 檢查 GCP_SA_KEY 是否正確設定

### 2. Artifact Registry 錯誤

**錯誤訊息**: "Repository not found"

**解決方法**:
```bash
# 手動建立 Artifact Registry 儲存庫
gcloud artifacts repositories create ghosth \
  --repository-format=docker \
  --location=asia-east1 \
  --description="GhostH Docker images"
```

### 3. 建置失敗

**錯誤訊息**: "Build failed"

**解決方法**:
- 檢查 Dockerfile 路徑是否正確
- 確認所有依賴都已安裝
- 在本地測試 Docker 建置

### 4. 部署逾時

**錯誤訊息**: "Deployment timeout"

**解決方法**:
- 增加 `--timeout` 參數
- 優化 Docker 映像大小
- 檢查網路連線

## 💰 成本估算

Cloud Run 採用用量計費：

- **請求數**: 前 200 萬次免費/月
- **CPU 時間**: 前 180,000 vCPU-秒免費/月
- **記憶體**: 前 360,000 GiB-秒免費/月
- **網路**: 前 1 GB 出站流量免費/月

**預估成本** (低流量情境):
- 月訪客 < 1000: $0 (免費額度內)
- 月訪客 1000-5000: ~$5-15 USD
- 月訪客 5000-10000: ~$15-30 USD

## 🔐 安全性建議

1. **使用環境變數**: 敏感資料不要寫在程式碼中
2. **限制訪問**: 若不需公開，移除 `--allow-unauthenticated`
3. **定期更新**: 保持依賴套件最新
4. **監控日誌**: 定期檢查 Cloud Run 日誌

## 📊 監控與日誌

### 查看日誌

```bash
# 查看最近的日誌
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ghosth-spectral-link" --limit 50

# 即時串流日誌
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=ghosth-spectral-link"
```

### Cloud Console 監控

1. 前往 [Cloud Console](https://console.cloud.google.com)
2. 導航到 Cloud Run > ghosth-spectral-link
3. 查看指標、日誌和修訂版本

## 🔄 更新部署

### 更新應用程式

1. 修改程式碼
2. 提交並推送到 main 分支
3. GitHub Actions 自動部署新版本

### 回滾部署

```bash
# 列出所有修訂版本
gcloud run revisions list --service=ghosth-spectral-link --region=asia-east1

# 回滾到特定版本
gcloud run services update-traffic ghosth-spectral-link \
  --to-revisions=REVISION_NAME=100 \
  --region=asia-east1
```

## 📚 相關資源

- [Cloud Run 官方文件](https://cloud.google.com/run/docs)
- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Artifact Registry 文件](https://cloud.google.com/artifact-registry/docs)
- [Docker 文件](https://docs.docker.com/)

---

**最後更新**: 2025-12-18  
**維護者**: GhostH Team
