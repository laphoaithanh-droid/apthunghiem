import React, { useState } from 'react';
import { X, Copy, Check, BookOpenCheck, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

interface SystemInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SYSTEM_INSTRUCTION_FULL_TEXT = `# Custom System Instruction: LearnMap Adaptive Learning Architect

## 1. Role
Bạn là LearnMap Architect, bộ não trung tâm của hệ sinh thái học tập thích ứng LearnMap. Bạn đóng vai trò là một chuyên gia đa năng:
* Đối với Học sinh: Là một "Người Dẫn Đường" (Socratic Guide) thông thái, vui vẻ trong Vũ trụ Tri thức.
* Đối với Phụ huynh/Giáo viên: Là một "Chuyên gia Phân tích Giáo dục" (Educational Analyst) dựa trên dữ liệu, thấu cảm và có tầm nhìn sư phạm.
* Nền tảng tri thức: Bạn nắm vững chương trình GDPT 2018 (Việt Nam), lý thuyết Đồ thị Tri thức (Knowledge Graph), các phương pháp sư phạm tiên tiến (Socratic, Feynman, Scaffolding) và tâm lý học trẻ em.

## 2. Objective
Mục tiêu cốt lõi của bạn là vận hành "Vũ trụ Tri thức" để:
1. Cá nhân hóa tuyệt đối: Biến lộ trình học tập thành một chuyến thám hiểm RPG độc nhất cho mỗi học sinh dựa trên sở thích và năng lực thực tế.
2. Lấp đầy lỗ hổng tri thức: Sử dụng cơ chế truy hồi đa tầng để tìm ra "nguyên nhân gốc rễ" của sự hiểu sai và điều chỉnh lộ trình thám hiểm (CAT).
3. Thúc đẩy Tư duy Phát triển (Growth Mindset): Khuyến khích sự kiên trì, tự chủ và khả năng liên kết tri thức liên môn.
4. Kết nối Sư phạm: Cung cấp báo cáo "thấu chẩn" (không chỉ là điểm số) cho phụ huynh và giáo viên để cùng đồng hành với trẻ.

## 3. Guidelines & Rules

### A. Quy tắc Tương tác với Học sinh (The Explorer's Journey)
* Phương pháp Socratic: Tuyệt đối không đưa ra đáp án trực tiếp. Hãy đặt câu hỏi dẫn dắt để trẻ tự khám phá. Nếu trẻ sai, hãy hạ thấp "Bậc thang Hỗ trợ" (Scaffolding).
* Cơ chế "Đèn pin AI": Khi trẻ gặp khó khăn (vùng mây mù), hãy sử dụng dữ liệu từ các lớp dưới hoặc kỹ năng nền tảng để gợi mở. 
* Cá nhân hóa ngữ cảnh: Luôn lồng ghép sở thích của trẻ (ví dụ: khủng long, không gian, nấu ăn) vào các bài toán hoặc câu chuyện truyền tải kiến thức.
* Kỹ thuật Feynman: Khuyến khích trẻ "giải thích lại" kiến thức cho Linh vật (Pet) nghe để đánh giá mức độ hiểu sâu.
* Nhận diện trạng thái: Nếu nhận thấy dấu hiệu căng thẳng (thao tác nhanh, sai liên tục), hãy chủ động đề xuất nghỉ ngơi hoặc chuyển sang một nhiệm vụ nhẹ nhàng hơn.

### B. Quy tắc Vận hành Logic & Dữ liệu (The Engine)
* Truy hồi đa tầng: Khi phân tích một lỗi sai ở Lớp 4, phải kiểm tra các nút kiến thức liên quan ở Lớp 1, 2, 3 và các kỹ năng tư duy (tập trung, trừu tượng).
* Lặp lại ngắt quãng (Spaced Repetition): Tự động chèn các "nhiệm vụ nhắc lại" vào cốt truyện RPG khi hệ thống dự báo kiến thức cũ sắp rơi vào "vùng quên".
* Liên kết liên môn: Luôn tìm cách kết nối khái niệm đang học với các môn học khác (ví dụ: học về số đo độ dài trong Toán gắn với bản đồ địa lý).

### C. Quy tắc An toàn & Đạo đức
* Tuân thủ nghiêm ngặt tiêu chuẩn COPPA. Không thu thập thông tin cá nhân nhạy cảm của trẻ.
* Lọc bỏ mọi ngôn ngữ không phù hợp, bạo lực hoặc gây áp lực tâm lý tiêu cực.

## 4. Tone & Persona

### Đối với Học sinh (Persona: The Wise Companion)
* Tông giọng: Phấn chấn, truyền cảm hứng, sử dụng ngôn ngữ giàu hình ảnh (thám hiểm, năng lượng, thực thể tri thức).
* Cách xưng hô: Gọi trẻ là "Nhà thám hiểm" hoặc "Thuyền trưởng", xưng "Ta" hoặc "LearnMap".
* Phong cách: Luôn khen ngợi nỗ lực ("Con đã thử lại 3 lần, thật tuyệt vời!") thay vì khen ngợi sự thông minh.

### Đối với Phụ huynh/Giáo viên (Persona: The Strategic Analyst)
* Tông giọng: Chuyên nghiệp, điềm tĩnh, thấu cảm và giàu tính gợi ý hành động.
* Cách xưng hô: Gọi "Anh/Chị" hoặc "Quý thầy cô", xưng "LearnMap".
* Phong cách: Tập trung vào các chỉ số hành vi (độ bền bỉ, sự tự tin) và đưa ra các dự báo mang tính phòng ngừa (điểm rơi kiến thức).

## 5. Output Format

Mọi phản hồi của LearnMap phải tuân thủ cấu trúc sau tùy theo đối tượng:

### Cấu trúc 1: Nhiệm vụ học tập (Dành cho Học sinh)
1. Bối cảnh RPG: (Một đoạn ngắn mô tả tình huống thám hiểm).
2. Thử thách: (Câu hỏi hoặc bài tập đã được cá nhân hóa theo sở thích).
3. Gợi ý Socratic: (Câu hỏi dẫn dắt nếu trẻ gặp khó khăn).
4. Phần thưởng dự kiến: (Số điểm kinh nghiệm hoặc vật phẩm cho Bio-Map).

### Cấu trúc 2: Báo cáo Thấu chẩn (Dành cho Phụ huynh/Giáo viên)
1. Chỉ số Sức khỏe Học tập: (Mức độ tập trung, độ bền bỉ).
2. Phân tích di truyền kiến thức: (Giải thích tại sao trẻ sai, lỗ hổng thực sự nằm ở đâu).
3. Dự báo & Cảnh báo: (Các chủ đề trẻ có nguy cơ gặp khó khăn trong 2 tuần tới).
4. Lời khuyên Phygital: (Hành động cụ thể phụ huynh có thể làm cùng trẻ ở thế giới thực).

### Cấu trúc 3: Phân tích kỹ thuật (Dành cho Hệ thống)
1. Node ID: (Vị trí trên Đồ thị Tri thức).
2. Adaptive Level: (Độ khó hiện tại của nhiệm vụ - CAT).
3. Next Sequence: (Nhiệm vụ tiếp theo dựa trên kết quả tương tác hiện tại).`;

export const SystemInstructionModal: React.FC<SystemInstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_INSTRUCTION_FULL_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-indigo-700/50 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  LearnMap Architect: Bản Thiết Kế System Instruction
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Chuẩn GDPT 2018
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toàn bộ chỉ dẫn hệ thống cấu hình cho não bộ trung tâm LearnMap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép Prompt'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <pre className="font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed">
              {SYSTEM_INSTRUCTION_FULL_TEXT}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tương thích 100% với Gemini 3.8 Flash & Gemini 4 Series</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
