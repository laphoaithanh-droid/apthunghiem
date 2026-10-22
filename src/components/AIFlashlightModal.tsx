import React from 'react';
import { KnowledgeNode, StudentProfile } from '../types/learnmap';
import { Flashlight, X, ArrowDownRight, Lightbulb, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface AIFlashlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNode: KnowledgeNode;
  allNodes: KnowledgeNode[];
  profile: StudentProfile;
}

export const AIFlashlightModal: React.FC<AIFlashlightModalProps> = ({
  isOpen,
  onClose,
  currentNode,
  allNodes,
  profile,
}) => {
  if (!isOpen) return null;

  const ancestors = allNodes.filter((n) => currentNode.ancestors.includes(n.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-yellow-500/40 shadow-2xl p-6 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-yellow-500/30">
              <Flashlight className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Đèn pin AI: Soi sáng Vùng Mây Mù
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  Scaffolding Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Truy hồi đa tầng về kiến thức nền tảng Lớp 1, 2, 3 để khai thông thử thách
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Target Node info */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <div className="text-xs text-indigo-300 font-mono">Nút thử thách hiện tại:</div>
            <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{currentNode.label}</span>
              <span className="text-xs text-cyan-300 font-mono">({currentNode.code})</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{currentNode.description}</p>
          </div>

          {/* Scaffolding Ladder (Bậc thang Hỗ trợ Socratic) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>Bậc Thang Hỗ Trợ (Scaffolding Ladder)</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <span className="font-bold text-yellow-400">Bậc 1 (Trực quan hóa): </span>
                <span className="text-slate-300">
                  Hãy tưởng tượng hai bình năng lượng của phi thuyền: một bình chia 2 khoang (1/2), một bình chia 3 khoang (1/3). Bạn không thể gộp khoang lớn với khoang nhỏ mà phải chia nhỏ thành các khoang đều nhau.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400">Bậc 2 (Câu hỏi Socratic): </span>
                <span className="text-slate-300">
                  Nếu nhân cả tử và mẫu của 1/2 với 3, ta được phân số nào? Nếu nhân cả tử và mẫu của 1/3 với 2, ta được phân số nào? Mẫu số của cả hai lúc này là mấy?
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <span className="font-bold text-emerald-400">Bậc 3 (Liên kết GDPT 2018): </span>
                <span className="text-slate-300">
                  Khi các phân số đã cùng mẫu số (cùng chia 6 phần), ta chỉ việc cộng các tử số lại: 3/6 + 2/6 = 5/6!
                </span>
              </div>
            </div>
          </div>

          {/* Ancestor Nodes (Truy hồi nền tảng) */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-2">
              <ArrowDownRight className="w-4 h-4 text-indigo-400" />
              <span>Nút kiến thức cội nguồn (Ancestors Multi-Tier)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ancestors.map((anc) => (
                <div
                  key={anc.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-yellow-500/50 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-yellow-300">{anc.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Lớp {anc.grade}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{anc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Socratic Hint */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lời nhắn từ LearnMap Guide: </span>
              "Nhà thám hiểm {profile.name} ơi, sai lầm chính là dấu hiệu não bộ đang lớn lên! Đừng ngại thử lại, ta đã chuẩn bị sẵn năng lượng hỗ trợ cho con."
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/20 transition-all"
          >
            Đã hiểu! Trở lại Thử thách
          </button>
        </div>
      </div>
    </div>
  );
};
