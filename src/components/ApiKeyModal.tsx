import React, { useState } from 'react';
import { 
  AI_MODELS, 
  getStoredApiKey, 
  saveStoredApiKey, 
  getStoredModel, 
  saveStoredModel 
} from '../services/geminiClientService';
import { 
  Key, 
  Cpu, 
  Check, 
  ExternalLink, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Zap,
  Layers
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (key: string) => void;
  forced?: boolean; // Khi bắt buộc phải nhập key
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
  forced = false,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [testError, setTestError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredApiKey(apiKey);
    saveStoredModel(selectedModel);
    setSaveSuccess(true);
    if (onKeySaved) onKeySaved(apiKey);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestError('Vui lòng nhập API Key trước khi kiểm tra.');
      setTestingStatus('invalid');
      return;
    }

    setTestingStatus('testing');
    setTestError('');

    try {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`;
      const resp = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping test' }] }],
        }),
      });

      if (resp.ok) {
        setTestingStatus('valid');
      } else {
        const errJson = await resp.json().catch(() => ({}));
        setTestingStatus('invalid');
        setTestError(errJson?.error?.message || `Lỗi HTTP ${resp.status}`);
      }
    } catch (err: any) {
      setTestingStatus('invalid');
      setTestError(err?.message || 'Không thể kết nối đến máy chủ Google AI');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Thiết lập Model AI & Gemini API Key</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cấu hình Người dùng
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lưu vào bộ nhớ trình duyệt (localStorage) • Tự động kích hoạt cơ chế Fallback đa tầng
              </p>
            </div>
          </div>

          {!forced && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Quick link to get API key */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Chưa có API Key của riêng bạn?</div>
                <div className="text-[11px] text-slate-300">
                  Nhận miễn phí từ Google AI Studio trong 30 giây (không cần thẻ tín dụng).
                </div>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all shrink-0"
            >
              <span>Lấy API Key Miễn Phí</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>1. Chọn Mô hình AI Ưu tiên (Thứ tự dự phòng tự động)</span>
              </span>
              <span className="text-[11px] text-purple-300 font-mono">Auto Fallback Retry</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AI_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/40'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-purple-500/30 text-purple-200' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {model.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                      </div>
                      <h4 className="font-bold text-xs text-white mt-2 font-mono">
                        {model.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {model.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>2. Nhập Gemini API Key của bạn</span>
              </span>
              <span className="text-[11px] text-slate-400">Lưu vào trình duyệt</span>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestingStatus('idle');
                }}
                placeholder="Dán API Key (bắt đầu bằng AIzaSy...)"
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Test connection feedback */}
            {testingStatus === 'testing' && (
              <div className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Đang kiểm tra kết nối với Google AI Studio...</span>
              </div>
            )}
            {testingStatus === 'valid' && (
              <div className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>API Key hợp lệ! Đã sẵn sàng tương tác với LearnMap.</span>
              </div>
            )}
            {testingStatus === 'invalid' && (
              <div className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{testError || 'API Key không hợp lệ hoặc hết hạn ngạch (Quota).'}</span>
              </div>
            )}
          </div>

          {/* Quick guide steps */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300">Quy tắc Fallback & Bảo mật:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>API Key được lưu trữ cục bộ trong trình duyệt của bạn (không gửi đến bất kỳ bên thứ 3 nào).</li>
              <li>Nếu model đang dùng gặp lỗi quá tải (429 RESOURCE_EXHAUSTED), hệ thống tự động retry với model tiếp theo trong chuỗi.</li>
            </ul>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={!apiKey.trim() || testingStatus === 'testing'}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
          >
            {testingStatus === 'testing' ? 'Đang thử nghiệm...' : 'Kiểm tra Key'}
          </button>

          <div className="flex items-center gap-2">
            {!forced && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{saveSuccess ? 'Đã Lưu!' : 'Lưu & Bắt đầu'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
