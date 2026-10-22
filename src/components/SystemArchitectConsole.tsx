import React, { useState } from 'react';
import { StudentProfile, KnowledgeNode, SchoolInfo } from '../types/learnmap';
import { 
  generateContentWithFallback, 
  getStoredApiKey, 
  getStoredModel 
} from '../services/geminiClientService';
import { 
  Cpu, 
  Play, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  Sliders, 
  FileText, 
  Layers, 
  ShieldCheck, 
  RefreshCw, 
  Code, 
  BookOpen, 
  Send,
  School,
  FileSpreadsheet,
  Key,
  AlertTriangle
} from 'lucide-react';

interface SystemArchitectConsoleProps {
  profile: StudentProfile;
  nodes: KnowledgeNode[];
  onOpenSystemInstructionModal: () => void;
  schoolInfo?: SchoolInfo;
  onOpenGoogleSheets?: () => void;
  onOpenApiKeyModal?: () => void;
}

export const SystemArchitectConsole: React.FC<SystemArchitectConsoleProps> = ({
  profile,
  nodes,
  onOpenSystemInstructionModal,
  schoolInfo,
  onOpenGoogleSheets,
  onOpenApiKeyModal,
}) => {
  const [targetFormat, setTargetFormat] = useState<string>('Cấu trúc 1: Nhiệm vụ học tập (Học sinh)');
  const [selectedGrade, setSelectedGrade] = useState<number>(profile.grade);
  const [selectedTheme, setSelectedTheme] = useState<string>(profile.themeLabel);
  const [selectedTopic, setSelectedTopic] = useState<string>(profile.currentTopic);
  const [misconception, setMisconception] = useState<string>(profile.recentMistake);
  const [persistenceCount, setPersistenceCount] = useState<number>(profile.persistenceCount);
  const [stressState, setStressState] = useState<string>('Hơi lúng túng, cần Scaffolding');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [outputSource, setOutputSource] = useState<string>('');
  const [retryModelStatus, setRetryModelStatus] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

  const handleRunArchitect = async () => {
    setIsLoading(true);
    setOutputResult(null);
    setRetryModelStatus('');

    const formattedPrompt = `
[YÊU CẦU ĐIỀU HƯỚNG TỪ HỆ THỐNG LEARNMAP]
- Định dạng mục tiêu yêu cầu: ${targetFormat}
- Đơn vị đào tạo: ${schoolInfo?.schoolName || 'Trường Tiểu học Hoài Nhơn'}
- Thông tin Học sinh:
  + Tên: ${profile.name}
  + Khối lớp (GDPT 2018): Lớp ${selectedGrade} (${profile.className || `${selectedGrade}A1`})
  + Chủ đề kiến thức mục tiêu: ${selectedTopic}
  + Sở thích: ${selectedTheme}
  + Linh vật đồng hành: ${profile.petName}
  + Trạng thái tâm lý: ${stressState}
  + Số lần thử lại kiên định: ${persistenceCount} lần
  + Lỗi sai gần nhất cần truy hồi: ${misconception}

- Yêu cầu cụ thể:
${customPrompt || 'Tạo phản hồi theo đúng cấu trúc chỉ định, tuân thủ nghiêm ngặt Tone & Persona và Socratic Scaffolding.'}
`;

    try {
      const apiKey = getStoredApiKey();
      if (!apiKey && onOpenApiKeyModal) {
        onOpenApiKeyModal();
      }

      const result = await generateContentWithFallback({
        prompt: formattedPrompt,
        preferredModel: getStoredModel(),
        onModelAttempt: (model, attemptIndex) => {
          setRetryModelStatus(`Đang kết nối: ${model} (Lần thử ${attemptIndex})...`);
        },
      });

      setOutputResult(result.text);
      setOutputSource(`${result.usedModel}${result.fallbackCount > 0 ? ` (Fallback tự động cấp ${result.fallbackCount})` : ''}`);
      setRetryModelStatus('');
    } catch (err: any) {
      setOutputResult(`Đã dừng do lỗi: ${err?.message || '429 RESOURCE_EXHAUSTED'}`);
      setOutputSource('error');
      setRetryModelStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border border-purple-800/40 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Hạt Nhân AI Architect • Gemini 3.8 Flash
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Prompt & Adaptive CAT Engine
            </span>
            {schoolInfo && (
              <span 
                onClick={onOpenGoogleSheets}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-pointer hover:bg-emerald-500/30 transition-colors"
              >
                <School className="w-3.5 h-3.5 text-emerald-400" />
                <span>{schoolInfo.schoolName}</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Phòng Thí Nghiệm Hạt Nhân LearnMap Architect
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Thử nghiệm trực tiếp System Instruction với mô hình Gemini AI kết nối dữ liệu Google Sheets của {schoolInfo?.schoolName || 'nhà trường'}: Thay đổi tham số học sinh, mức độ giàn giáo (Scaffolding), và kiểm chứng 3 cấu trúc xuất dữ liệu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets DB</span>
            </button>
          )}
          <button
            onClick={onOpenSystemInstructionModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Xem System Instruction Chuẩn</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Tuner */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">Bảng Điều Khiển Tham Số Thích Ứng</h3>
            </div>
            <span className="text-[10px] font-mono text-purple-300">CAT Adaptive</span>
          </div>

          {/* 1. Target Format selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Cấu Trúc Xuất Mục Tiêu (Output Format)
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Cấu trúc 1: Nhiệm vụ học tập (Học sinh)">
                Cấu trúc 1: Nhiệm vụ học tập RPG (Dành cho Học sinh)
              </option>
              <option value="Cấu trúc 2: Báo cáo Thấu chẩn (Phụ huynh/Giáo viên)">
                Cấu trúc 2: Báo cáo Thấu chẩn (Dành cho Phụ huynh/Giáo viên)
              </option>
              <option value="Cấu trúc 3: Phân tích kỹ thuật (Dành cho Hệ thống CAT)">
                Cấu trúc 3: Phân tích kỹ thuật (Dành cho Hệ thống)
              </option>
            </select>
          </div>

          {/* 2. Grade and Theme */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lớp học (GDPT 2018)
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value={1}>Lớp 1</option>
                <option value={2}>Lớp 2</option>
                <option value={3}>Lớp 3</option>
                <option value={4}>Lớp 4</option>
                <option value={5}>Lớp 5</option>
                <option value={6}>Lớp 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sở thích / Bối cảnh RPG
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Thám hiểm Vũ trụ & Tinh vân">🚀 Vũ trụ & Tinh vân</option>
                <option value="Vương quốc Khủng long Cổ đại">🦖 Khủng long Cổ đại</option>
                <option value="Bếp trưởng Nhí & Tiệm bánh">🧁 Bếp trưởng Nhí</option>
                <option value="Thế giới Robot & Vi mạch AI">🤖 Robot Vi mạch</option>
                <option value="Đại dương Huyền bí">🐋 Đại dương Huyền bí</option>
              </select>
            </div>
          </div>

          {/* 3. Target Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chủ đề Kiến thức Mục tiêu
            </label>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* 4. Misconception for Multi-Tier Back-Tracing */}
          <div>
            <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center justify-between">
              <span>Lỗi sai / Quan niệm sai cần truy hồi (Misconception)</span>
              <span className="text-[10px] text-slate-400 font-mono">Multi-tier Back-trace</span>
            </label>
            <textarea
              rows={2}
              value={misconception}
              onChange={(e) => setMisconception(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-rose-900/50 focus:border-rose-500 text-xs text-white focus:outline-none"
            />
          </div>

          {/* 5. Behavioral Telemetry: Persistence & Stress */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Số lần kiên trì thử lại
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={persistenceCount}
                onChange={(e) => setPersistenceCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trạng thái Tâm lý Trẻ
              </label>
              <select
                value={stressState}
                onChange={(e) => setStressState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="Hơi lúng túng, cần Scaffolding">Hơi lúng túng (Cần giàn giáo)</option>
                <option value="Căng thẳng, thao tác nhanh liên tục">Căng thẳng (Cần nghỉ ngơi)</option>
                <option value="Tự tin, hào hứng">Tự tin, hào hứng</option>
                <option value="Bình thường">Bình thường</option>
              </select>
            </div>
          </div>

          {/* Custom optional prompt override */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Lời nhắc bổ sung tùy chọn (Optional Prompt)
            </label>
            <input
              type="text"
              placeholder="VD: Nhấn mạnh câu hỏi Socratic dạng hình học bánh pizza..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Quick API Key & Retry feedback */}
          {retryModelStatus && (
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>{retryModelStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Mô hình: <strong className="text-purple-300 font-mono">{getStoredModel()}</strong></span>
            {onOpenApiKeyModal && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1 font-semibold"
              >
                <Key className="w-3 h-3" />
                <span>Cài đặt API Key</span>
              </button>
            )}
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunArchitect}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang kích hoạt LearnMap Architect...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Kích Hoạt LearnMap Architect (Gemini AI)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output Terminal */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Kết Quả Phản Hồi Từ LearnMap</h3>
                {outputSource && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                    outputSource === 'error'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-purple-950 text-purple-300 border-purple-800'
                  }`}>
                    {outputSource === 'error' ? 'Đã dừng do lỗi' : `Model: ${outputSource}`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Xem trước
                  </button>
                  <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'raw'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mã nguồn
                  </button>
                </div>

                {outputResult && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Sao chép phản hồi"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Content Output */}
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-200">Đang khởi tạo chuỗi suy luận thích ứng...</div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Truy vấn Đồ thị Tri thức GDPT 2018, thiết lập giàn giáo Socratic và đóng gói phản hồi theo {targetFormat}.
                </p>
              </div>
            ) : outputResult ? (
              activeTab === 'preview' ? (
                <div className="h-[460px] overflow-y-auto pr-2 space-y-3 text-xs leading-relaxed text-slate-200">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 whitespace-pre-wrap font-sans">
                    {outputResult}
                  </div>
                </div>
              ) : (
                <div className="h-[460px] overflow-y-auto pr-2">
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-purple-200 whitespace-pre-wrap leading-relaxed">
                    {outputResult}
                  </pre>
                </div>
              )
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <Cpu className="w-10 h-10 text-slate-600 mb-2" />
                <div className="text-slate-300 font-semibold text-xs">
                  Sẵn sàng kiểm thử System Instruction
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Chọn định dạng mục tiêu ở bảng bên trái và nhấn "Kích Hoạt LearnMap Architect" để xem phản hồi trực tiếp.
                </p>
                <button
                  onClick={handleRunArchitect}
                  className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Chạy Thử Mẫu Ngay
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tuân thủ quy tắc COPPA & Phương pháp Socratic</span>
            </span>
            <span className="font-mono text-indigo-400">CAT theta dynamic adaptive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
