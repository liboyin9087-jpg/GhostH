#!/bin/bash

# GhostH 部署設定檢查腳本
# 此腳本檢查 Cloud Run 部署所需的所有設定

set -e

echo "=========================================="
echo "  GhostH Cloud Run 部署設定檢查"
echo "=========================================="
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查函數
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 已安裝"
        return 0
    else
        echo -e "${RED}✗${NC} $1 未安裝"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} 檔案存在: $1"
        return 0
    else
        echo -e "${RED}✗${NC} 檔案不存在: $1"
        return 1
    fi
}

# 1. 檢查必要工具
echo "1. 檢查必要工具..."
echo "-------------------"
check_command "node" || echo "   請安裝 Node.js: https://nodejs.org/"
check_command "npm" || echo "   請安裝 npm (通常隨 Node.js 一起安裝)"
check_command "docker" || echo "   請安裝 Docker: https://www.docker.com/"
check_command "gcloud" || echo "   請安裝 Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
echo ""

# 2. 檢查專案檔案
echo "2. 檢查專案檔案..."
echo "-------------------"
check_file "靈異連線_完整優化包_v3.2_Final/optimized-project/package.json"
check_file "Dockerfile"
check_file "nginx.conf"
check_file ".github/workflows/deploy-cloud-run.yml"
check_file ".env.example"
echo ""

# 3. 檢查 GitHub Secrets（需要手動確認）
echo "3. GitHub Secrets 設定"
echo "-------------------"
echo -e "${YELLOW}請手動確認以下 Secrets 已在 GitHub 設定：${NC}"
echo "   - GCP_PROJECT_ID"
echo "   - GCP_SA_KEY"
echo ""
echo "   設定位置: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo ""

# 4. 檢查 GCP 設定
echo "4. GCP 專案設定檢查"
echo "-------------------"

if command -v gcloud &> /dev/null; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${YELLOW}⚠${NC} 未設定 GCP 專案"
        echo "   請執行: gcloud config set project YOUR_PROJECT_ID"
    else
        echo -e "${GREEN}✓${NC} 當前 GCP 專案: $PROJECT_ID"
        
        # 檢查必要的 API
        echo ""
        echo "   檢查必要 API..."
        
        REQUIRED_APIS=(
            "run.googleapis.com"
            "artifactregistry.googleapis.com"
            "cloudbuild.googleapis.com"
        )
        
        for api in "${REQUIRED_APIS[@]}"; do
            if gcloud services list --enabled --filter="name:$api" --format="value(name)" 2>/dev/null | grep -q "$api"; then
                echo -e "   ${GREEN}✓${NC} $api 已啟用"
            else
                echo -e "   ${RED}✗${NC} $api 未啟用"
                echo "      請執行: gcloud services enable $api"
            fi
        done
    fi
else
    echo -e "${YELLOW}⚠${NC} gcloud 未安裝，跳過 GCP 檢查"
fi
echo ""

# 5. 檢查專案建置
echo "5. 專案建置測試"
echo "-------------------"
PROJECT_DIR="靈異連線_完整優化包_v3.2_Final/optimized-project"

if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules 已存在"
    else
        echo -e "${YELLOW}⚠${NC} node_modules 不存在，正在安裝..."
        npm install
    fi
    
    echo "   正在測試建置..."
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} 建置成功"
    else
        echo -e "${RED}✗${NC} 建置失敗"
        echo "   請執行 'npm run build' 查看詳細錯誤"
    fi
    
    cd - > /dev/null
else
    echo -e "${RED}✗${NC} 專案目錄不存在"
fi
echo ""

# 6. 總結
echo "=========================================="
echo "  檢查完成"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 如有缺失工具，請先安裝"
echo "2. 在 GitHub 設定必要的 Secrets"
echo "3. 確認 GCP 專案和 API 都已正確設定"
echo "4. 將變更推送到 main 分支即可觸發部署"
echo ""
echo "詳細部署指南請參考: DEPLOYMENT.md"
echo ""
