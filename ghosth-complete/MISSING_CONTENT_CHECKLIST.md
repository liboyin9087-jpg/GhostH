# 《靈異連線》缺失內容清單
# GhostH Complete - Missing Content Checklist

**版本**: v4.0  
**檢查日期**: 2025-12-20  
**狀態**: 📋 需補充資源

---

## 🎨 圖片資源缺失

### ❌ 場景圖片
**路徑**: `public/images/scenes/`

#### 標題場景圖片
- [ ] `scene00_title.png` - 標題檔案畫面 (建議 1920x1080)
  - **用途**: TitleArchiveScreen 組件背景
  - **風格**: VHS 復古風格、綠色掃描線、仁心精神病院封鎖檔案
  - **參考**: 1990年代台灣醫院檔案照片風格
  - **替代方案**: 暫時使用 scene01_corridor.png

#### 可選場景圖片
- [ ] `scene03_xray_room.png` - X光室 (1920x1080)
- [ ] `scene04_operating_room.png` - 手術室 (1920x1080)
- [ ] `scene06_patient_room.png` - 病房 (1920x1080)
- [ ] `scene07_basement.png` - 地下室 (1920x1080)

---

### ❌ 互動物件圖片
**路徑**: `public/assets/objects/`

#### 找到的物件 (found/)
目前: **空白 (只有 .keep 檔案)**

**需要的物件圖片** (建議 512x512, PNG 透明背景):
- [ ] `obj_01_wheelchair.png` - 血跡輪椅
- [ ] `obj_02_patient_file.png` - 病歷文件
- [ ] `obj_03_nurse_diary.png` - 護理長日誌
- [ ] `obj_04_phone.png` - 老式電話
- [ ] `obj_05_key.png` - 鑰匙
- [ ] `obj_06_talisman.png` - 道教護符
- [ ] `obj_07_vhs_tape.png` - VHS 錄影帶
- [ ] `obj_08_medical_monitor.png` - 醫療監視器
- [ ] `obj_09_freezer_drawer.png` - 冰櫃抽屜
- [ ] `obj_10_autopsy_tool.png` - 解剖工具
- [ ] `obj_11_nurse_uniform.png` - 護士服
- [ ] `obj_12_mirror_shard.png` - 鏡子碎片
- [ ] `obj_13_flashlight.png` - 手電筒
- [ ] `obj_14_emf_meter.png` - EMF 測量計
- [ ] `obj_15_spirit_box.png` - 靈異探測器

**圖片風格指南**:
- 1990年代台灣醫院物品風格
- 暗淡色調，帶有時間痕跡
- 部分物品可帶有血跡或損壞效果
- PNG 透明背景，方便疊加

#### 剪影物件 (cutout/)
目前: **空白 (只有 .keep 檔案)**

**需要的剪影圖片** (建議 512x512, PNG 透明背景):
- [ ] `obj_01_wheelchair_cutout.png` - 輪椅剪影
- [ ] `obj_02_patient_file_cutout.png` - 文件剪影
- [ ] `obj_03_nurse_diary_cutout.png` - 日誌剪影
- [ ] ... (對應上面的物件清單)

**圖片風格指南**:
- 純黑剪影 (alpha channel)
- 用於掃描模式和 UI 預覽
- 輪廓清晰，易於識別

---

### ⚠️ UI 圖示 (可選)
**路徑**: `public/images/ui/icons/`

目前使用 Emoji，可考慮替換為自訂圖示:
- [ ] `icon_flashlight.png` - 手電筒圖示 (64x64)
- [ ] `icon_scan.png` - 掃描器圖示 (64x64)
- [ ] `icon_playback.png` - 播放器圖示 (64x64)
- [ ] `icon_talisman.png` - 護符圖示 (64x64)
- [ ] `icon_clue.png` - 線索圖示 (64x64)
- [ ] `icon_settings.png` - 設定圖示 (64x64)
- [ ] `icon_save.png` - 存檔圖示 (64x64)
- [ ] `icon_load.png` - 讀檔圖示 (64x64)

---

### ⚠️ 熱點互動提示圖片 (可選)
**路徑**: `public/images/hints/`

- [ ] `hint_click.png` - 點擊提示 (128x128)
- [ ] `hint_flashlight_required.png` - 需要手電筒提示 (128x128)
- [ ] `hint_scan_required.png` - 需要掃描提示 (128x128)
- [ ] `hint_locked.png` - 鎖定提示 (128x128)

---

## 🔊 音效資源缺失

### ⚠️ 標題場景音效 (可選)
**路徑**: `public/audio/title/`

- [ ] `title_ambient.mp3` - 標題場景環境音 (2-3分鐘循環)
  - **風格**: 低頻 hum (50-60Hz)、微弱靜電干擾
- [ ] `title_static_burst.mp3` - 靜電干擾爆發 (2-3秒)
- [ ] `title_click.mp3` - 熱點點擊音效

### ⚠️ 場景轉場音效 (可選)
**路徑**: `public/audio/transitions/`

- [ ] `transition_fade.mp3` - 場景淡出音效 (1-2秒)
- [ ] `transition_static.mp3` - VHS 轉場靜電 (1-2秒)

### ⚠️ 額外鬼魂音效 (可選)
**路徑**: `public/audio/ghost/`

目前有 7 個，可新增:
- [ ] `ghost_laugh.mp3` - 鬼笑聲
- [ ] `ghost_child.mp3` - 兒童聲音
- [ ] `ghost_scratch.mp3` - 刮擦聲
- [ ] `ghost_bang.mp3` - 撞擊聲
- [ ] `ghost_bell.mp3` - 鈴聲

---

## 📄 文件資源缺失

### ❌ 遊戲說明文件
- [ ] `GAMEPLAY_GUIDE.md` - 完整遊戲玩法指南
  - 工具使用說明
  - 場景探索技巧
  - 靈異事件應對
  - 結局達成條件

### ⚠️ 開發文件 (可選)
- [ ] `DEVELOPMENT.md` - 開發環境設定指南
- [ ] `CONTRIBUTING.md` - 貢獻指南
- [ ] `CHANGELOG.md` - 版本更新記錄
- [ ] `API.md` - 組件 API 文件

---

## 🎮 遊戲內容缺失

### ⚠️ 額外場景腳本
目前有 3 個主要場景，可新增:
- [ ] X光室場景腳本 (xray_room)
- [ ] 手術室場景腳本 (operating_room)
- [ ] 病房場景腳本 (patient_room)
- [ ] 地下室場景腳本 (basement)

### ⚠️ 額外靈異事件
目前基礎事件已實作，可新增:
- [ ] 影子跟隨事件 (shadow_follow)
- [ ] 物品移動事件 (object_possession)
- [ ] 溫度驟降事件 (cold_spot)
- [ ] 幻覺閃現事件 (hallucination)
- [ ] 時間扭曲事件 (time_distortion)

### ⚠️ 分支結局
目前可能只有單一結局，可新增:
- [ ] 真相大白結局 (true_ending)
- [ ] 倉皇逃離結局 (escape_ending)
- [ ] 獻身封印結局 (sacrifice_ending)
- [ ] 瘋狂結局 (insanity_ending)
- [ ] 隱藏結局 (secret_ending)

---

## 🌐 本地化資源缺失

### ❌ 多語言支援
目前: **僅繁體中文**

可新增語言:
- [ ] 英文 (en-US)
- [ ] 日文 (ja-JP)
- [ ] 韓文 (ko-KR)
- [ ] 簡體中文 (zh-CN)

**需要翻譯的檔案**:
- [ ] `src/locales/en-US.json`
- [ ] `src/locales/ja-JP.json`
- [ ] `src/locales/ko-KR.json`
- [ ] `src/locales/zh-CN.json`

---

## 📱 App 資源缺失

### ❌ PWA 圖示
**路徑**: `public/`

- [ ] `icon-192.png` - PWA 圖示 (192x192)
- [ ] `icon-512.png` - PWA 圖示 (512x512)
- [ ] `icon-maskable-192.png` - Maskable 圖示 (192x192)
- [ ] `icon-maskable-512.png` - Maskable 圖示 (512x512)
- [ ] `apple-touch-icon.png` - iOS 圖示 (180x180)
- [ ] `favicon.ico` - 瀏覽器圖示 (32x32)
- [ ] `favicon-16x16.png` - 瀏覽器圖示 (16x16)
- [ ] `favicon-32x32.png` - 瀏覽器圖示 (32x32)

### ❌ App 截圖
**路徑**: `public/screenshots/`

用於 App Store / Play Store:
- [ ] `screenshot-1.png` - 標題畫面 (1242x2688)
- [ ] `screenshot-2.png` - 遊戲畫面 (1242x2688)
- [ ] `screenshot-3.png` - 工具使用 (1242x2688)
- [ ] `screenshot-4.png` - 線索抽屜 (1242x2688)
- [ ] `screenshot-5.png` - 靈異事件 (1242x2688)

---

## 🧪 測試資源缺失

### ❌ 測試檔案
**路徑**: `src/__tests__/`

- [ ] `hooks/useFearSystem.test.ts`
- [ ] `hooks/useHauntDirector.test.ts`
- [ ] `hooks/useScanSystem.test.ts`
- [ ] `components/CameraHUD.test.tsx`
- [ ] `components/ClueDrawer.test.tsx`
- [ ] `effects/Scene3DEffects.test.tsx`

### ❌ E2E 測試
**路徑**: `e2e/`

- [ ] `e2e/gameplay.spec.ts` - 完整遊戲流程測試
- [ ] `e2e/tools.spec.ts` - 工具使用測試
- [ ] `e2e/save-load.spec.ts` - 存讀檔測試

---

## 📊 缺失資源優先級

### 🔴 高優先級 (影響核心功能)
1. ❌ 標題場景圖片 (scene00_title.png)
2. ❌ 互動物件圖片 (15 個物件)
3. ❌ 物件剪影圖片 (15 個剪影)
4. ❌ PWA 圖示套組 (8 個圖示)

**預估工作量**: 2-3 天 (設計師)

### 🟡 中優先級 (提升使用體驗)
1. ⚠️ 標題場景音效 (3 個音效)
2. ⚠️ UI 圖示套組 (8 個圖示)
3. ⚠️ 遊戲說明文件 (GAMEPLAY_GUIDE.md)
4. ⚠️ App 截圖 (5 張)

**預估工作量**: 1-2 天

### 🟢 低優先級 (錦上添花)
1. ⚠️ 額外場景圖片 (4 個場景)
2. ⚠️ 額外音效 (7 個音效)
3. ⚠️ 多語言支援 (4 種語言)
4. ⚠️ 額外遊戲內容 (場景、事件、結局)
5. ⚠️ 測試檔案

**預估工作量**: 1-2 週

---

## 🎯 建議補充順序

### 第一階段 (必要資源)
1. 建立標題場景圖片
2. 建立 5 個核心互動物件圖片
   - 輪椅、文件、日誌、電話、鑰匙
3. 建立對應的剪影圖片
4. 建立基礎 PWA 圖示

**目標**: 讓遊戲完整可玩

### 第二階段 (優化資源)
1. 補齊所有 15 個互動物件圖片
2. 建立標題場景音效
3. 建立 UI 圖示套組
4. 撰寫遊戲說明文件
5. 截取 App 宣傳截圖

**目標**: 提升整體品質

### 第三階段 (擴充內容)
1. 新增額外場景 (至少 2 個)
2. 新增額外靈異事件 (至少 3 個)
3. 實作分支結局系統
4. 多語言支援 (至少英文)
5. 撰寫開發文件

**目標**: 增加遊戲深度

---

## 📝 資源建立指南

### 圖片資源建立
**工具建議**:
- AI 生成: Midjourney, Stable Diffusion
- 手繪: Photoshop, Procreate
- 3D 渲染: Blender, Cinema 4D

**Prompt 參考** (AI 生成):
```
標題場景:
"1990s Taiwan hospital archive photo, VHS tape quality, green CRT monitor scan lines, retro medical file system, cinematic lighting, horror atmosphere, abandoned hospital, --ar 16:9"

互動物件:
"Bloodstained wheelchair in abandoned hospital, 1990s Taiwan medical equipment, top-down view, transparent background, photorealistic, horror game asset, --ar 1:1"
```

### 音效資源建立
**工具建議**:
- 錄音: Audacity, Adobe Audition
- 音效庫: Freesound.org, Soundly
- 合成: FL Studio, Ableton Live

**音效規格**:
- 格式: MP3
- 採樣率: 44.1kHz
- 位元率: 128kbps (環境音、循環音)
- 位元率: 192kbps (重要音效)

### 文件資源建立
**風格指南**:
- 使用繁體中文
- Markdown 格式
- 包含程式碼範例
- 加入截圖輔助說明

---

## 🔄 資源更新流程

1. **資源建立** → 設計師/音效師建立資源
2. **檔案命名** → 依照本文件規範命名
3. **放置位置** → 放入對應目錄
4. **更新程式碼** → 更新引用路徑
5. **測試驗證** → 測試資源載入正常
6. **Git 提交** → 提交到版本控制

---

## 📞 需要協助?

如果需要協助建立這些資源:
1. 查看 `_ghosth_addons/planning_docs/` 目錄中的 AI Prompt 文件
2. 參考 `_ghosth_addons/uploaded_images/` 目錄中的範例圖片
3. 查閱 `3D_EFFECTS_README.md` 了解技術規格

---

**最後更新**: 2025-12-20  
**維護者**: GitHub Copilot  
**下次檢查**: 建議補充核心資源後重新檢視
