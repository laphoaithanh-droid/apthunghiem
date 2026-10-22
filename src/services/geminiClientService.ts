export interface GeminiModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isDefault?: boolean;
}

export const AI_MODELS: GeminiModelOption[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    badge: 'Mặc định (Default)',
    description: 'Tốc độ cực nhanh, phản hồi tức thì, tối ưu hóa cho tương tác Socratic và CAT.',
    isDefault: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    badge: 'Suy luận chuyên sâu',
    description: 'Năng lực suy luận sư phạm đỉnh cao, phân tích di truyền kiến thức đa tầng phức tạp.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng ổn định (Fallback)',
    description: 'Độ ổn định cao, quota dồi dào, luôn sẵn sàng khi các model thế hệ 3 quá tải.',
  },
];

export const FALLBACK_MODEL_CHAIN = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-flash',
];

const STORAGE_KEY_API_KEY = 'gemini_user_api_key';
const STORAGE_KEY_SELECTED_MODEL = 'gemini_user_selected_model';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } catch (e) {
    console.error('Lỗi khi lưu API Key:', e);
  }
}

export function getStoredModel(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_SELECTED_MODEL) || 'gemini-3-flash-preview';
  } catch (e) {
    return 'gemini-3-flash-preview';
  }
}

export function saveStoredModel(model: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SELECTED_MODEL, model);
  } catch (e) {
    console.error('Lỗi khi lưu Model:', e);
  }
}

export interface GenerateWithFallbackParams {
  prompt: string;
  systemInstruction?: string;
  preferredModel?: string;
  onModelAttempt?: (model: string, attemptIndex: number) => void;
}

export interface GenerateResult {
  text: string;
  usedModel: string;
  fallbackCount: number;
}

/**
 * Gọi API Gemini trực tiếp từ trình duyệt qua REST API với cơ chế tự động Fallback & Retry
 */
export async function generateContentWithFallback({
  prompt,
  systemInstruction,
  preferredModel,
  onModelAttempt,
}: GenerateWithFallbackParams): Promise<GenerateResult> {
  const apiKey = getStoredApiKey();

  // Chuỗi danh sách model dự phòng theo thứ tự ưu tiên
  const initialModel = preferredModel || getStoredModel() || 'gemini-3-flash-preview';
  const modelQueue = [
    initialModel,
    ...FALLBACK_MODEL_CHAIN.filter((m) => m !== initialModel),
  ];

  let lastErrorMsg = '';

  for (let i = 0; i < modelQueue.length; i++) {
    const currentModel = modelQueue[i];
    if (onModelAttempt) onModelAttempt(currentModel, i + 1);

    try {
      // 1. Thử gọi trực tiếp từ client nếu có API key người dùng
      if (apiKey && apiKey.length > 10) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

        const payload: any = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const code = response.status;
          const statusText = errData?.error?.status || errData?.error?.message || response.statusText;
          throw new Error(`${code} ${statusText}`);
        }

        const data = await response.json();
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (outputText) {
          return {
            text: outputText,
            usedModel: currentModel,
            fallbackCount: i,
          };
        }
      }

      // 2. Dự phòng: Thử gọi proxy endpoint của backend server nếu đang chạy
      try {
        const serverResp = await fetch('/api/learnmap/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptInput: prompt,
            model: currentModel,
          }),
        });

        if (serverResp.ok) {
          const sData = await serverResp.json();
          if (sData.status === 'success' && sData.content) {
            return {
              text: sData.content,
              usedModel: currentModel,
              fallbackCount: i,
            };
          }
        }
      } catch (beErr) {
        // bỏ qua nếu server không phản hồi
      }

      throw new Error('API không trả về kết quả hợp lệ');
    } catch (err: any) {
      console.warn(`Lỗi với model ${currentModel}:`, err?.message);
      lastErrorMsg = err?.message || String(err);
      // Tiếp tục vòng lặp fallback sang model tiếp theo
    }
  }

  // Nếu tất cả các model đều thất bại -> Báo lỗi nguyên văn theo AI_INSTRUCTIONS
  throw new Error(lastErrorMsg || '429 RESOURCE_EXHAUSTED / Tất cả mô hình dự phòng đều đã hết hạn ngạch.');
}
