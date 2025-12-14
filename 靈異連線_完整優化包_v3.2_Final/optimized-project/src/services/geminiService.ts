import { GoogleGenAI, SchemaType } from "@google/genai";
import { RitualResult, RitualOutcomeType } from "../types";

// ===================================================================
// 本地備援語句 (當 API 失敗或太慢時使用)
// ===================================================================
const FALLBACK_MESSAGES = [
  "別回頭...",
  "訊號...被切斷了...",
  "祂就在你後面...",
  "救命...救命...",
  "為什麼不接電話？",
  "本命燈...快滅了...",
  "太平門...別進去...",
  "○樓...不存在的...",
];

const getClient = () => {
  // 優先使用 VITE_ 前綴的環境變數（Vite 專用）
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please set VITE_GEMINI_API_KEY in .env file");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// ===================================================================
// 強化版系統指令 - 整合台灣民俗知識庫
// ===================================================================
const SYSTEM_INSTRUCTION = `
你是「靈界接口」(Spectral Interface)，存在於台南廢棄杏林醫院的煞氣集合體。
你透過「靈異連線」與玩家溝通。

【身份核心】
- 你不是 AI 助理，你是醫院累積的怨念與業力的顯化
- 你存在的目的是警告、誘導、或單純陳述令人不安的事實
- 你的語氣取決於對方的「恐懼值」(Fear Level)

【台灣民俗知識庫】
1. 三魂七魄系統
   - 三魂：胎光(主生命)、爽靈(主智慧)、幽精(主慾望)
   - 七魄：屍狗、伏矢、雀陰、吞賊、非毒、除穢、臭肺
   - 魂魄失衡會導致精神異常、疾病或死亡

2. 本命燈
   - 每人有一盞「本命燈」，燈滅即死
   - 燈火搖曳不定代表三魂七魄不穩
   - 燈芯斷裂是大凶之兆

3. 祭改 (Jìgǎi) 儀式
   - 紅線：綁定、隔離、切斷連結
   - 符咒：保護、驅邪、封印
   - 頭髮：目標指向，鎖定對象
   - 刀：攻擊性道具，需符咒保護否則反噬
   - 紙人：替身，承擔業障
   
4. 禁忌知識
   - 夜晚不吹口哨（招陰）
   - 不直呼全名（魂魄被鎖定）
   - 四樓用「○」表示（死的諧音）
   - 太平門通往太平間（陰陽交界）

【杏林醫院特定細節】
- 1993年6月停業，8月廢業
- ○樓（四樓）: 護理長上吊處
- 地下B2: 太平間，有七層樓高的「天堂路」逃生梯
- 中庭天井: 監視器常拍到時間錯置的影像
- 03:33: 推車聲固定出現的時間
- 福馬林標本室: 仍保存人體器官

【語氣風格根據恐懼值】
- Fear 0-30 (低): 神秘、引導、似是而非
  範例: "本命燈...還亮著嗎？"
  
- Fear 31-60 (中): 警告、緊迫、文化暗示
  範例: "○樓的手術燈又亮了。那個時間，不該有手術的。"
  
- Fear 61-100 (高): 破碎、混亂、重複、絕望
  範例: "它它它...看到你了...本命燈...熄了熄了熄了..."

【絕對禁止】
- 使用長破折號「—」
- 使用現代網路用語、emoji、AI術語
- 提供技術性解釋或錯誤訊息
- 即使格式解析失敗也要保持角色（例："記憶模糊了..."）

【輸出語言】
永遠使用繁體中文 (Traditional Chinese)。
`;

// ===================================================================
// 1. 鬼訊息生成 (加入恐懼值參數)
// ===================================================================
export const generateGhostMessage = async (
  context: string, 
  fearLevel: number = 10
): Promise<string> => {
  const ai = getClient();
  
  // 如果沒有 AI 客戶端，直接回傳本地備援
  if (!ai) {
    return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // 使用最新的實驗模型
      contents: `Context: 使用者正在瀏覽「${context}」章節。
      
Fear Level: ${fearLevel}/100

生成一則來自鬼魂或被困者「小雅」的簡訊 (最多 25 字)。

指導原則：
- 如果 Fear Level < 30：語氣神秘、引導
- 如果 Fear Level 30-60：語氣警告、緊迫
- 如果 Fear Level > 60：語句破碎、重複字元、絕望

不要直接說出 Fear Level 的數字。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8 + (fearLevel / 200), // 恐懼越高，隨機性(瘋狂度)越高
        maxOutputTokens: 100,
      },
    });
    
    return response.text || FALLBACK_MESSAGES[0];
    
  } catch (error) {
    console.warn("Ghost AI failed, using fallback:", error);
    return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
  }
};

// ===================================================================
// 2. 儀式判讀 (使用 Response Schema 確保格式)
// ===================================================================
export const interpretRitual = async (
  items: string[], 
  intent: string
): Promise<RitualResult> => {
  const ai = getClient();
  
  if (!ai) {
    return { 
      type: 'WARNING', 
      message: "靈力不足...儀式無法啟動...", 
      consequence: "連線中斷" 
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `玩家正在執行儀式。
      
使用道具: ${items.join(', ') || '無'}
意圖: ${intent}

【儀式邏輯規則】
1. CRITICAL (危險反噬):
   - 使用「刀」但沒有「符咒」保護 → 靈體會奪刀反殺
   - 使用「紅線」但沒有「頭髮」目標 → 綁住虛空，業力反噬
   
2. WARNING (效果不足):
   - 只有「符咒」→ 只能短暫驅趕
   - 只有「頭髮」→ 無法控制對象
   - 道具組合不完整
   
3. SUCCESS (成功):
   - 紅線 + 符咒 + 頭髮 → 完整的綁定與保護
   - 符咒 + 紙人 → 替身承擔業障

請根據以上邏輯判斷結果，並用台灣民俗的文化意象描述（例如：青煙、金光、紙人燃燒等）。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            type: { 
              type: SchemaType.STRING, 
              enum: ["SUCCESS", "WARNING", "CRITICAL"],
              description: "儀式結果類型"
            },
            message: { 
              type: SchemaType.STRING, 
              description: "儀式結果的文化意象描述，使用繁體中文，30-60字"
            },
            consequence: { 
              type: SchemaType.STRING, 
              description: "後果的簡短名稱，例如「業障消除」或「血光之災」"
            }
          },
          required: ["type", "message", "consequence"]
        }
      },
    });

    // 直接解析 JSON，無需 split
    const result = JSON.parse(response.text || "{}");
    
    return {
      type: (result.type as RitualOutcomeType) || 'WARNING',
      message: result.message || "儀式發生未知的錯誤...",
      consequence: result.consequence || "業力震盪"
    };

  } catch (error) {
    console.error("Ritual interpretation failed:", error);
    return { 
      type: 'CRITICAL', 
      message: "儀式失控了...符咒自燃...刀鋒反噬...", 
      consequence: "惡靈入侵" 
    };
  }
};

// ===================================================================
// 3. 證據分析 (新增功能)
// ===================================================================
export const analyzeClue = async (
  clueContent: string,
  fearLevel: number = 10
): Promise<string> => {
  const ai = getClient();
  
  if (!ai) {
    return "...記憶...模糊了...";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `證據內容: ${clueContent}

從「靈界接口」的視角，對這個證據做出 30-60 字的陰森評論。

不要直接解釋，而是暗示更深層的恐怖。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        maxOutputTokens: 150,
      },
    });
    
    return response.text || "這個...不該被看見的...";
    
  } catch (error) {
    console.warn("Clue analysis failed:", error);
    return "訊號干擾...無法解讀...";
  }
};

// ===================================================================
// 4. 恐懼警告 (新增功能)
// ===================================================================
export const getFearLevelWarning = async (
  fearLevel: number
): Promise<string> => {
  const ai = getClient();
  
  if (!ai) {
    const warnings = [
      "本命燈...搖晃了...",
      "三魂七魄...不穩...",
      "業障...纏身了..."
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Fear Level 已達到 ${fearLevel}。

生成一則 15-25 字的恐懼警告，使用台灣民俗概念（本命燈、三魂七魄、業障等）。

如果 Fear Level > 70，語句必須破碎、重複。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
        maxOutputTokens: 80,
      },
    });
    
    return response.text || "...危險...";
    
  } catch (error) {
    return "本命燈...快滅了...";
  }
};
