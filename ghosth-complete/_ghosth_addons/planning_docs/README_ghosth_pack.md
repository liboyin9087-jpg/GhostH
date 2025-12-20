# 鬼醫院 Demo 打包整合包（模板＋目前已上傳素材）
更新日：2025-12-17

這包是「把目前你已上傳的素材＋專案規劃文件＋一鍵打包腳本」先整在一起的整包。
⚠️ 注意：我目前拿不到你的 Demo 原始碼資料夾，所以 **無法把真正的遊戲程式碼一起塞進來**。
但這包已把「打包流程」跟「規劃／資產規格」整理到你可以直接落地執行的程度。

## 內容結構
- assets/images/uploaded/：你這次上傳的 10 張圖（已重新命名，含 2 張待確認）
- docs/：規劃與規格文件（含 prompt 模板、狀態清單、交付檢查表）
- scripts/：一鍵打包腳本（把你的 Demo 專案壓成 source/release 兩包）

## 你接下來要做的 3 件事（最少步驟）
1. 把這包解壓後，將你的 Demo 專案資料夾放到同一層（或你指定路徑）
2. 到 scripts/ 內跑 `package_demo.sh /你的demo專案根目錄`
3. 你會得到：
   - demo_source.zip（可維護、可改版）
   - demo_release.zip（偏部署/展示）

> secrets 不會被打包（.env 會被排除），請用 .env.example 或 Cloud Run secrets 管理。
