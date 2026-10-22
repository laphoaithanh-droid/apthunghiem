import React, { useState } from 'react';
import { StudentProfile, KnowledgeNode, SchoolInfo, LearningActivityLog } from '../types/learnmap';
import { KnowledgeUniverseGraph } from './KnowledgeUniverseGraph';
import { AIFlashlightModal } from './AIFlashlightModal';
import { FeynmanPetModal } from './FeynmanPetModal';
import { 
  Compass, 
  Sparkles, 
  Flashlight, 
  MessageSquare, 
  CheckCircle2, 
  Flame, 
  Award, 
  Heart, 
  RotateCcw,
  Send,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
  School,
  FileSpreadsheet
} from 'lucide-react';

interface StudentExplorerViewProps {
  profile: StudentProfile;
  nodes: KnowledgeNode[];
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onNavigateToReport: () => void;
  schoolInfo?: SchoolInfo;
  onLogActivity?: (log: LearningActivityLog) => void;
  onOpenGoogleSheets?: () => void;
}

export const StudentExplorerView: React.FC<StudentExplorerViewProps> = ({
  profile,
  nodes,
  onUpdateProfile,
  onNavigateToReport,
  schoolInfo,
  onLogActivity,
  onOpenGoogleSheets,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(profile.targetNodeId);
  const [isFlashlightOpen, setIsFlashlightOpen] = useState(false);
  const [isFeynmanOpen, setIsFeynmanOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'socratic_hint' | 'stress_care';
    text: string;
    xpEarned?: number;
  } | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];

  const handleSelectNode = (node: KnowledgeNode) => {
    setSelectedNodeId(node.id);
    setFeedback(null);
  };

  const handleToggleFlashlight = () => {
    setIsFlashlightOpen(!isFlashlightOpen);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    onUpdateProfile({
      xp: profile.xp + amount,
      bioMapCrystals: profile.bioMapCrystals + 1,
      badges: profile.badges.includes(reason) ? profile.badges : [...profile.badges, reason],
    });
  };

  const handleSubmitAnswer = (chosenAnswer?: string) => {
    const ans = (chosenAnswer || userAnswer).trim().toLowerCase();
    if (!ans) return;

    if (ans.includes('5/6') || ans === 'b') {
      // Correct!
      setFeedback({
        type: 'success',
        text: `Tuyệt vời, Thuyền trưởng ${profile.name}! Con đã xuất sắc quy đồng hai phân số về mẫu số chung là 6 (3/6 + 2/6 = 5/6)! Năng lượng phi thuyền đã đầy 100%!`,
        xpEarned: 150,
      });
      handleAwardXp(150, 'Chinh phục Cổng Tinh Cầu Mẫu Số Chung');
      onUpdateProfile({
        stressState: 'in_flow',
        persistenceCount: profile.persistenceCount + 1,
      });

      if (onLogActivity) {
        onLogActivity({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          studentId: profile.id,
          studentName: profile.name,
          className: profile.className || `${profile.grade}A1`,
          action: 'Giải quyết thử thách Socratic',
          topic: profile.currentTopic,
          result: 'correct',
          xpAwarded: 150,
          pedagogicalNote: 'Quy đồng chuẩn xác 3/6 + 2/6 = 5/6, vượt qua quan niệm sai lầm cộng thẳng mẫu số.',
        });
      }
    } else if (ans.includes('2/5') || ans === 'a') {
      // Classic misconception: 1/2 + 1/3 = 2/5
      setFeedback({
        type: 'socratic_hint',
        text: `Khoan đã, Thuyền trưởng ${profile.name}! Hãy nhìn kỹ: 1/2 phi thuyền thì đã là một nửa rồi. Còn 2/5 thì nhỏ hơn cả một nửa! Nếu ta đổ thêm 1/3 bình năng lượng vào, tại sao tổng lại nhỏ hơn lúc đầu nhỉ? Hãy bật "Đèn pin AI" hoặc chia sẻ với ${profile.petName} xem nào!`,
      });
      onUpdateProfile({
        stressState: 'hesitant',
        persistenceCount: profile.persistenceCount + 1,
      });

      if (onLogActivity) {
        onLogActivity({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          studentId: profile.id,
          studentName: profile.name,
          className: profile.className || `${profile.grade}A1`,
          action: 'Kích hoạt Gợi mở Socratic',
          topic: profile.currentTopic,
          result: 'need_scaffolding',
          xpAwarded: 20,
          pedagogicalNote: 'Gặp lỗi quan niệm sai lầm 1/2 + 1/3 = 2/5; hệ thống kích hoạt giàn giáo tư duy Scaffolding.',
        });
      }
    } else {
      setFeedback({
        type: 'socratic_hint',
        text: `LearnMap nhận thấy Thuyền trưởng đang tư duy rất tích cực! Gợi ý Socratic: Hãy tìm một số mà cả 2 và 3 đều chia hết trước khi gộp các bình chứa nhé!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: RPG Context & Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-800/40 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-3xl shadow-inner">
              {profile.petAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.themeLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  GDPT 2018 • Lớp {profile.grade} ({profile.className || `${profile.grade}A1`})
                </span>
                {schoolInfo && (
                  <span 
                    onClick={onOpenGoogleSheets}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/25 transition-colors"
                  >
                    <School className="w-3 h-3 text-emerald-400" />
                    <span>{schoolInfo.schoolName}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Chuyến Thám Hiểm Của {profile.name} & {profile.petName}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Cơ chế học tập thích ứng (CAT) đang kết nối cơ sở dữ liệu Google Sheets để lưu trữ tiến trình theo thời gian thực.
              </p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Điểm Tri Thức</div>
              <div className="text-sm font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{profile.xp} XP</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Bio-Map</div>
              <div className="text-sm font-extrabold text-cyan-400 flex items-center justify-center gap-1">
                <span>💎 {profile.bioMapCrystals}</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Độ Kiên Trì</div>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{profile.persistenceCount} lần thử</span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Mindset Callout */}
        <div className="mt-4 pt-3 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-200">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              <strong className="text-yellow-300">Tư duy phát triển:</strong> "Thầy cô và LearnMap luôn đồng hành cùng nỗ lực của con. Sai lầm chính là chìa khóa mở cánh cổng hiểu sâu!"
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFeynmanOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-500/40 text-indigo-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Dạy lại cho {profile.petName}</span>
            </button>
            <button
              onClick={() => setIsFlashlightOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-yellow-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span>Đèn pin AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Active RPG Quest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Knowledge Universe Constellation */}
        <div className="lg:col-span-7 space-y-4">
          <KnowledgeUniverseGraph
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            isFlashlightActive={isFlashlightOpen}
            onToggleFlashlight={handleToggleFlashlight}
          />

          {/* Quick Node Ancestry Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200">
                🧬 Phả hệ Nút Tri thức: {selectedNode.label}
              </span>
              <span className="text-indigo-400 font-mono text-[10px]">{selectedNode.code}</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">{selectedNode.description}</p>
            {selectedNode.ancestors.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-medium">Bắt nguồn từ:</span>
                {selectedNode.ancestors.map((ancId) => {
                  const anc = nodes.find((n) => n.id === ancId);
                  return (
                    <span
                      key={ancId}
                      className="px-2 py-0.5 rounded-md bg-indigo-950/90 text-indigo-300 border border-indigo-800/60 font-mono text-[11px]"
                    >
                      {anc ? anc.label : ancId}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active RPG Quest Terminal (Cấu trúc 1 Format) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm text-white">Nhiệm Vụ Thám Hiểm RPG</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Cấu trúc 1 Chuẩn
                </span>
              </div>

              {/* 1. Bối cảnh RPG */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 mb-3.5">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>1. Bối cảnh RPG</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Hỡi Thuyền trưởng {profile.name}! Phi thuyền đang hạ cánh xuống Tinh cầu Thạch Anh. Hai máy phát lượng tử cần nạp năng lượng để mở cổng Đền Cổ: Máy Alpha nạp <strong className="text-cyan-300 font-mono">1/2 bình năng lượng xanh</strong>, Máy Beta nạp <strong className="text-amber-300 font-mono">1/3 bình năng lượng đỏ</strong>. Cánh cổng chỉ nhận năng lượng khi cả hai được quy đổi về cùng một đơn vị mẫu số!
                </p>
              </div>

              {/* 2. Thử thách */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 mb-3.5">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Thử thách của Thuyền trưởng</span>
                </div>
                <p className="text-xs font-semibold text-white mb-2">
                  Tổng lượng năng lượng khi hợp nhất cả hai máy phát là bao nhiêu phần của bình chứa?
                </p>
                <div className="font-mono text-center py-2 px-3 rounded-lg bg-slate-900 text-yellow-300 font-bold text-base border border-slate-800">
                  1/2 + 1/3 = ?
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => {
                      setUserAnswer('2/5');
                      handleSubmitAnswer('2/5');
                    }}
                    className="p-2.5 rounded-xl text-left bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                      A
                    </span>
                    <span>2/5 bình năng lượng</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserAnswer('5/6');
                      handleSubmitAnswer('5/6');
                    }}
                    className="p-2.5 rounded-xl text-left bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-800/60 hover:border-indigo-500 text-xs text-indigo-200 transition-all flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-md bg-indigo-800/60 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                      B
                    </span>
                    <span className="font-bold">5/6 bình năng lượng</span>
                  </button>
                </div>
              </div>

              {/* 3. Gợi ý Socratic */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 mb-3.5">
                <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Gợi ý Socratic (Bậc thang Hỗ trợ)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Thuyền trưởng ơi, hãy quan sát: 1/2 bình và 1/3 bình có kích cỡ vạch đo khác nhau. Nếu chia mỗi nửa bình làm 3 phần (thành 6 phần), và chia mỗi 1/3 bình làm 2 phần (cũng thành 6 phần), thì ta có mấy phần tất cả?"
                </p>
              </div>

              {/* 4. Phần thưởng dự kiến */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 mb-3.5 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">4. Phần thưởng hoàn thành:</span>
                </div>
                <div className="font-mono font-bold text-yellow-300">
                  +150 XP • 1 Tinh thể Bio-Map
                </div>
              </div>

              {/* Dynamic Feedback Display */}
              {feedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed mb-3 animate-fadeIn ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {feedback.type === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Chính xác hoàn hảo! (+{feedback.xpEarned} XP)</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>Dẫn dắt Socratic:</span>
                      </>
                    )}
                  </div>
                  <div>{feedback.text}</div>
                </div>
              )}
            </div>

            {/* Custom Input response if child wants to type */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  placeholder="Gõ câu trả lời hoặc suy luận của con..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSubmitAnswer()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AIFlashlightModal
        isOpen={isFlashlightOpen}
        onClose={() => setIsFlashlightOpen(false)}
        currentNode={selectedNode}
        allNodes={nodes}
        profile={profile}
      />

      <FeynmanPetModal
        isOpen={isFeynmanOpen}
        onClose={() => setIsFeynmanOpen(false)}
        profile={profile}
        currentNode={selectedNode}
        onAwardXp={handleAwardXp}
      />
    </div>
  );
};
