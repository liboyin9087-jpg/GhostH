# 🚀 Google Cloud Run 部署指南

## 📋 目錄
- [前置需求](#前置需求)
- [設定步驟](#設定步驟)
- [GitHub Secrets 配置](#github-secrets-配置)
- [手動部署](#手動部署)
- [自動化部署](#自動化部署)
- [疑難排解](#疑難排解)

---

## 前置需求

### 1. Google Cloud 帳號與專案
- 有效的 Google Cloud 帳號
- 建立或選擇一個 GCP 專案
- 啟用計費功能

### 2. 啟用必要的 API
在 GCP Console 中啟用以下 API：
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. 工具安裝
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- Node.js 18+

---

## 設定步驟

### Step 1: GCP 專案設定

```bash
# 設定預設專案
gcloud config set project YOUR_PROJECT_ID

# 設定預設區域
gcloud config set run/region asia-east1
```

### Step 2: 建立 Artifact Registry

```bash
# 建立 Docker repository
gcloud artifacts repositories create ghosth-app \
  --repository-format=docker \
  --location=asia-east1 \
  --description="GhostH Horror Game Docker Images"
```

### Step 3: 設定服務帳號（用於 GitHub Actions）

```bash
# 建立服務帳號
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# 授予必要權限
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"
```

### Step 4: 設定 Workload Identity Federation（推薦）

這比使用服務帳號金鑰更安全：

```bash
# 建立 Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location="global" \
  --display-name="GitHub Actions Pool"

# 建立 Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# 授權 GitHub repository
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/YOUR_GITHUB_USERNAME/GhostH"
```

取得 Workload Identity Provider 名稱：
```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)"
```

---

## GitHub Secrets 配置

在 GitHub repository 的 Settings > Secrets and variables > Actions 中新增以下 secrets：

### 必要 Secrets

| Secret 名稱 | 說明 | 範例 |
|------------|------|------|
| `GCP_PROJECT_ID` | GCP 專案 ID | `my-ghosth-project` |
| `WIF_PROVIDER` | Workload Identity Provider 完整名稱 | `projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `WIF_SERVICE_ACCOUNT` | 服務帳號郵件 | `github-actions-deployer@my-project.iam.gserviceaccount.com` |
| `VITE_GEMINI_API_KEY` | Gemini API Key（選填） | `AIza...` |

### 取得專案資訊

```bash
# 取得專案 ID
gcloud config get-value project

# 取得專案編號
gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)"
```

---

## 手動部署

如果你想手動部署（不使用 GitHub Actions）：

### 方法 1: 使用 gcloud 直接部署

```bash
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 部署到 Cloud Run
gcloud run deploy ghosth-app \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_GEMINI_API_KEY=YOUR_API_KEY,VITE_ENABLE_SOUND=true,VITE_ENABLE_CRT=true" \
  --memory 512Mi \
  --cpu 1
```

### 方法 2: 使用 Docker 手動建置

```bash
cd 靈異連線_完整優化包_v3.2_Final/optimized-project

# 本地建置
npm install
npm run build

# 建置 Docker image
docker build -t ghosth-app .

# 標記 image
docker tag ghosth-app asia-east1-docker.pkg.dev/YOUR_PROJECT_ID/ghosth-app/ghosth-horror-game:latest

# 推送到 Artifact Registry
docker push asia-east1-docker.pkg.dev/YOUR_PROJECT_ID/ghosth-app/ghosth-horror-game:latest

# 部署到 Cloud Run
gcloud run deploy ghosth-app \
  --image asia-east1-docker.pkg.dev/YOUR_PROJECT_ID/ghosth-app/ghosth-horror-game:latest \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

---

## 自動化部署

### 觸發方式

1. **自動觸發**：推送到 `main` 或 `master` 分支
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. **手動觸發**：在 GitHub Actions 頁面點擊 "Run workflow"

### 監控部署

1. 前往 GitHub repository > Actions
2. 查看最新的 workflow run
3. 檢查每個步驟的日誌
4. 部署成功後，在 Summary 中會顯示 Cloud Run URL

---

## 部署後配置

### 自定義網域

```bash
# 映射自定義網域
gcloud run domain-mappings create \
  --service ghosth-app \
  --domain your-domain.com \
  --region asia-east1
```

### 設定最小/最大實例

```bash
# 更新服務配置
gcloud run services update ghosth-app \
  --region asia-east1 \
  --min-instances 1 \
  --max-instances 10
```

### 設定 CPU 限制

```bash
# 在低流量時降低 CPU 使用（節省成本）
gcloud run services update ghosth-app \
  --region asia-east1 \
  --cpu-throttling
```

---

## 監控與日誌

### 查看日誌

```bash
# 查看即時日誌
gcloud run services logs read ghosth-app \
  --region asia-east1 \
  --limit 50

# 持續追蹤日誌
gcloud run services logs tail ghosth-app \
  --region asia-east1
```

### 查看服務狀態

```bash
# 取得服務詳細資訊
gcloud run services describe ghosth-app \
  --region asia-east1

# 取得服務 URL
gcloud run services describe ghosth-app \
  --region asia-east1 \
  --format='value(status.url)'
```

### 查看指標

在 GCP Console 中：
1. 前往 Cloud Run > ghosth-app
2. 點擊 "METRICS" 標籤
3. 查看請求數、延遲、CPU/記憶體使用率等

---

## 疑難排解

### 問題 1: 建置失敗

**症狀**: Docker 建置失敗
**解決方案**:
```bash
# 檢查 Node.js 版本
node --version  # 應該是 18.x

# 清除快取並重新安裝
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 問題 2: 權限錯誤

**症狀**: 部署時出現 403 Forbidden
**解決方案**:
```bash
# 檢查服務帳號權限
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-deployer@*"

# 重新授予權限（如需要）
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

### 問題 3: 環境變數未生效

**症狀**: 應用程式無法存取 API Key
**解決方案**:
```bash
# 檢查環境變數
gcloud run services describe ghosth-app \
  --region asia-east1 \
  --format="value(spec.template.spec.containers[0].env)"

# 更新環境變數
gcloud run services update ghosth-app \
  --region asia-east1 \
  --update-env-vars VITE_GEMINI_API_KEY=YOUR_NEW_KEY
```

### 問題 4: 記憶體不足

**症狀**: 503 Service Unavailable
**解決方案**:
```bash
# 增加記憶體限制
gcloud run services update ghosth-app \
  --region asia-east1 \
  --memory 1Gi
```

### 問題 5: 冷啟動太慢

**症狀**: 第一次請求很慢
**解決方案**:
```bash
# 設定最小實例數（會產生額外成本）
gcloud run services update ghosth-app \
  --region asia-east1 \
  --min-instances 1
```

---

## 成本估算

### 免費額度（每月）
- 200 萬個請求
- 360,000 GB-seconds 的記憶體
- 180,000 vCPU-seconds 的運算

### 預估成本（小型專案）
- **請求數**: 10,000/月 → **免費**
- **記憶體**: 512Mi × 100 小時 → **約 $1-2**
- **CPU**: 1 vCPU × 50 小時 → **約 $0.5-1**

**總計**: 通常在免費額度內，或每月 $2-5 USD

### 節省成本技巧
1. 使用 `--cpu-throttling`（預設）
2. 設定 `--min-instances 0`（預設）
3. 設定合理的 `--timeout`
4. 使用 CDN 服務靜態資源
5. 啟用 gzip 壓縮（已在 nginx 配置中）

---

## 安全性最佳實踐

### 1. 使用 Workload Identity Federation
✅ 已在本指南中配置

### 2. 限制服務帳號權限
✅ 使用最小權限原則

### 3. 啟用 HTTPS（Cloud Run 預設）
✅ 自動提供 SSL 憑證

### 4. 設定 CORS（如需要）
在 nginx 配置中添加：
```nginx
add_header Access-Control-Allow-Origin "https://your-domain.com" always;
```

### 5. 保護敏感資料
- 使用 Secret Manager 儲存 API Keys
- 不要在程式碼中硬編碼密鑰
- 定期輪換憑證

---

## 更新與維護

### 滾動更新

Cloud Run 會自動執行滾動更新，無停機時間。

### 回滾到先前版本

```bash
# 列出所有版本
gcloud run revisions list \
  --service ghosth-app \
  --region asia-east1

# 回滾到特定版本
gcloud run services update-traffic ghosth-app \
  --region asia-east1 \
  --to-revisions REVISION_NAME=100
```

### 金絲雀部署

```bash
# 將 10% 流量導向新版本
gcloud run services update-traffic ghosth-app \
  --region asia-east1 \
  --to-revisions NEW_REVISION=10,OLD_REVISION=90
```

---

## 相關資源

- [Cloud Run 官方文檔](https://cloud.google.com/run/docs)
- [Artifact Registry 文檔](https://cloud.google.com/artifact-registry/docs)
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Cloud Run 定價](https://cloud.google.com/run/pricing)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)

---

## 支援

如遇到問題，請：
1. 查看 [疑難排解](#疑難排解) 章節
2. 檢查 GitHub Actions 日誌
3. 查看 Cloud Run 服務日誌
4. 在 GitHub Issues 中回報問題

---

**最後更新**: 2025-12-14  
**版本**: 1.0  
**狀態**: ✅ 可立即使用
