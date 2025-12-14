# 高優先級組件使用指南

## 📦 已實作的組件

本專案已實作所有高優先級 UI/UX 組件，提供完整的用戶反饋和互動體驗。

### 1. Button 組件 ✅
**檔案位置**: `src/components/Button.tsx`

改進的按鈕組件，支援載入狀態和禁用狀態。

#### 特性
- 多種樣式變體（primary, secondary, danger, cursed）
- 載入狀態顯示
- 禁用狀態支援
- 全寬選項
- 完整的鍵盤和螢幕閱讀器支援

#### 使用範例
```tsx
import Button from './components/Button';

// 基本使用
<Button variant="primary" onClick={handleClick}>
  點擊我
</Button>

// 載入狀態
<Button variant="primary" loading={isLoading} onClick={handleAsyncAction}>
  送出
</Button>

// 禁用狀態
<Button variant="secondary" disabled>
  無法點擊
</Button>

// 全寬按鈕
<Button variant="danger" fullWidth>
  刪除
</Button>
```

#### API
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `loading` | `boolean` | `false` | 顯示載入狀態 |
| `disabled` | `boolean` | `false` | 禁用按鈕 |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'cursed'` | `'primary'` | 按鈕樣式 |
| `fullWidth` | `boolean` | `false` | 全寬顯示 |
| `onClick` | `function` | - | 點擊事件處理器 |

---

### 2. Tooltip 組件 ✅
**檔案位置**: `src/components/Tooltip.tsx`

工具提示組件，在懸停時顯示說明文字。

#### 特性
- 四個方向（top, bottom, left, right）
- 平滑動畫效果
- 自動定位
- 恐怖風格設計

#### 使用範例
```tsx
import Tooltip from './components/Tooltip';

<Tooltip text="這是提示文字" position="top">
  <button>懸停查看</button>
</Tooltip>
```

#### API
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `text` | `string` | - | 提示文字（必填） |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 提示位置 |
| `children` | `ReactNode` | - | 觸發元素 |

---

### 3. ConfirmDialog 組件 ✅
**檔案位置**: `src/components/ConfirmDialog.tsx`

確認對話框，用於需要用戶確認的重要操作。

#### 特性
- 三種變體（info, warning, danger）
- 支援載入狀態
- ESC 鍵關閉
- 防止背景滾動
- 完整的無障礙支援

#### 使用範例
```tsx
import { useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // 執行操作
    await performAction();
    setLoading(false);
    setShowDialog(false);
  };

  return (
    <>
      <button onClick={() => setShowDialog(true)}>刪除</button>
      
      <ConfirmDialog
        isOpen={showDialog}
        title="確認刪除"
        message="您確定要刪除此項目嗎？此操作無法撤銷。"
        confirmText="刪除"
        cancelText="取消"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
        loading={loading}
      />
    </>
  );
}
```

#### API
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `isOpen` | `boolean` | - | 是否顯示（必填） |
| `title` | `string` | - | 標題（必填） |
| `message` | `string` | - | 訊息（必填） |
| `confirmText` | `string` | `'確認'` | 確認按鈕文字 |
| `cancelText` | `string` | `'取消'` | 取消按鈕文字 |
| `variant` | `'info' \| 'warning' \| 'danger'` | `'info'` | 對話框類型 |
| `onConfirm` | `function` | - | 確認回調（必填） |
| `onCancel` | `function` | - | 取消回調（必填） |
| `loading` | `boolean` | `false` | 確認載入狀態 |

---

### 4. Toast 通知系統 ✅
**檔案位置**: `src/components/Toast.tsx`

Toast 通知組件，用於顯示臨時訊息。

#### 特性
- 四種類型（success, error, warning, info）
- 自動消失
- 可手動關閉
- 堆疊顯示
- 簡單的 Hook API

#### 使用範例
```tsx
import { useToast } from './components/Toast';

function MyComponent() {
  const { success, error, warning, info, ToastContainer } = useToast();

  const handleSuccess = () => {
    success('操作成功！');
  };

  const handleError = () => {
    error('發生錯誤！');
  };

  return (
    <>
      <ToastContainer />
      
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={() => warning('警告訊息')}>Warning</button>
      <button onClick={() => info('資訊提示')}>Info</button>
    </>
  );
}
```

#### API
**useToast Hook 返回值**:
| 方法 | 類型 | 說明 |
|------|------|------|
| `success(message)` | `function` | 顯示成功訊息 |
| `error(message)` | `function` | 顯示錯誤訊息 |
| `warning(message)` | `function` | 顯示警告訊息 |
| `info(message)` | `function` | 顯示資訊訊息 |
| `ToastContainer` | `component` | Toast 容器組件 |

---

### 5. LoadingSpinner 組件 ✅ (已更新)
**檔案位置**: `src/components/LoadingSpinner.tsx`

載入指示器組件，已更新支援內嵌模式。

#### 特性
- 全螢幕和內嵌模式
- 三種大小（sm, md, lg）
- 自訂訊息
- 螢幕閱讀器支援

#### 使用範例
```tsx
import LoadingSpinner from './components/LoadingSpinner';

// 全螢幕載入
<LoadingSpinner message="載入資料中..." size="lg" />

// 內嵌載入（用於按鈕）
<LoadingSpinner size="sm" fullScreen={false} />
```

---

### 6. ErrorBoundary 組件 ✅ (已有)
**檔案位置**: `src/components/ErrorBoundary.tsx`

錯誤邊界組件，捕捉 React 錯誤。

#### 使用範例
```tsx
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

---

## 🎨 組件展示頁面

查看所有組件的實際效果：

**檔案位置**: `src/examples/ComponentsDemo.tsx`

在你的應用中引入此組件可查看完整的組件展示和使用範例。

```tsx
import ComponentsDemo from './examples/ComponentsDemo';

// 在路由中添加
<Route path="/components-demo" element={<ComponentsDemo />} />
```

---

## 🎯 實作狀態

### 高優先級 ✅ 全部完成
- [x] LoadingSpinner 組件（已更新）
- [x] ErrorBoundary 組件（已有）
- [x] Button 組件（新增）
- [x] Tooltip 組件（新增）
- [x] ConfirmDialog 組件（新增）
- [x] Toast 通知系統（新增）

### 中優先級 📋 建議實作
- [ ] 圖片延遲載入
- [ ] 移動端觸控優化
- [ ] 骨架屏（Skeleton Loading）

### 低優先級 📝 未來考慮
- [ ] 首次使用教學
- [ ] 搜尋功能
- [ ] 主題切換

---

## 📚 最佳實踐

### 1. 按鈕使用
- 使用 `loading` 狀態表示非同步操作
- 使用 `disabled` 防止多次提交
- 選擇適當的 `variant` 表達操作意圖

### 2. Toast 通知
- 成功操作使用 `success`
- 錯誤使用 `error`
- 警告使用 `warning`
- 一般資訊使用 `info`
- 保持訊息簡短明瞭

### 3. 確認對話框
- 危險操作使用 `variant="danger"`
- 重要操作使用 `variant="warning"`
- 一般確認使用 `variant="info"`
- 提供清晰的操作說明

### 4. Tooltip
- 用於解釋圖示或不明確的UI元素
- 保持文字簡短
- 不要用於重要資訊

---

## 🎓 無障礙支援

所有組件都遵循 WCAG 2.1 Level AA 標準：

- ✅ 完整的鍵盤導航支援
- ✅ ARIA 標籤和角色
- ✅ 螢幕閱讀器友善
- ✅ 焦點管理
- ✅ 色彩對比度符合標準

---

## 💡 快速開始

1. 安裝依賴（如果尚未安裝）:
```bash
npm install
```

2. 啟動開發伺服器:
```bash
npm run dev
```

3. 在你的組件中引入並使用:
```tsx
import Button from './components/Button';
import Tooltip from './components/Tooltip';
import { useToast } from './components/Toast';

function MyApp() {
  const { success, ToastContainer } = useToast();
  
  return (
    <>
      <ToastContainer />
      <Tooltip text="點擊按鈕">
        <Button onClick={() => success('成功！')}>
          點擊我
        </Button>
      </Tooltip>
    </>
  );
}
```

---

## 📝 更新日誌

### v1.0.0 (2025-12-13)
- ✅ 實作 Button 組件
- ✅ 實作 Tooltip 組件
- ✅ 實作 ConfirmDialog 組件
- ✅ 實作 Toast 通知系統
- ✅ 更新 LoadingSpinner 組件
- ✅ 建立 ComponentsDemo 展示頁面

---

**所有高優先級組件已完成！** 🎉

可立即在專案中使用，提升用戶體驗。
