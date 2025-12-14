#!/bin/bash

# ===================================
# Cloud Run 快速設定腳本
# ===================================

set -e

echo "🚀 靈異連線：蝕骨杏林 - Cloud Run 部署設定助手"
echo "================================================"
echo ""

# 檢查 gcloud 是否安裝
if ! command -v gcloud &> /dev/null; then
    echo "❌ 錯誤：未找到 gcloud CLI"
    echo "請先安裝 Google Cloud SDK"
    echo "安裝指南: https://cloud.google.com/sdk/docs/install"
    echo "注意：請參考官方文檔獲取最新的安裝說明"
    exit 1
fi

echo "✅ 找到 gcloud CLI"
echo ""

# 獲取當前項目 ID
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ]; then
    echo "⚠️  未設定 GCP 專案"
    echo ""
    read -p "請輸入您的 GCP 專案 ID: " PROJECT_ID
    # 驗證專案 ID 格式
    if [[ ! $PROJECT_ID =~ ^[a-z][a-z0-9-]{4,28}[a-z0-9]$ ]]; then
        echo "❌ 錯誤：專案 ID 格式不正確"
        echo "   專案 ID 必須符合以下規則："
        echo "   - 長度為 6-30 個字元"
        echo "   - 只能包含小寫字母、數字和連字號"
        echo "   - 必須以小寫字母開頭"
        echo "   - 必須以小寫字母或數字結尾"
        exit 1
    fi
    gcloud config set project "$PROJECT_ID"
else
    echo "📋 當前專案: $CURRENT_PROJECT"
    read -p "使用此專案？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "請輸入您的 GCP 專案 ID: " PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    else
        PROJECT_ID=$CURRENT_PROJECT
    fi
fi

echo ""
echo "📦 專案 ID: $PROJECT_ID"
echo ""

# 設定變數
SERVICE_NAME="ghosth-app"
REGION="asia-east1"
REPO_NAME="ghosth-app"

echo "🔧 開始設定..."
echo ""

# 1. 啟用必要的 API
echo "1️⃣  啟用必要的 Google Cloud API..."
gcloud services enable run.googleapis.com --project="$PROJECT_ID"
gcloud services enable artifactregistry.googleapis.com --project="$PROJECT_ID"
gcloud services enable cloudbuild.googleapis.com --project="$PROJECT_ID"
gcloud services enable iam.googleapis.com --project="$PROJECT_ID"
echo "✅ API 已啟用"
echo ""

# 2. 建立 Artifact Registry
echo "2️⃣  建立 Artifact Registry..."
if gcloud artifacts repositories describe "$REPO_NAME" \
    --location="$REGION" \
    --project="$PROJECT_ID" &>/dev/null; then
    echo "✅ Artifact Registry 已存在"
else
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="GhostH Horror Game Docker Images" \
        --project="$PROJECT_ID"
    echo "✅ Artifact Registry 已建立"
fi
echo ""

# 3. 建立服務帳號
echo "3️⃣  建立服務帳號..."
SA_NAME="github-actions-deployer"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SA_EMAIL" \
    --project="$PROJECT_ID" &>/dev/null; then
    echo "✅ 服務帳號已存在"
else
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="GitHub Actions Deployer" \
        --project="$PROJECT_ID"
    echo "✅ 服務帳號已建立"
fi
echo ""

# 4. 授予權限
echo "4️⃣  授予服務帳號權限..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin" \
    --condition=None
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/iam.serviceAccountUser" \
    --condition=None
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.admin" \
    --condition=None
echo "✅ 權限已授予"
echo ""

# 5. 設定 Workload Identity Federation
echo "5️⃣  設定 Workload Identity Federation..."

# 取得專案編號
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")

# 建立 Workload Identity Pool
POOL_NAME="github-pool"
if gcloud iam workload-identity-pools describe "$POOL_NAME" \
    --location="global" \
    --project="$PROJECT_ID" &>/dev/null; then
    echo "✅ Workload Identity Pool 已存在"
else
    gcloud iam workload-identity-pools create "$POOL_NAME" \
        --location="global" \
        --display-name="GitHub Actions Pool" \
        --project="$PROJECT_ID"
    echo "✅ Workload Identity Pool 已建立"
fi

# 建立 Workload Identity Provider
PROVIDER_NAME="github-provider"
if gcloud iam workload-identity-pools providers describe "$PROVIDER_NAME" \
    --location="global" \
    --workload-identity-pool="$POOL_NAME" \
    --project="$PROJECT_ID" &>/dev/null; then
    echo "✅ Workload Identity Provider 已存在"
else
    gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
        --location="global" \
        --workload-identity-pool="$POOL_NAME" \
        --display-name="GitHub Provider" \
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
        --issuer-uri="https://token.actions.githubusercontent.com" \
        --project="$PROJECT_ID"
    echo "✅ Workload Identity Provider 已建立"
fi
echo ""

# 6. 授權 GitHub repository
echo "6️⃣  授權 GitHub repository..."
echo ""
read -p "請輸入您的 GitHub 用戶名: " GITHUB_USERNAME
read -p "請輸入您的 GitHub repository 名稱 (預設: GhostH): " REPO_NAME_INPUT
REPO_NAME_INPUT=${REPO_NAME_INPUT:-GhostH}

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$GITHUB_USERNAME/$REPO_NAME_INPUT" \
    --project="$PROJECT_ID"

echo "✅ GitHub repository 已授權"
echo ""

# 7. 顯示需要設定的 GitHub Secrets
echo "================================================"
echo "🎉 設定完成！"
echo "================================================"
echo ""
echo "📝 請在 GitHub 設定以下 Secrets："
echo ""
echo "1. GCP_PROJECT_ID:"
echo "   $PROJECT_ID"
echo ""
echo "2. WIF_PROVIDER:"
WIF_PROVIDER="projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME"
echo "   $WIF_PROVIDER"
echo ""
echo "3. WIF_SERVICE_ACCOUNT:"
echo "   $SA_EMAIL"
echo ""
echo "4. VITE_GEMINI_API_KEY (選填):"
echo "   您的 Gemini API Key"
echo ""
echo "================================================"
echo ""
echo "📚 設定 GitHub Secrets 的步驟："
echo "   1. 前往: https://github.com/$GITHUB_USERNAME/$REPO_NAME_INPUT/settings/secrets/actions"
echo "   2. 點擊 'New repository secret'"
echo "   3. 依序添加上述 secrets"
echo ""
echo "🚀 完成後，推送程式碼到 main 或 master 分支即可自動部署！"
echo ""
