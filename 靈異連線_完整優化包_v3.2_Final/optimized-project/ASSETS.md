# 《靈異連線》資源清單與 AI 生成提示詞

## 目錄
1. [圖片資源](#圖片資源)
2. [音效資源](#音效資源)
3. [AI 圖片生成提示詞](#ai-圖片生成提示詞)
4. [音效取得建議](#音效取得建議)

---

## 圖片資源

### 必要場景圖（3 張）

| 檔案名稱 | 場景 | 尺寸建議 | 格式 |
|---------|-----|---------|-----|
| `scene01_corridor.png` | B1 舊病房走廊 | 1080×1920 或 1440×2560 | PNG/WebP |
| `scene02_nurse_station.png` | 1F 護理站 | 1080×1920 或 1440×2560 | PNG/WebP |
| `scene05_morgue.png` | B2 太平間 | 1080×1920 或 1440×2560 | PNG/WebP |

### 建議補充圖片（6 張）

| 檔案名稱 | 用途 | 說明 |
|---------|-----|-----|
| `scene03_xray_room.png` | X光室場景 | 可作為第四關卡 |
| `scene04_operating_room.png` | 手術室場景 | 可作為第五關卡 |
| `item_wheelchair.png` | 線索物品 | 血跡輪椅特寫 |
| `item_talisman_burned.png` | 線索物品 | 燃燒的符咒陣 |
| `item_patient_file.png` | 線索物品 | 病患檔案特寫 |
| `ghost_figure.png` | 鬼影剪影 | 半透明女鬼輪廓（PNG 透明背景）|

### UI 元素圖片（可選）

| 檔案名稱 | 用途 |
|---------|-----|
| `ui_talisman_paper.png` | 護符紙張紋理 |
| `ui_vhs_noise.gif` | VHS 雜訊動圖 |
| `ui_scan_grid.svg` | 掃描網格疊層 |

---

## 音效資源

### 環境音（Ambient）- 4 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `amb_hospital_base.mp3` | 2-3 分鐘循環 | 基礎醫院環境音（空調嗡嗡聲、遠處管線聲）|
| `amb_corridor.mp3` | 2-3 分鐘循環 | 走廊環境（迴音、偶爾的腳步聲）|
| `amb_nurse.mp3` | 2-3 分鐘循環 | 護理站環境（紙張翻動、老舊時鐘滴答）|
| `amb_morgue.mp3` | 2-3 分鐘循環 | 太平間環境（冷藏櫃低頻嗡嗡、金屬迴響）|

### 循環音效（Loop）- 4 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `loop_drip.mp3` | 10-30 秒循環 | 水滴聲 |
| `loop_fluorescent.mp3` | 10-30 秒循環 | 日光燈閃爍電流聲 |
| `loop_fridge.mp3` | 10-30 秒循環 | 冷藏櫃運轉聲 |
| `loop_heartbeat.mp3` | 5-10 秒循環 | 心跳聲（緊張時使用）|

### UI 音效 - 6 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `ui_click.mp3` | < 0.5 秒 | 按鈕點擊 |
| `ui_drawer_open.mp3` | 0.5-1 秒 | 抽屜開啟 |
| `ui_drawer_close.mp3` | 0.3-0.8 秒 | 抽屜關閉 |
| `ui_scan_start.mp3` | 1-2 秒 | 掃描啟動（電子嗶聲）|
| `ui_scan_complete.mp3` | 0.5-1 秒 | 掃描完成 |
| `ui_notification.mp3` | 0.3-0.5 秒 | 新線索通知 |

### 護符音效 - 3 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `talisman_activate.mp3` | 1-2 秒 | 護符啟動（道教銅鈴聲 + 低頻共鳴）|
| `talisman_burn.mp3` | 2-3 秒 | 護符燃燒（火焰劈啪 + 紙張燃燒）|
| `talisman_seal.mp3` | 1-2 秒 | 封印完成（鐘聲 + 能量釋放）|

### 靈異事件音效 - 7 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `ghost_whisper.mp3` | 2-4 秒 | 女性耳語（模糊不清）|
| `ghost_breath.mp3` | 2-3 秒 | 呼吸聲（靠近感）|
| `ghost_scream.mp3` | 1-2 秒 | 驚嚇尖叫（Jump Scare 用）|
| `static_burst.mp3` | 0.5-1 秒 | 靜電爆裂 |
| `wheelchair_roll.mp3` | 3-5 秒 | 輪椅滾動聲 |
| `door_creak.mp3` | 2-3 秒 | 門緩緩開啟 |
| `footsteps_distant.mp3` | 3-5 秒 | 遠處腳步聲 |

### VHS 效果音 - 3 個檔案

| 檔案名稱 | 時長 | 說明 |
|---------|-----|-----|
| `vhs_tracking.mp3` | 1-2 秒 | VHS 調整追蹤 |
| `vhs_glitch.mp3` | 0.3-0.8 秒 | 畫面干擾 |
| `vhs_rewind.mp3` | 1-3 秒 | 倒帶聲 |

---

## AI 圖片生成提示詞

### 通用風格前綴
```
Style: Found footage horror, 1990s Taiwan abandoned hospital, VHS camera recording quality, green-tinted night vision, high ISO grain, surveillance camera perspective, atmospheric fog, dim flickering fluorescent lights, peeling paint walls, clinical tile surfaces, realistic photographic style
```

### 場景一：B1 舊病房走廊 (scene01_corridor.png)

**Midjourney 提示詞：**
```
Abandoned hospital corridor in Taiwan 1990s, first-person flashlight POV, green-tinted night vision look, long narrow hallway with perspective vanishing point, peeling mint-green paint on lower half of walls, white tile wainscoting, dirty terrazzo floor with scattered papers, old wheelchairs and gurneys along walls, broken ceiling tiles, flickering fluorescent tube lights, heavy atmospheric fog, VHS recording date stamp "DEC 15 1998", found footage horror aesthetic, cinematic lighting from flashlight beam, extremely detailed, photorealistic, 9:16 aspect ratio --ar 9:16 --v 6.1 --style raw
```

**Stable Diffusion 提示詞：**
```
(masterpiece, best quality, photorealistic:1.4), abandoned hospital corridor, Taiwan 1990s style, first person POV with flashlight, green color grading, night vision aesthetic, long narrow hallway with strong perspective, peeling mint green paint walls, white ceramic tile wainscoting, terrazzo floor with debris and scattered documents, old rusty wheelchairs, broken ceiling panels, dim flickering fluorescent lights, atmospheric fog and haze, VHS recording quality, film grain, surveillance camera look, horror atmosphere, (portrait orientation:1.2)

Negative: cartoon, anime, illustration, painting, drawing, watermark, signature, text overlay, bright colors, clean environment, modern equipment
```

### 場景二：1F 護理站 (scene02_nurse_station.png)

**Midjourney 提示詞：**
```
Abandoned hospital nurse station Taiwan 1990s, high angle surveillance camera view looking down 20 degrees, cluttered desk with scattered patient files and documents, old CRT monitor, rotary telephone, medication cabinet with glass doors, wall clock stopped at 3:33, green-tinted security camera footage look, fluorescent light casting harsh shadows, dust particles visible in light beams, peeling wallpaper, stained ceiling tiles, found footage horror style, VHS quality grain and scan lines, timestamp "DEC 15 1998 02:33 AM" in corner, extremely detailed interior, photorealistic, 9:16 vertical --ar 9:16 --v 6.1 --style raw
```

**Stable Diffusion 提示詞：**
```
(masterpiece, best quality, photorealistic:1.4), abandoned nurse station interior, Taiwan hospital 1990s, high angle security camera POV, large wooden desk covered with scattered papers and patient files, old CRT computer monitor, rotary dial telephone, glass medication cabinet, analog wall clock showing 3:33, green color grading, security camera footage aesthetic, harsh fluorescent lighting with visible dust particles, water-stained ceiling tiles, peeling paint, horror atmosphere, VHS recording quality with scan lines, film grain texture, (portrait orientation:1.2)

Negative: cartoon, anime, illustration, painting, clean modern hospital, bright cheerful lighting, people visible
```

### 場景三：B2 太平間 (scene05_morgue.png)

**Midjourney 提示詞：**
```
Taiwan hospital morgue autopsy room 1990s, low angle POV approximately 120cm height, stainless steel autopsy table dominating foreground occupying one-third of frame, cold fluorescent tube lights with slight flicker, white ceramic tile walls with rust stains, refrigerated body storage units along back wall, old medical equipment on rolling carts, condensation fog from cold air, green-tinted found footage look, extremely unsettling atmosphere, VHS recording quality, heavy film grain, scan lines visible, blood stains on floor barely visible in shadows, timestamp "DEC 15 1998", horror cinematography, photorealistic, vertical composition --ar 9:16 --v 6.1 --style raw
```

**Stable Diffusion 提示詞：**
```
(masterpiece, best quality, photorealistic:1.4), hospital morgue autopsy room, Taiwan 1990s, low angle camera view 120cm height, large stainless steel autopsy table in foreground, cold white fluorescent tube lighting, white tile walls with rust and water stains, row of body refrigerator units, medical equipment on wheeled carts, cold condensation fog, green color grading, found footage horror aesthetic, VHS quality with scan lines and grain, extremely unsettling atmosphere, blood traces barely visible, clinical horror, (portrait orientation:1.2)

Negative: cartoon, anime, illustration, bodies visible, gore, bright colors, clean sterile environment, modern equipment
```

### 線索物品：血跡輪椅 (item_wheelchair.png)

**Midjourney 提示詞：**
```
Old rusty wheelchair closeup in abandoned Taiwan hospital, circular flashlight illumination spotlight effect, dark vignette around edges, brown leather seat with fresh blood stain, chrome frame with rust and peeling paint, one wheel slightly turned as if just stopped moving, dust particles in light beam, green-tinted VHS footage look, peeling wall paint visible in background, found footage horror style, extremely detailed textures, photorealistic, timestamp "DEC 15 1998", square composition --ar 1:1 --v 6.1 --style raw
```

### 線索物品：燃燒的符咒陣 (item_talisman_burned.png)

**Midjourney 提示詞：**
```
Five yellow Taoist talisman papers arranged in star pattern on concrete floor, papers partially burned with glowing ember edges, red cinnabar Chinese calligraphy characters visible, ash and charred fragments scattered around, small flames still flickering, overhead view looking straight down, dark shadows around edges, green-tinted VHS surveillance camera look, Taiwan hospital basement setting, ritual gone wrong atmosphere, found footage horror, photorealistic textures, timestamp "DEC 15 1998", square format --ar 1:1 --v 6.1 --style raw
```

### 鬼影剪影 (ghost_figure.png)

**Midjourney 提示詞：**
```
Translucent female ghost figure silhouette, long black hair covering face, white hospital gown, standing in dark hallway, ethereal glowing edges, motion blur effect, barely visible semi-transparent apparition, Asian horror style like The Ring or Ju-On, green-tinted night vision look, VHS recording artifact distortion around figure, PNG transparent background, horror game asset, photorealistic but ghostly --v 6.1 --style raw
```

---

## 音效取得建議

### 免費音效資源網站

1. **Freesound.org** - 大量免費 CC 授權音效
   - 搜尋關鍵字：hospital ambient, horror drone, VHS static, heartbeat, water drip, metal creak

2. **Zapsplat.com** - 免費註冊後可下載
   - 分類：Horror, Medical, Electronic UI

3. **Mixkit.co** - 免費商用音效
   - 搜尋：horror ambience, suspense, UI sounds

4. **BBC Sound Effects** - CC 授權
   - 醫院、走廊、腳步聲等真實錄音

### 付費推薦

1. **Epidemic Sound** - 高品質恐怖音效包
2. **Artlist** - 電影級音效素材
3. **Soundsnap** - 專業音效庫

### 自製建議

對於獨特的道教護符音效，建議組合以下元素：
- 銅鈴聲（可用手機錄製真實銅鈴）
- 火焰燃燒聲
- 低頻嗡嗡聲（合成器製作）
- 風鈴或編鐘音色

使用 **Audacity**（免費）或 **Adobe Audition** 進行混音與效果處理。

---

## 技術規格建議

### 圖片
- 格式：PNG（需要透明度時）或 WebP（檔案較小）
- 解析度：1080×1920（基本）或 1440×2560（高解析）
- 色彩：sRGB，建議後製時加入綠色調濾鏡

### 音效
- 格式：MP3（128-192kbps）或 OGG（更好的網頁支援）
- 取樣率：44.1kHz
- 位元深度：16-bit
- 循環音效確保首尾可無縫銜接

### 檔案大小建議
- 單張場景圖：500KB - 1.5MB
- 環境音效：1-3MB（2-3分鐘循環）
- UI 音效：< 100KB
- 靈異事件音效：100-500KB

---

## 資料夾結構

```
public/
├── images/
│   ├── scenes/
│   │   ├── scene01_corridor.png
│   │   ├── scene02_nurse_station.png
│   │   ├── scene03_xray_room.png
│   │   ├── scene04_operating_room.png
│   │   └── scene05_morgue.png
│   ├── items/
│   │   ├── item_wheelchair.png
│   │   ├── item_talisman_burned.png
│   │   └── item_patient_file.png
│   ├── ghosts/
│   │   └── ghost_figure.png
│   └── ui/
│       ├── ui_talisman_paper.png
│       └── ui_scan_grid.svg
│
└── audio/
    ├── ambient/
    │   ├── amb_hospital_base.mp3
    │   ├── amb_corridor.mp3
    │   ├── amb_nurse.mp3
    │   └── amb_morgue.mp3
    ├── loops/
    │   ├── loop_drip.mp3
    │   ├── loop_fluorescent.mp3
    │   ├── loop_fridge.mp3
    │   └── loop_heartbeat.mp3
    ├── ui/
    │   ├── ui_click.mp3
    │   ├── ui_drawer_open.mp3
    │   ├── ui_drawer_close.mp3
    │   ├── ui_scan_start.mp3
    │   ├── ui_scan_complete.mp3
    │   └── ui_notification.mp3
    ├── talisman/
    │   ├── talisman_activate.mp3
    │   ├── talisman_burn.mp3
    │   └── talisman_seal.mp3
    ├── ghost/
    │   ├── ghost_whisper.mp3
    │   ├── ghost_breath.mp3
    │   ├── ghost_scream.mp3
    │   ├── static_burst.mp3
    │   ├── wheelchair_roll.mp3
    │   ├── door_creak.mp3
    │   └── footsteps_distant.mp3
    └── vhs/
        ├── vhs_tracking.mp3
        ├── vhs_glitch.mp3
        └── vhs_rewind.mp3
```
