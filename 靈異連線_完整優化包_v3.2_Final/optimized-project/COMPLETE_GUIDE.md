# 《靈異連線》完整開發指南
## GhostH - Spectral Link Complete Development Guide

---

## 📋 目錄

1. [專案現況分析](#專案現況分析)
2. [缺失資源總覽](#缺失資源總覽)
3. [圖片資源與 AI 生成提示詞](#圖片資源與-ai-生成提示詞)
4. [音效資源與取得建議](#音效資源與取得建議)
5. [程式碼優化建議](#程式碼優化建議)
6. [完整檔案結構](#完整檔案結構)

---

## 專案現況分析

### ✅ 已完成項目

| 類別 | 項目 | 狀態 |
|-----|------|------|
| 核心框架 | React + TypeScript + Vite | ✅ 完成 |
| VHS 效果系統 | RGB 邊條、掃描線、雜訊、暈影 | ✅ 完成 |
| 相機 HUD | REC 指示、訊號強度、電量、ISO | ✅ 完成 |
| 場景系統 | 3 場景切換（走廊、護理站、太平間）| ✅ 完成 |
| 護符系統 | 封印動畫、靈力消耗 | ✅ 完成 |
| 線索抽屜 | 收集與顯示線索 | ✅ 完成 |
| 手電筒模式 | 滑鼠追蹤光源 | ✅ 完成 |
| 掃描模式 | 掃描動畫與提示 | ✅ 完成 |
| 無障礙支援 | prefers-reduced-motion | ✅ 完成 |

### ⚠️ 需要補充項目

| 類別 | 項目 | 優先級 |
|-----|------|-------|
| 圖片 | 場景圖片（目前為佔位圖）| 🔴 高 |
| 圖片 | 線索物品特寫圖 | 🟡 中 |
| 圖片 | 鬼影剪影 PNG | 🟡 中 |
| 音效 | 環境音樂 | 🔴 高 |
| 音效 | UI 互動音效 | 🔴 高 |
| 音效 | 靈異事件音效 | 🟡 中 |
| 功能 | 音效播放系統 | 🔴 高 |
| 功能 | CCTV 回放模式 | 🟢 低 |
| 功能 | 存檔系統 | 🟢 低 |

---

## 缺失資源總覽

### 🖼️ 圖片資源

#### 必要場景圖（3 張）- 優先級：高

| 檔案名稱 | 描述 | 尺寸 | 現況 |
|---------|------|------|------|
| `scene01_corridor.png` | B1 舊病房走廊 | 1080×1920 | ⚠️ 需替換為正式素材 |
| `scene02_nurse_station.png` | 1F 護理站 | 1080×1920 | ⚠️ 需替換為正式素材 |
| `scene05_morgue.png` | B2 太平間 | 1080×1920 | ⚠️ 需替換為正式素材 |

#### 建議補充場景（2 張）- 優先級：中

| 檔案名稱 | 描述 | 尺寸 |
|---------|------|------|
| `scene03_xray_room.png` | X光室 | 1080×1920 |
| `scene04_operating_room.png` | 手術室 | 1080×1920 |

#### 線索物品圖（4 張）- 優先級：中

| 檔案名稱 | 描述 | 尺寸 |
|---------|------|------|
| `item_wheelchair.png` | 血跡輪椅特寫 | 1080×1080 |
| `item_talisman_burned.png` | 燃燒的符咒陣 | 1080×1080 |
| `item_patient_file.png` | 病患檔案 | 1080×1080 |
| `item_nurse_diary.png` | 護理長日誌 | 1080×1080 |

#### 鬼影素材（2 張）- 優先級：中

| 檔案名稱 | 描述 | 尺寸 |
|---------|------|------|
| `ghost_figure.png` | 女鬼剪影（透明背景）| 600×900 |
| `ghost_face.png` | 驚嚇用鬼臉（透明背景）| 800×800 |

#### UI 元素（3 個）- 優先級：低

| 檔案名稱 | 描述 | 格式 |
|---------|------|------|
| `ui_talisman_paper.png` | 護符紙張紋理 | PNG |
| `ui_vhs_noise.gif` | VHS 雜訊動圖 | GIF |
| `ui_scan_grid.svg` | 掃描網格 | SVG |

---

### 🔊 音效資源

#### 環境音（4 個）- 優先級：高

| 檔案名稱 | 時長 | 描述 | 現況 |
|---------|------|------|------|
| `amb_hospital_base.mp3` | 2-3 分鐘循環 | 基礎醫院環境音 | ❌ 缺失 |
| `amb_corridor.mp3` | 2-3 分鐘循環 | 走廊環境音 | ❌ 缺失 |
| `amb_nurse.mp3` | 2-3 分鐘循環 | 護理站環境音 | ❌ 缺失 |
| `amb_morgue.mp3` | 2-3 分鐘循環 | 太平間環境音 | ❌ 缺失 |

#### 循環音效（4 個）- 優先級：中

| 檔案名稱 | 時長 | 描述 |
|---------|------|------|
| `loop_drip.mp3` | 10-30 秒 | 水滴聲 |
| `loop_fluorescent.mp3` | 10-30 秒 | 日光燈閃爍 |
| `loop_fridge.mp3` | 10-30 秒 | 冷藏櫃運轉 |
| `loop_heartbeat.mp3` | 5-10 秒 | 心跳聲 |

#### UI 音效（6 個）- 優先級：高

| 檔案名稱 | 時長 | 描述 |
|---------|------|------|
| `ui_click.mp3` | < 0.5 秒 | 按鈕點擊 |
| `ui_drawer_open.mp3` | 0.5-1 秒 | 抽屜開啟 |
| `ui_drawer_close.mp3` | 0.3-0.8 秒 | 抽屜關閉 |
| `ui_scan_start.mp3` | 1-2 秒 | 掃描啟動 |
| `ui_scan_complete.mp3` | 0.5-1 秒 | 掃描完成 |
| `ui_notification.mp3` | 0.3-0.5 秒 | 新線索通知 |

#### 護符音效（3 個）- 優先級：中

| 檔案名稱 | 時長 | 描述 |
|---------|------|------|
| `talisman_activate.mp3` | 1-2 秒 | 護符啟動 |
| `talisman_burn.mp3` | 2-3 秒 | 護符燃燒 |
| `talisman_seal.mp3` | 1-2 秒 | 封印完成 |

#### 靈異事件音效（7 個）- 優先級：中

| 檔案名稱 | 時長 | 描述 |
|---------|------|------|
| `ghost_whisper.mp3` | 2-4 秒 | 女性耳語 |
| `ghost_breath.mp3` | 2-3 秒 | 呼吸聲 |
| `ghost_scream.mp3` | 1-2 秒 | 驚嚇尖叫 |
| `static_burst.mp3` | 0.5-1 秒 | 靜電爆裂 |
| `wheelchair_roll.mp3` | 3-5 秒 | 輪椅滾動 |
| `door_creak.mp3` | 2-3 秒 | 門緩緩開啟 |
| `footsteps_distant.mp3` | 3-5 秒 | 遠處腳步聲 |

#### VHS 效果音（3 個）- 優先級：低

| 檔案名稱 | 時長 | 描述 |
|---------|------|------|
| `vhs_tracking.mp3` | 1-2 秒 | VHS 追蹤調整 |
| `vhs_glitch.mp3` | 0.3-0.8 秒 | 畫面干擾 |
| `vhs_rewind.mp3` | 1-3 秒 | 倒帶聲 |

---

## 圖片資源與 AI 生成提示詞

### 🎨 通用風格設定

所有圖片應保持一致的視覺風格：

```
核心風格關鍵字：
- Found footage horror（發現錄影帶恐怖片風格）
- 1990s Taiwan abandoned hospital（1990年代台灣廢棄醫院）
- VHS camera recording quality（VHS 攝影機畫質）
- Green-tinted night vision（墨綠色夜視效果）
- High ISO grain（高 ISO 雜訊顆粒）
- Surveillance camera perspective（監視器視角）
- Atmospheric fog（氛圍霧氣）
- Dim flickering fluorescent lights（昏暗閃爍日光燈）
```

---

### 場景一：B1 舊病房走廊

**Midjourney v6.1 提示詞：**

```
Abandoned hospital corridor in Taiwan 1990s, first-person flashlight POV looking down a long narrow hallway, green-tinted night vision aesthetic, strong one-point perspective with vanishing point at dark end, peeling mint-green paint on lower half of walls with white tile wainscoting, dirty terrazzo floor scattered with old documents and debris, rusty wheelchairs and gurneys along both walls, broken ceiling tiles with exposed pipes, flickering fluorescent tube lights creating harsh shadows, heavy atmospheric fog and dust particles visible in light beams, VHS recording timestamp "DEC 15 1998 - 02:33:15 AM" in bottom right corner, found footage horror film aesthetic, extremely unsettling atmosphere, photorealistic, cinematic lighting from single flashlight source creating dramatic shadows, vertical portrait composition 9:16 aspect ratio --ar 9:16 --v 6.1 --style raw --s 200
```

**Stable Diffusion XL 提示詞：**

```
正向提示詞：
(masterpiece, best quality, photorealistic:1.4), abandoned hospital corridor interior, Taiwan 1990s architecture style, first person POV with handheld flashlight illumination, (green color grading:1.3), night vision camera aesthetic, extremely long narrow hallway with strong linear perspective, vanishing point in darkness, (peeling mint green paint:1.2) on lower walls, white ceramic tile wainscoting, terrazzo floor with cracks and scattered papers, multiple old rusty wheelchairs along walls, broken gurney, collapsed ceiling tiles, flickering fluorescent tube lights, (atmospheric fog and haze:1.2), dust particles floating in light beam, water stains on walls, horror atmosphere, VHS recording quality with scan lines, film grain texture, found footage style, (portrait orientation:1.3), extremely detailed environment

負向提示詞：
cartoon, anime, illustration, painting, drawing, 3d render, CGI, watermark, signature, text overlay, bright cheerful colors, clean modern hospital, people visible, blood, gore, weapons, monsters, daylight, windows with sunlight, colorful, saturated colors, blurry, low quality
```

**Leonardo AI 提示詞：**

```
An extremely photorealistic abandoned hospital corridor from 1990s Taiwan, shot from first-person perspective with a handheld flashlight. The scene features: long narrow hallway with mint-green peeling paint on lower walls, white tile wainscoting, terrazzo floor covered with scattered documents and debris, old rusty wheelchairs lined against walls, broken ceiling tiles exposing pipes, flickering fluorescent lights casting harsh shadows, thick atmospheric fog with visible dust particles in the light beam. Green-tinted surveillance camera aesthetic with VHS quality grain. Horror atmosphere, found footage style. Portrait orientation 9:16.

Style: Cinematic, Photorealistic
Negative prompt: cartoon, illustration, anime, bright colors, clean environment, people
```

---

### 場景二：1F 護理站

**Midjourney v6.1 提示詞：**

```
Abandoned hospital nurse station in Taiwan 1990s, high angle security camera view looking down 25 degrees at cluttered wooden desk, scattered patient files and medical documents everywhere, old beige CRT computer monitor with green phosphor glow, rotary dial telephone with coiled cord, medication cabinet with dusty glass doors partially open, analog wall clock stopped at exactly 3:33, harsh fluorescent overhead lighting casting deep shadows, dust particles visible floating in light beams, peeling wallpaper revealing concrete underneath, water-stained acoustic ceiling tiles, filing cabinets with drawers pulled open, empty coffee cup with mold, ash tray with old cigarette butts, green-tinted security footage aesthetic, VHS quality with scan lines and tracking artifacts, timestamp "DEC 15 1998 02:33 AM" visible, found footage horror atmosphere, extremely detailed cluttered interior, photorealistic, vertical composition --ar 9:16 --v 6.1 --style raw --s 200
```

**Stable Diffusion XL 提示詞：**

```
正向提示詞：
(masterpiece, best quality, photorealistic:1.4), abandoned nurse station interior, Taiwan hospital 1990s, (high angle security camera POV:1.2) looking down, large wooden desk completely covered with (scattered patient files and documents:1.2), old beige CRT computer monitor with green screen glow, rotary dial telephone, (glass medication cabinet:1.1) with dusty shelves, analog wall clock showing 3:33, harsh fluorescent ceiling lights, (dust particles in light beams:1.2), severely peeling wallpaper, water damaged ceiling tiles, open filing cabinet drawers, abandoned coffee mug, green color grading, security camera footage aesthetic, VHS recording quality with horizontal scan lines, film grain, found footage horror style, claustrophobic atmosphere, (portrait orientation:1.3)

負向提示詞：
cartoon, anime, illustration, modern computer, flat screen monitor, bright colors, clean organized desk, people visible, daylight, windows, colorful, low quality, blurry
```

---

### 場景三：B2 太平間

**Midjourney v6.1 提示詞：**

```
Taiwan hospital morgue autopsy room 1990s, low angle POV approximately 100cm height as if crouching, large stainless steel autopsy table dominating center foreground taking up one-third of frame, cold harsh fluorescent tube lights with slight blue flicker mounted on ceiling, white ceramic tile walls covered with rust stains and water damage, row of body refrigerator storage units with chrome handles along back wall, old medical equipment on wheeled stainless steel carts, condensation fog from cold air creating ethereal atmosphere, puddles of water on concrete floor reflecting lights, green-tinted found footage surveillance aesthetic, extremely unsettling clinical horror atmosphere, subtle dark stains on floor barely visible, VHS recording quality with heavy film grain and scan lines, timestamp "DEC 15 1998" in corner, morgue examination light overhead, photorealistic textures, vertical portrait composition --ar 9:16 --v 6.1 --style raw --s 250
```

**Stable Diffusion XL 提示詞：**

```
正向提示詞：
(masterpiece, best quality, photorealistic:1.4), hospital morgue autopsy room interior, Taiwan 1990s, (low angle camera view at 100cm height:1.2), large stainless steel autopsy examination table in foreground, (cold white fluorescent tube lighting:1.2), white ceramic tile walls with rust and water stains, (row of body refrigerator units:1.2) with chrome handles on back wall, wheeled medical equipment carts, (cold condensation fog:1.3), water puddles on concrete floor with reflections, green color grading, found footage horror aesthetic, VHS quality with scan lines and grain, extremely unsettling atmosphere, clinical horror, dark mysterious shadows, (portrait orientation:1.3)

負向提示詞：
cartoon, anime, illustration, bodies visible, corpses, gore, blood splatter, bright colors, warm lighting, clean sterile modern morgue, people, daylight
```

---

### 線索物品：血跡輪椅

**Midjourney v6.1 提示詞：**

```
Old rusty wheelchair closeup in abandoned Taiwan hospital corner, dramatic circular flashlight spotlight illumination from upper left creating strong contrast, deep black vignette around edges fading to center, brown cracked leather seat with fresh wet blood stain glistening in light, chrome metal frame heavily rusted with peeling paint, large rubber wheels with one slightly turned as if just stopped moving, dust particles visible in concentrated light beam, peeling green paint wall visible in dark background, dirty concrete floor, green-tinted VHS surveillance footage aesthetic, found footage horror style, extremely detailed textures on leather and rust, photorealistic, timestamp "DEC 15 1998" visible, square format composition, unsettling atmosphere suggesting recent presence --ar 1:1 --v 6.1 --style raw --s 200
```

---

### 線索物品：燃燒的符咒陣

**Midjourney v6.1 提示詞：**

```
Five traditional yellow Taoist talisman papers arranged in perfect star pentagram pattern on dirty concrete hospital floor, overhead bird's eye view looking straight down, papers partially burned with glowing orange ember edges still smoking, traditional red cinnabar Chinese calligraphy characters and mystical symbols visible on yellow paper, grey ash and black charred fragments scattered around formation, small dying flames flickering on paper edges, ritual candle wax remnants, dark hospital basement setting with tile floor visible at edges, green-tinted VHS surveillance camera aesthetic, found footage horror style, ritual gone wrong atmosphere, photorealistic detailed textures, timestamp "DEC 15 1998", square format --ar 1:1 --v 6.1 --style raw --s 200
```

---

### 鬼影剪影（透明背景）

**Midjourney v6.1 提示詞：**

```
Translucent female ghost figure full body silhouette for game asset, extremely long straight black hair completely covering face hanging down to waist, tattered white hospital patient gown with subtle stains, standing pose slightly hunched forward, ethereal glowing white edges around figure, motion blur ghosting effect on edges, semi-transparent barely visible apparition approximately 30% opacity, Asian horror style inspired by The Ring Sadako and Ju-On Kayako, eerie floating posture, arms hanging limply, bare feet, supernatural glow, isolated figure on pure black background for easy extraction, VHS distortion artifacts around edges of figure, photorealistic but ghostly ethereal quality --v 6.1 --style raw
```

**後製處理說明：**
1. 使用 Photoshop 或 GIMP 去除背景
2. 調整透明度至 20-40%
3. 添加輕微的動態模糊
4. 儲存為 PNG 格式（保留 Alpha 通道）

---

### 護符紙張紋理

**Midjourney v6.1 提示詞：**

```
Traditional Chinese Taoist talisman paper texture flat lay, aged yellow rice paper with natural fiber texture visible, burned and charred irregular edges all around, subtle tea stains and age spots, faint red cinnabar ink bleeding marks, wrinkled and creased surface, old blood stain in corner dark brown, photorealistic material texture, overhead flat scan view for game UI asset, warm amber lighting, extremely detailed paper grain and fibers, square format --ar 1:1 --v 6.1 --style raw --s 150
```

---

## 音效資源與取得建議

### 🎵 免費音效資源網站

#### 推薦網站（依優先順序）

1. **Freesound.org**
   - 優點：大量 CC 授權、社群豐富
   - 搜尋關鍵字：`hospital ambient`, `horror drone`, `water drip cave`, `fluorescent buzz`, `heartbeat slow`, `door creak metal`, `footsteps concrete reverb`

2. **Zapsplat.com**
   - 優點：分類清楚、品質穩定
   - 分類：Horror → Atmospheres, Medical → Hospital Ambience, UI → Buttons

3. **Mixkit.co**
   - 優點：完全免費商用
   - 搜尋：`horror ambience`, `suspense tension`, `ui click`

4. **Pixabay Audio**
   - 優點：無需註冊、免費商用
   - 搜尋：`creepy hospital`, `tension drone`, `notification sound`

5. **BBC Sound Effects**
   - 優點：專業錄音品質、CC 授權
   - 分類：Medical, Atmosphere, Footsteps

---

### 🔧 音效製作建議

#### 環境音製作（使用 Audacity）

**走廊環境音 (amb_corridor.mp3) 組合配方：**
```
基底層：低頻嗡嗡聲（40-60Hz）-20dB
中層：空調通風聲 -15dB
點綴：偶發的金屬敲擊聲 -25dB
點綴：遠處的腳步聲迴音 -30dB
處理：加入長混響（3-5秒 decay）
```

**護理站環境音 (amb_nurse.mp3) 組合配方：**
```
基底層：辦公室低頻雜音 -18dB
中層：日光燈電流嗡嗡聲 -12dB
點綴：時鐘滴答聲 -20dB
點綴：紙張翻動聲 -28dB
處理：輕微高頻衰減，增加封閉感
```

**太平間環境音 (amb_morgue.mp3) 組合配方：**
```
基底層：冷藏設備低頻運轉聲（60Hz）-15dB
中層：金屬表面迴響 -22dB
點綴：水滴聲 -25dB
點綴：偶發的金屬碰撞 -30dB
處理：加入短混響，強調金屬質感
```

---

#### 護符音效製作建議

**talisman_activate.mp3（啟動音）**
```
組成元素：
1. 銅鈴聲（真實錄製或採樣）
2. 低頻共鳴（合成器製作，80-120Hz）
3. 風聲 whoosh 效果
4. 輕微的火焰燃燒聲前奏

處理：
- 銅鈴加入長 reverb
- 低頻做漸強（fade in 0.5秒）
- 整體時長控制在 1.5-2 秒
```

**talisman_burn.mp3（燃燒音）**
```
組成元素：
1. 紙張燃燒劈啪聲
2. 火焰呼呼聲
3. 低頻能量釋放聲（合成）
4. 高頻能量消散聲

處理：
- 火焰聲做漸強再漸弱
- 加入 distortion 增加張力
- 時長 2-3 秒
```

**talisman_seal.mp3（封印完成音）**
```
組成元素：
1. 深沉的鐘聲或銅鑼聲
2. 能量釋放的 whoosh
3. 低頻衝擊波
4. 高頻泛音消散

處理：
- 鐘聲使用真實採樣
- 加入 sidechain compression 產生 pumping 效果
- 時長 1-2 秒，尾音漸弱
```

---

### 📋 音效技術規格

| 參數 | 建議值 |
|-----|-------|
| 格式 | MP3 (128-192kbps) 或 OGG |
| 取樣率 | 44.1kHz |
| 位元深度 | 16-bit |
| 聲道 | 立體聲（環境音）/ 單聲道（UI 音效）|
| 響度標準 | -16 LUFS（整合響度）|
| 循環音 | 確保首尾無縫銜接 |

---

## 程式碼優化建議

### 1. 新增音效播放系統

建議新增 `src/hooks/useAudio.ts`：

```typescript
// src/hooks/useAudio.ts
import { useCallback, useEffect, useRef } from 'react'

interface AudioOptions {
  volume?: number
  loop?: boolean
  fadeIn?: number
  fadeOut?: number
}

export function useAudio() {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())
  const ambientRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback((src: string, options: AudioOptions = {}) => {
    const { volume = 0.5, loop = false, fadeIn = 0 } = options
    
    let audio = audioRefs.current.get(src)
    if (!audio) {
      audio = new Audio(src)
      audioRefs.current.set(src, audio)
    }
    
    audio.volume = fadeIn > 0 ? 0 : volume
    audio.loop = loop
    audio.currentTime = 0
    audio.play().catch(() => {})
    
    if (fadeIn > 0) {
      const step = volume / (fadeIn / 50)
      const interval = setInterval(() => {
        if (audio!.volume < volume) {
          audio!.volume = Math.min(audio!.volume + step, volume)
        } else {
          clearInterval(interval)
        }
      }, 50)
    }
    
    return audio
  }, [])

  const playAmbient = useCallback((src: string, volume = 0.3) => {
    if (ambientRef.current) {
      ambientRef.current.pause()
    }
    ambientRef.current = play(src, { volume, loop: true, fadeIn: 1000 })
  }, [play])

  const stopAmbient = useCallback((fadeOut = 1000) => {
    if (!ambientRef.current) return
    
    const audio = ambientRef.current
    const step = audio.volume / (fadeOut / 50)
    const interval = setInterval(() => {
      if (audio.volume > 0.01) {
        audio.volume = Math.max(0, audio.volume - step)
      } else {
        audio.pause()
        clearInterval(interval)
      }
    }, 50)
  }, [])

  const playUI = useCallback((type: 'click' | 'drawer_open' | 'drawer_close' | 'scan' | 'notification') => {
    const sounds: Record<string, string> = {
      click: '/audio/ui/ui_click.mp3',
      drawer_open: '/audio/ui/ui_drawer_open.mp3',
      drawer_close: '/audio/ui/ui_drawer_close.mp3',
      scan: '/audio/ui/ui_scan_start.mp3',
      notification: '/audio/ui/ui_notification.mp3',
    }
    play(sounds[type], { volume: 0.4 })
  }, [play])

  const playGhost = useCallback((type: 'whisper' | 'breath' | 'scream' | 'static') => {
    const sounds: Record<string, string> = {
      whisper: '/audio/ghost/ghost_whisper.mp3',
      breath: '/audio/ghost/ghost_breath.mp3',
      scream: '/audio/ghost/ghost_scream.mp3',
      static: '/audio/ghost/static_burst.mp3',
    }
    play(sounds[type], { volume: 0.6 })
  }, [play])

  const playTalisman = useCallback((type: 'activate' | 'burn' | 'seal') => {
    const sounds: Record<string, string> = {
      activate: '/audio/talisman/talisman_activate.mp3',
      burn: '/audio/talisman/talisman_burn.mp3',
      seal: '/audio/talisman/talisman_seal.mp3',
    }
    play(sounds[type], { volume: 0.7 })
  }, [play])

  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      audioRefs.current.clear()
    }
  }, [])

  return {
    play,
    playAmbient,
    stopAmbient,
    playUI,
    playGhost,
    playTalisman,
  }
}
```

### 2. 場景切換時自動更換環境音

在 `GameShell.tsx` 中整合音效系統：

```typescript
// 在 GameShell.tsx 中
import { useAudio } from './hooks/useAudio'

// 在 component 內
const { playAmbient, playUI, playGhost, playTalisman } = useAudio()

// 場景切換時
useEffect(() => {
  const scene = SCENES[sceneId]
  if (scene.bgAudio) {
    playAmbient(scene.bgAudio)
  }
}, [sceneId, playAmbient])

// 按鈕點擊時
const handleButtonClick = (action: string) => {
  playUI('click')
  // ... 執行動作
}

// 護符啟動時
const useTalisman = () => {
  playTalisman('activate')
  // ... 原有邏輯
}
```

### 3. 效能優化建議

```typescript
// 使用 React.memo 優化重複渲染
export const CameraHUD = React.memo(function CameraHUD(props: CameraHUDProps) {
  // ...
})

// 使用 useMemo 快取計算結果
const threatLabel = useMemo(() => {
  return status === 'unstable' ? '危險' : script.danger > 0.7 ? '偏高' : '警戒'
}, [status, script.danger])

// 使用 useCallback 快取回調函數
const gotoScene = useCallback((id: SceneId) => {
  // ...
}, [])
```

---

## 完整檔案結構

```
ghosth_project/
├── public/
│   ├── images/
│   │   ├── scenes/
│   │   │   ├── scene01_corridor.png      ⚠️ 需正式素材
│   │   │   ├── scene02_nurse_station.png ⚠️ 需正式素材
│   │   │   ├── scene03_xray_room.png     🔲 待新增
│   │   │   ├── scene04_operating_room.png 🔲 待新增
│   │   │   └── scene05_morgue.png        ⚠️ 需正式素材
│   │   ├── items/
│   │   │   ├── item_wheelchair.png       🔲 待新增
│   │   │   ├── item_talisman_burned.png  🔲 待新增
│   │   │   ├── item_patient_file.png     🔲 待新增
│   │   │   └── item_nurse_diary.png      🔲 待新增
│   │   ├── ghosts/
│   │   │   ├── ghost_figure.png          🔲 待新增
│   │   │   └── ghost_face.png            🔲 待新增
│   │   └── ui/
│   │       ├── ui_talisman_paper.png     🔲 待新增
│   │       ├── ui_vhs_noise.gif          🔲 待新增
│   │       └── ui_scan_grid.svg          🔲 待新增
│   │
│   └── audio/
│       ├── ambient/
│       │   ├── amb_hospital_base.mp3     ❌ 缺失
│       │   ├── amb_corridor.mp3          ❌ 缺失
│       │   ├── amb_nurse.mp3             ❌ 缺失
│       │   └── amb_morgue.mp3            ❌ 缺失
│       ├── loops/
│       │   ├── loop_drip.mp3             ❌ 缺失
│       │   ├── loop_fluorescent.mp3      ❌ 缺失
│       │   ├── loop_fridge.mp3           ❌ 缺失
│       │   └── loop_heartbeat.mp3        ❌ 缺失
│       ├── ui/
│       │   ├── ui_click.mp3              ❌ 缺失
│       │   ├── ui_drawer_open.mp3        ❌ 缺失
│       │   ├── ui_drawer_close.mp3       ❌ 缺失
│       │   ├── ui_scan_start.mp3         ❌ 缺失
│       │   ├── ui_scan_complete.mp3      ❌ 缺失
│       │   └── ui_notification.mp3       ❌ 缺失
│       ├── talisman/
│       │   ├── talisman_activate.mp3     ❌ 缺失
│       │   ├── talisman_burn.mp3         ❌ 缺失
│       │   └── talisman_seal.mp3         ❌ 缺失
│       ├── ghost/
│       │   ├── ghost_whisper.mp3         ❌ 缺失
│       │   ├── ghost_breath.mp3          ❌ 缺失
│       │   ├── ghost_scream.mp3          ❌ 缺失
│       │   ├── static_burst.mp3          ❌ 缺失
│       │   ├── wheelchair_roll.mp3       ❌ 缺失
│       │   ├── door_creak.mp3            ❌ 缺失
│       │   └── footsteps_distant.mp3     ❌ 缺失
│       └── vhs/
│           ├── vhs_tracking.mp3          ❌ 缺失
│           ├── vhs_glitch.mp3            ❌ 缺失
│           └── vhs_rewind.mp3            ❌ 缺失
│
├── src/
│   ├── components/
│   │   ├── CameraHUD.tsx                 ✅ 完成
│   │   ├── ClueDrawer.tsx                ✅ 完成
│   │   ├── TalismanOverlay.tsx           ✅ 完成
│   │   └── VHSOverlaySystem.tsx          ✅ 完成
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.ts    ✅ 完成
│   │   ├── useVHSTimestamp.ts            ✅ 完成
│   │   └── useAudio.ts                   🔲 待新增
│   ├── App.tsx                           ✅ 完成
│   ├── GameShell.tsx                     ✅ 完成（待整合音效）
│   ├── scenes.ts                         ✅ 完成
│   ├── scenesEvents.ts                   ✅ 完成
│   ├── styles.css                        ✅ 完成
│   └── main.tsx                          ✅ 完成
│
├── index.html                            ✅ 完成
├── package.json                          ✅ 完成
├── tsconfig.json                         ✅ 完成
├── vite.config.ts                        ✅ 完成
├── README.md                             ✅ 完成
├── ASSETS.md                             ✅ 完成
└── COMPLETE_GUIDE.md                     ✅ 本文件

圖例：
✅ 完成
⚠️ 需替換為正式素材
🔲 待新增
❌ 缺失
```

---

## 📊 資源需求統計

| 類別 | 需要數量 | 已有 | 缺失 |
|-----|---------|-----|------|
| 場景圖片 | 5 | 3（佔位）| 2 |
| 物品圖片 | 4 | 0 | 4 |
| 鬼影圖片 | 2 | 0 | 2 |
| UI 圖片 | 3 | 0 | 3 |
| 環境音效 | 4 | 0 | 4 |
| 循環音效 | 4 | 0 | 4 |
| UI 音效 | 6 | 0 | 6 |
| 護符音效 | 3 | 0 | 3 |
| 靈異音效 | 7 | 0 | 7 |
| VHS 音效 | 3 | 0 | 3 |
| **總計** | **41** | **3** | **38** |

---

## 🚀 建議開發順序

### 第一階段：核心體驗（1-2 週）
1. ✅ 使用 AI 生成 3 張主要場景圖
2. ✅ 收集 4 個環境音效 + 6 個 UI 音效
3. ✅ 實作音效播放系統
4. ✅ 整合音效到現有功能

### 第二階段：內容擴充（2-3 週）
1. 🔲 新增 2 個額外場景（X光室、手術室）
2. 🔲 製作 4 張線索物品圖
3. 🔲 收集靈異事件音效
4. 🔲 實作物品檢視功能

### 第三階段：打磨細節（1-2 週）
1. 🔲 製作鬼影剪影 + 驚嚇系統
2. 🔲 優化 VHS 音效整合
3. 🔲 新增 CCTV 回放功能
4. 🔲 效能優化與測試

---

*文件最後更新：2024年12月*
*版本：v1.0*
