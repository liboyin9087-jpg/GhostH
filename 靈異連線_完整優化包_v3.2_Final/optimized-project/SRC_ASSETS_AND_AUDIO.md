# 音頻資源和資產指南

## 概述

此文件描述 GhostH 專案所需的音頻資源及其放置位置。**注意：本專案不包含二進制音頻文件**，您需要自行準備或獲取這些資源。

## 目錄結構

所有音頻文件應放置在以下目錄：

```
靈異連線_完整優化包_v3.2_Final/optimized-project/public/sounds/
```

## 必需的音頻文件

### 1. 環境音效

#### `hospital_hum.mp3`
- **用途**：醫院背景環境音（循環播放）
- **建議特性**：
  - 低沉的嗡嗡聲
  - 可無縫循環
  - 時長：30-60秒
  - 格式：MP3
  - 比特率：128-192 kbps
- **放置路徑**：`public/sounds/hospital_hum.mp3`
- **使用場景**：遊戲主要場景的背景音

#### `static_noise.mp3`
- **用途**：靜電雜訊效果（隨機事件）
- **建議特性**：
  - 短促的靜電雜訊
  - 時長：2-5秒
  - 格式：MP3
- **放置路徑**：`public/sounds/static_noise.mp3`
- **使用場景**：環境隨機事件觸發

### 2. 驚嚇音效

#### `woman_scream.mp3`
- **用途**：女性尖叫聲（驚嚇效果）
- **建議特性**：
  - 高音調的尖叫聲
  - 時長：1-3秒
  - 格式：MP3
  - 較高音量
- **放置路徑**：`public/sounds/woman_scream.mp3`
- **使用場景**：JumpScareManager 觸發的驚嚇事件

### 3. 特殊效果

#### `paper_burn.mp3`
- **用途**：紙張燃燒聲效
- **建議特性**：
  - 紙張燃燒的細微聲音
  - 時長：3-8秒
  - 格式：MP3
- **放置路徑**：`public/sounds/paper_burn.mp3`
- **使用場景**：特定劇情事件

## 音頻佔位符

如果您暫時沒有音頻文件，可以：

1. **使用靜音文件**：創建空白 MP3 文件作為佔位符
2. **禁用音頻**：在遊戲設置中關閉音效
3. **延後添加**：代碼會優雅地處理缺失的音頻文件

## 音頻規格建議

### 通用規格
- **格式**：MP3 或 OGG（推薦 MP3 以獲得更好的瀏覽器兼容性）
- **採樣率**：44.1 kHz 或 48 kHz
- **比特率**：128-192 kbps（環境音），256 kbps（驚嚇音效）
- **聲道**：立體聲（Stereo）

### 文件大小建議
- 環境音：< 1 MB（因需循環播放）
- 驚嚇音效：< 500 KB
- 特效音：< 500 KB

## 獲取音頻資源的方式

### 免費資源網站
- **Freesound.org**：社區分享的免費音效
- **Zapsplat.com**：免費音效庫（需註冊）
- **BBC Sound Effects**：BBC 提供的免費音效檔案
- **YouTube Audio Library**：YouTube 提供的免費音樂和音效

### 自製音效
- 使用 **Audacity**（免費）錄製和編輯音效
- 使用手機錄音 App 收集環境音
- 使用線上音效生成器創建音效

### 注意事項
⚠️ **版權聲明**：
- 確保您使用的音頻文件有適當的授權
- 商業用途請使用公共領域或購買授權的音效
- 遵守 Creative Commons 授權條款

## 測試音頻設置

### 驗證音頻文件

1. 確保所有文件都放在 `public/sounds/` 目錄下
2. 文件名稱必須完全匹配（包括大小寫和副檔名）
3. 在瀏覽器中測試音頻播放

### 瀏覽器檢查

在瀏覽器開發者工具的 Console 中執行：

```javascript
// 測試音頻文件是否可訪問
fetch('/sounds/hospital_hum.mp3')
  .then(response => {
    if (response.ok) {
      console.log('✓ hospital_hum.mp3 found');
    } else {
      console.error('✗ hospital_hum.mp3 not found');
    }
  });
```

## 代碼中的音頻使用

### 使用 useAudioContext Hook

```tsx
import { useAudioContext } from './hooks/useAudioContext';

function MyComponent() {
  const { enableAudio, playSound } = useAudioContext();

  const handlePlaySound = async () => {
    // 首次需要用戶互動來啟用音頻
    await enableAudio();
    
    // 播放音效
    await playSound('/sounds/hospital_hum.mp3', {
      volume: 0.5,
      loop: true
    });
  };

  return (
    <button onClick={handlePlaySound}>播放音效</button>
  );
}
```

### 使用 AmbientManager

```tsx
import AmbientManager from './managers/AmbientManager';

function App() {
  const [fearLevel, setFearLevel] = useState(0);

  return (
    <AmbientManager 
      fearLevel={fearLevel} 
      isActive={true}
      onAmbientEvent={(eventType) => {
        console.log('Ambient event:', eventType);
      }}
    >
      {/* Your app content */}
    </AmbientManager>
  );
}
```

## 故障排除

### 音頻無法播放

1. **檢查文件路徑**：確保路徑正確（`/sounds/filename.mp3`）
2. **用戶互動**：音頻需要在用戶互動後才能播放（瀏覽器限制）
3. **檢查 Console**：查看是否有錯誤訊息
4. **檢查文件格式**：確保是有效的 MP3 文件

### 音頻延遲

1. **優化文件大小**：壓縮音頻文件
2. **使用 CDN**：考慮使用內容分發網路
3. **預加載**：提前加載常用音效

## 進階配置

### 添加新音效

1. 將新音效文件放入 `public/sounds/` 目錄
2. 更新此文件以記錄新音效
3. 在代碼中使用 `playSound('/sounds/your-new-sound.mp3')`

### 自定義音量

```tsx
playSound('/sounds/hospital_hum.mp3', {
  volume: 0.3,  // 0-1 範圍
  loop: true,   // 循環播放
  fadeIn: 2000  // 2秒淡入
});
```

## 參考資料

- [Web Audio API 文檔](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [音頻文件格式指南](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)
- [瀏覽器音頻自動播放政策](https://developer.chrome.com/blog/autoplay/)

---

**最後更新**：2024-12-14  
**版本**：1.0.0  
**維護者**：GhostH 開發團隊
