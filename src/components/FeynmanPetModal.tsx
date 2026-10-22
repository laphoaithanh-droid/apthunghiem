import React, { useState } from 'react';
import { StudentProfile, KnowledgeNode } from '../types/learnmap';
import { 
  generateContentWithFallback, 
  getStoredApiKey, 
  getStoredModel 
} from '../services/geminiClientService';
import { Sparkles, MessageCircle, Send, CheckCircle, Award, Heart, HelpCircle, X, RefreshCw } from 'lucide-react';

interface FeynmanPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  currentNode: KnowledgeNode;
  onAwardXp: (amount: number, reason: string) => void;
}

export const FeynmanPetModal: React.FC<FeynmanPetModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentNode,
  onAwardXp,
}) => {
  if (!isOpen) return null;

  const [explanationText, setExplanationText] = useState('');
  const [petFeedback, setPetFeedback] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuickAnswers = [
    'Tớ giải thích nè: Mẫu số giống như kích cỡ của chiếc hộp. Không thể gộp 1 hộp to với 1 hộp nhỏ mà phải đổi sang hộp cùng cỡ 6 phần!',
    'Muốn cộng 1/2 và 1/3, tớ phải quy đồng mẫu số chung là 6, rồi cộng tử số 3/6 + 2/6 = 5/6.',
    'Chỉ cần lấy 1 cộng 1 bằng 2, 2 cộng 3 bằng 5 là ra 2/5 thôi!',
  ];

  const handleEvaluate = async (textToEvaluate?: string) => {
    const text = textToEvaluate || explanationText;
    if (!text.trim()) return;

    setIsLoading(true);
    setPetFeedback(null);

    // 1. Thử gọi mô hình Gemini AI nếu người dùng đã nhập API Key
    const apiKey = getStoredApiKey();
    if (apiKey && apiKey.length > 10) {
      try {
        const feynmanPrompt = `Bạn là linh vật ${profile.petName} vui tính của học sinh ${profile.name} (Lớp ${profile.grade}, ${profile.schoolName || 'Trường Tiểu học Hoài Nhơn'}). 
Học sinh vừa áp dụng Kỹ thuật Feynman để giải thích cho bạn nghe về bài học "${currentNode.label}":
"${text}"

Hãy đánh giá phản hồi theo phương pháp Feynman & Socratic:
- Nếu trẻ giải thích đúng bản chất (chia đều, quy đồng mẫu số chung để gộp cùng đơn vị): hãy khen ngợi hào hứng, công nhận con đã dạy bạn hiểu bài!
- Nếu trẻ mắc lỗi sai quy đồng (ví dụ: cộng thẳng 1/2 + 1/3 = 2/5): hãy tỏ ra ngây thơ gãi đầu thắc mắc tại sao 1/2 đã là một nửa mà cộng thêm lại thành 2/5 nhỏ hơn, gợi mở để con suy nghĩ lại.
- Tối đa 3 câu ngắn gọn, truyền cảm hứng, phù hợp lứa tuổi tiểu học GDPT 2018.`;

        const res = await generateContentWithFallback({
          prompt: feynmanPrompt,
          preferredModel: getStoredModel(),
        });

        if (res.text) {
          setPetFeedback(res.text);
          const isSuccess = !res.text.includes('2/5') && !res.text.toLowerCase().includes('thắc mắc') && !res.text.toLowerCase().includes('chưa đúng');
          setIsEvaluated(isSuccess);
          if (isSuccess) {
            onAwardXp(120, 'Kỹ thuật Feynman: Giải thích cho Linh vật');
          }
          setIsLoading(false);
          return;
        }
      } catch (aiErr) {
        console.warn('Gemini evaluation fallback to local:', aiErr);
      }
    }

    // 2. Dự phòng thuật toán cục bộ
    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes('2/5') || (lower.includes('tử cộng tử') && !lower.includes('không được'))) {
        setPetFeedback(
          `Ơ... ${profile.petName} hơi gãi đầu một chút! Nếu ${profile.name} cộng thành 2/5, thì 2/5 còn nhỏ hơn cả 1/2 phi thuyền ban đầu nữa đó! Cậu thử giải thích lại xem tại sao cần phải chia thành các phần bằng nhau trước khi gộp nhé?`
        );
        setIsEvaluated(false);
      } else if (
        lower.includes('cùng cỡ') ||
        lower.includes('quy đồng') ||
        lower.includes('mẫu số chung') ||
        lower.includes('kích cỡ') ||
        lower.includes('chia đều') ||
        lower.includes('hộp') ||
        lower.includes('5/6')
      ) {
        setPetFeedback(
          `Woa! Tuyệt cú mèo! ${profile.petName} hiểu rành rọt luôn rồi! ${profile.name} giải thích bằng hình tượng trực quan xuất sắc lắm. Khi hiểu được bản chất là "quy về cùng đơn vị đo", cậu đã chính thức làm chủ kỹ thuật Feynman!`
        );
        setIsEvaluated(true);
        onAwardXp(120, 'Kỹ thuật Feynman: Giải thích cho Linh vật');
      } else {
        setPetFeedback(
          `Cảm ơn ${profile.name} đã chia sẻ cùng ${profile.petName}! Cậu hãy thử giải thích thêm một chút về chiếc "mẫu số chung" để tớ hiểu sâu hơn nữa nhé!`
        );
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-700/50 shadow-2xl p-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-indigo-500/30">
              {profile.petAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Phòng Luyện Feynman: Trò Chuyện Cùng {profile.petName}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Feynman Technique
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hãy giải thích lại bài học cho Linh vật bằng ngôn ngữ giản dị nhất của con!
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

        {/* Pet Dialogue Area */}
        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
            <span className="text-2xl">{profile.petAvatar.slice(0, 2)}</span>
            <div className="text-xs text-slate-200">
              <span className="font-bold text-indigo-300">{profile.petName}: </span>
              "Thuyền trưởng {profile.name} ơi! Tớ đang bối rối chưa hiểu tại sao bài toán phân số{' '}
              <span className="text-yellow-300 font-mono font-bold">1/2 + 1/3</span> lại không được cộng thẳng mẫu số với nhau? Cậu dạy lại tớ với nhé?"
            </div>
          </div>

          {/* Quick Idea Prompts */}
          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Gợi ý cách diễn đạt ngắn (Nhấn để thử ngay):</span>
            </div>
            <div className="space-y-1.5">
              {sampleQuickAnswers.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setExplanationText(sample);
                    handleEvaluate(sample);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/90 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 transition-all"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="relative">
            <textarea
              rows={3}
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
              placeholder={`Thuyền trưởng ${profile.name} gõ lời giải thích cho ${profile.petName} ở đây...`}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleEvaluate()}
              disabled={isLoading || !explanationText.trim()}
              className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3 h-3" />
              <span>{isLoading ? 'Đang lắng nghe...' : 'Gửi cho Pet'}</span>
            </button>
          </div>

          {/* Pet Reaction Box */}
          {petFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs animate-fadeIn ${
                isEvaluated
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {isEvaluated ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Linh vật Đã Khai Sáng Tri Thức! (+120 XP)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Linh vật muốn lắng nghe thêm một chút</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{petFeedback}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <div className="text-slate-400 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Thấu cảm Sư phạm: Không chấm điểm số, đo lường sự thấu hiểu</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
