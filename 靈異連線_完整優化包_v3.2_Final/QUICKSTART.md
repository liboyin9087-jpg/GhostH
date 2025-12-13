# QUICKSTART（5 分鐘跑起來）

## 1️⃣ 安裝依賴

```bash
cd optimized-project
npm install
# 或
yarn install
# 或
pnpm install
```

## 2️⃣ 設定環境變數

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入你的 Gemini API Key：
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> 取得 API Key：https://makersuite.google.com/app/apikey

## 3️⃣ 啟動開發伺服器

```bash
npm run dev
```

瀏覽器會自動開啟 http://localhost:3000

## 4️⃣ 查看完整範例

完整的整合範例位於：
- `src/examples/GhostAppExample.tsx` - 完整功能展示
- `EXAMPLE_LandingPage.tsx` (根目錄) - 募資頁面範例

## 5️⃣ 驗收重點

打開範例後，檢查以下功能：

- ✅ 倒數穩定（不會越跑越快）
- ✅ 切分頁觸發懲罰彈窗 + timer reset
- ✅ BREACH 訊息 2–4 秒不規則消退
- ✅ CRT 雜訊強度平滑呼吸
- ✅ 電量低時干擾疊加
- ✅ 圖片快閃效果（監視器模式）

## 6️⃣ 整合到你的專案

將以下檔案複製到你的專案：

```
src/
├── components/     # 所有 React 組件
├── hooks/          # 所有自訂 Hooks
├── services/       # AI 服務
├── styles/         # 顏色配置
├── assets/         # 資產管理
└── index.css       # Tailwind CSS

public/
├── images/         # 場景圖片
└── sounds/         # 音效檔案（待補充）
```

參考 `examples/INTEGRATION_EXAMPLE.md` 進行整合。

## ⚠️ 常見問題

**Q: 音效無法播放？**  
A: 現代瀏覽器需要使用者互動後才能播放音效。使用 IntroOverlay 組件解決。

**Q: 圖片載入很慢？**  
A: 已使用 WebP 格式優化。確認瀏覽器支援 WebP。

**Q: TypeScript 錯誤？**  
A: 確認已安裝所有依賴，並重新啟動 TypeScript 伺服器。

## 📚 延伸閱讀

- [完整安裝指南](INSTALLATION_GUIDE.md)
- [API 參考](新增組件使用指南.md)
- [圖片整合說明](IMAGES_INTEGRATION.md)
