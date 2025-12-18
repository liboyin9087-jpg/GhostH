# 專案規劃總覽（Demo 版）

## Demo 目標（30 分鐘體驗）
- 單次遊玩 30 分鐘內，完成「探索 → 緊張累積 → 情緒高潮 → 死亡／切斷」的閉環
- 風格：台灣 1990s 廢棄醫院 + Analog Horror（VHS/CRT/CCTV）+ Found Footage 的尋找感
- 互動核心：手電筒視角、拾取道具、UI 狀態切換、少量但高辨識的線索節點

## 影像資產規格（你已定版的規則）
### CUTOUT（道具圖）
- 1:1 方形
- 透明背景 PNG alpha（乾淨去背）
- 寫實、偏舊、髒污、磨損，但**不可太像 3D/CGI**
- 禁止：可讀文字、Logo、水印、介面UI、拼字錯誤

### FOUND（場景圖）
- 1:1 方形
- 第一人稱／手電筒光束、強烈 vignette、VHS 掃描線與雜訊、微晃動、顆粒
- 重要：構圖不要都只在桌上，包含地上、遠景、角落、半遮蔽等不同「尋找視角」

## 模型／風格要求
- 全部以 Nano Banana Pro 風格／模型輸出（你已指定）

## 目前狀態（依你最新提供）
✅ 已完成/確認：
- obj_15_brokenglasses 破裂眼鏡
- obj_19_stretcher 推床（擔架床）
- obj_20_wheelbed 有輪病床
- obj_21_eyedrops 眼藥水
- obj_22_lockerdoor 更衣室鐵櫃門
- obj_23_mirrorfragment 鏡子碎片
- obj_24_bloodbag 血袋
- obj_25_eeghelmet 腦波監測裝置
- obj_26_wallcorner 牆角一隅
- obj_27_hospitalcurtain 醫療布簾
- obj_28_ceilinglamp 吊頂燈
- obj_29_bedsidetable 床邊櫃
- obj_30_ctscanphoto 腦部斷層掃描X光片

⛔ 尚未開始：
- obj_14_ritualtalisman 符咒紙
- obj_16_hospitalfile 病歷紙本檔案
- obj_17_patientbracelet 病人識別手環

🟡 需補件：
- obj_13_syringe：Found 已完成，需補 Cutout

## 風險（先講清楚，省你後面踩雷）
- 圖資命名/規格若不一致，工程端綁定道具會痛苦（錯一個檔名就整個掉）
- Demo 打包如果把 node_modules 一起壓，體積會爆炸且上傳很容易失敗
- secrets（API KEY）一定要用 Cloud Run / 平台 secrets 管，不要塞進 zip
