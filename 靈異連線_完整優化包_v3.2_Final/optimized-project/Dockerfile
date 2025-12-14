# ===================================
# 靈異連線：蝕骨杏林 - Dockerfile
# 多階段建置，優化映像大小
# ===================================

# Stage 1: Build the application
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package files
COPY package*.json ./

# 安裝依賴（僅生產環境依賴）
RUN npm ci --only=production && \
    npm cache clean --force

# 安裝建置所需的 devDependencies
COPY package*.json ./
RUN npm install

# 複製源代碼
COPY . .

# 建置應用
ARG VITE_GEMINI_API_KEY
ARG VITE_ENABLE_SOUND=true
ARG VITE_ENABLE_CRT=true
ARG VITE_ENABLE_GYRO=false
ARG VITE_ENABLE_FLASHLIGHT=false

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_ENABLE_SOUND=$VITE_ENABLE_SOUND
ENV VITE_ENABLE_CRT=$VITE_ENABLE_CRT
ENV VITE_ENABLE_GYRO=$VITE_ENABLE_GYRO
ENV VITE_ENABLE_FLASHLIGHT=$VITE_ENABLE_FLASHLIGHT

RUN npm run build

# Stage 2: Production image with nginx
FROM nginx:alpine

# 安裝 curl 用於健康檢查
RUN apk add --no-cache curl

# 複製建置結果到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 創建自定義 nginx 配置
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json image/svg+xml;
    
    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # SPA 路由處理
    location / {
        try_files $uri $uri/ /index.html;
        
        # 防止快取 HTML
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 靜態資源快取
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 健康檢查端點
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 隱藏 nginx 版本
    server_tokens off;
}
EOF

# 創建健康檢查腳本
RUN cat > /health-check.sh <<'EOF'
#!/bin/sh
curl -f http://localhost:8080/health || exit 1
EOF
RUN chmod +x /health-check.sh

# 設置非 root 用戶運行
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# 暴露端口
EXPOSE 8080

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /health-check.sh

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
