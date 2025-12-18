# 多階段構建：構建階段
FROM node:18-alpine AS builder

WORKDIR /app

# 複製專案檔案
COPY 靈異連線_完整優化包_v3.2_Final/optimized-project/package*.json ./
COPY 靈異連線_完整優化包_v3.2_Final/optimized-project/ ./

# 安裝依賴並構建
RUN npm ci --legacy-peer-deps
RUN npm run build

# 生產階段：使用 nginx 提供靜態檔案
FROM nginx:alpine

# 複製構建產物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自訂 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 8080 端口（Cloud Run 預設）
EXPOSE 8080

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
