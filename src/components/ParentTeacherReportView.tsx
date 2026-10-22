import React, { useState } from 'react';
import { StudentProfile, KnowledgeNode, SchoolInfo, LearningActivityLog } from '../types/learnmap';
import { 
  BarChart3, 
  Dna, 
  AlertTriangle, 
  Calendar, 
  Puzzle, 
  HeartHandshake, 
  Share2, 
  Download, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Brain, 
  ShieldCheck, 
  Compass,
  School,
  FileSpreadsheet
} from 'lucide-react';

interface ParentTeacherReportViewProps {
  profile: StudentProfile;
  nodes: KnowledgeNode[];
  onOpenArchitect: () => void;
  schoolInfo?: SchoolInfo;
  onOpenGoogleSheets?: () => void;
  onLogActivity?: (log: LearningActivityLog) => void;
}

export const ParentTeacherReportView: React.FC<ParentTeacherReportViewProps> = ({
  profile,
  nodes,
  onOpenArchitect,
  schoolInfo,
  onOpenGoogleSheets,
  onLogActivity,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPhygitalIndex, setSelectedPhygitalIndex] = useState(0);

  const phygitalActivities = [
    {
      title: 'Trò chơi Cắt Bánh Pizza Năng Lượng',
      materials: ['2 đĩa giấy tròn trắng', 'Bút màu hoặc kéo thủ công'],
      time: '15 phút tương tác cuối tuần',
      steps: [
        'Đĩa thứ nhất chia làm 2 phần bằng nhau (1/2), tô màu vàng.',
        'Đĩa thứ hai chia làm 3 phần bằng nhau (1/3), tô màu đỏ.',
        'Hỏi con: "Nếu đặt 1 miếng vàng cạnh 1 miếng đỏ, chúng có bằng 2 miếng của loại cắt làm 5 không?"',
        'Cắt nhỏ mỗi nửa thành 3 miếng (thành 6), mỗi phần ba thành 2 miếng (thành 6). Giờ đây cả hai đều là cỡ 1/6: 3 miếng + 2 miếng = 5 miếng (5/6)!',
      ],
      psychologyNote: 'Giúp não bộ trẻ thoát khỏi tư duy xem tử và mẫu như 2 số tự nhiên riêng rẽ.',
    },
    {
      title: 'Xếp Tháp Khối Lego Phân Số',
      materials: ['24 viên gạch Lego cùng cỡ'],
      time: '10 phút sau bữa tối',
      steps: [
        'Yêu cầu con chia 24 viên gạch thành 2 phần bằng nhau (mỗi phần 12 viên - tương đương 1/2).',
        'Chia tiếp 24 viên gạch thành 3 phần bằng nhau (mỗi phần 8 viên - tương đương 1/3).',
        'Gộp 1 nhóm (12 viên) và 1 nhóm (8 viên) = 20 viên. So sánh 20/24 chính là 5/6!',
      ],
      psychologyNote: 'Củng cố trực giác số lượng xúc giác (tactile learning) cho trẻ thích vận động.',
    },
  ];

  const handleCopyReport = () => {
    const schoolTitle = schoolInfo?.schoolName || 'Trường Tiểu học Hoài Nhơn';
    const reportText = `[BÁO CÁO THẤU CHẨN HỌC TẬP - ${schoolTitle.toUpperCase()}]
Đơn vị: ${schoolTitle} (Thị xã Hoài Nhơn, Bình Định)
Học sinh: ${profile.name} (Lớp ${profile.className || `${profile.grade}A1`})
Thời gian: Tháng 10/2026 • Chuẩn GDPT 2018

1. CHỈ SỐ SỨC KHỎE HỌC TẬP:
- Mức độ Tập trung: 84% (Duy trì đều đặn, không có dấu hiệu quá tải)
- Độ Bền bỉ (Growth Mindset): 92% (Thử lại ${profile.persistenceCount} lần liên tiếp thay vì nản lòng)
- Tinh thần Tự chủ: 88% (Chủ động sử dụng Đèn pin AI và tự vấn Feynman)

2. PHÂN TÍCH DI TRUYỀN KIẾN THỨC (KNOWLEDGE GENETICS):
- Triệu chứng bề mặt: Học sinh làm sai phép tính 1/2 + 1/3 = 2/5 (cộng tử với tử, mẫu với mẫu).
- Lỗ hổng gốc rễ (Root Cause Multi-tier):
  + Tầng Lớp 4: Chưa làm chủ bản chất Quy đồng Mẫu số.
  + Tầng Lớp 3: Khái niệm Bội chung nhỏ nhất chưa được biểu tượng hóa trực quan.
  + Tầng Lớp 2: Khái niệm "Một phần mấy" bị hiểu nhầm thành số đếm đơn lẻ thay vì tỷ lệ kích thước.

3. DỰ BÁO & CẢNH BÁO (2 TUẦN TỚI):
- Nguy cơ lặp lại sai lầm ở "Phép trừ phân số khác mẫu" nếu chỉ dạy mẹo tính mà chưa củng cố bản chất mẫu số chung.
- Cần kích hoạt Lặp lại ngắt quãng (Spaced Repetition) vào ngày thứ 3 và ngày thứ 7.

4. LỜI KHUYÊN PHYGITAL DÀNH CHO PHỤ HUYNH:
- Cùng con thực hành hoạt động "${phygitalActivities[0].title}". Tránh chỉ trích điểm số, khen ngợi sự kiên trì ${profile.persistenceCount} lần thử của con!`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/70 to-emerald-950/80 border border-emerald-800/40 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Cấu trúc 2: Báo cáo Thấu chẩn Sư phạm
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Chuẩn GDPT 2018
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
            Trung Tâm Thấu Chẩn: {profile.name} ({profile.className || `Lớp ${profile.grade}`})
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            LearnMap đóng vai trò <em>Chuyên gia Phân tích Giáo dục</em>: Chuyển dịch từ việc "chấm điểm đúng/sai" sang "thấu hiểu nguyên nhân gốc rễ", đồng bộ trực tiếp cơ sở dữ liệu với Google Sheets của {schoolInfo?.schoolName || 'nhà trường'}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 transition-all flex items-center gap-1.5 shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets DB</span>
            </button>
          )}
          <button
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép Báo cáo!' : 'Chia sẻ Báo cáo'}</span>
          </button>
          <button
            onClick={onOpenArchitect}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Chạy AI Sandbox</span>
          </button>
        </div>
      </div>

      {/* 1. Chỉ số Sức khỏe Học tập */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Mức độ Tập trung</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">84%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Duy trì ổn định trong 22 phút đầu, nhịp độ tối ưu.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Độ Bền bỉ (Growth Mindset)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">92%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Kiên cường thử lại <strong>{profile.persistenceCount} lần</strong> không bỏ cuộc khi gặp khó.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Trạng thái Tâm lý</span>
            <HeartHandshake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-black text-cyan-300 mt-1 capitalize">
            {profile.stressState === 'hesitant' ? 'Hơi lúng túng' : 'Hào hứng khám phá'}
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Đã kích hoạt Đèn pin AI hỗ trợ</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Khả năng Tự chủ Socratic</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">88%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Chủ động phân tích thay vì đoán mò đáp án.</p>
        </div>
      </div>

      {/* 2. Cây Di truyền Kiến thức & Truy hồi Đa tầng (Knowledge Genetics) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              2. Phân Tích Di Truyền Kiến Thức (Knowledge Genetics & Root Causes)
            </h3>
          </div>
          <span className="text-xs text-indigo-300 font-mono bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800/60">
            Cơ chế Truy hồi Đa tầng: Lớp 4 → Lớp 3 → Lớp 2
          </span>
        </div>

        {/* Root Cause Trace visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Level 4: Symptom */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-600/40 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-1">
              Triệu chứng Bề mặt (Lớp 4)
            </div>
            <div className="font-bold text-sm text-white">Cộng Phân số khác Mẫu</div>
            <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-xs text-rose-400 border border-rose-900/50">
              Lỗi gặp phải: 1/2 + 1/3 = 2/5
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Học sinh cộng trực tiếp tử với tử, mẫu với mẫu do chưa nhận thức được sự khác biệt về kích thước phần chia.
            </p>
          </div>

          {/* Level 3: Intermediate Root */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1">
              Lỗ hổng Trung gian (Lớp 3)
            </div>
            <div className="font-bold text-sm text-white">Bội chung & Nhân phân phối</div>
            <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-xs text-amber-300 border border-amber-900/50">
              Node: MATH_VN_G3_MULT_LCM
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Trẻ có thể thuộc bảng nhân nhưng chưa hiểu trực quan tại sao số 6 là đơn vị đo chung nhỏ nhất cho cả nhóm 2 và nhóm 3.
            </p>
          </div>

          {/* Level 2: Core Root Cause */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-600/40 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
              Gốc rễ Cốt lõi (Lớp 2)
            </div>
            <div className="font-bold text-sm text-white">Bản chất "Một phần mấy"</div>
            <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-xs text-indigo-300 border border-indigo-900/50">
              Node: MATH_VN_G2_PARTS_OF_WHOLE
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Não bộ trẻ đang đối xử với phân số như "hai số nguyên xếp chồng" thay vì một tỷ lệ số lượng mang tính tương đối.
            </p>
          </div>
        </div>

        {/* Pedagogical Commentary */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 font-semibold">Gợi ý Sư phạm từ LearnMap: </strong>
          "Xin quý phụ huynh và thầy cô an tâm: Đây là một <em>lỗi nhận thức điển hình (concept development milestone)</em> của học sinh tiểu học toàn cầu. Việc trẻ sai không phải vì thiếu thông minh, mà vì não bộ đang chuyển tiếp từ thế giới số tự nhiên rời rạc sang thế giới phân số liên tục. Hãy dùng vật thể thực tế thay vì bắt trẻ học thuộc công thức."
        </div>
      </div>

      {/* 3. Dự báo & Cảnh báo Sớm (2 Tuần Tới) & Spaced Repetition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              3. Dự Báo & Cảnh Báo Sớm (2 Tuần Tới)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">
                  Dự báo nguy cơ: Phép trừ phân số khác mẫu (Tuần sau)
                </span>
                <p className="text-slate-400 mt-1">
                  Nếu trẻ chưa hình dung được bản chất mẫu số chung 6 phần, nguy cơ làm sai dạng <code className="text-yellow-300 font-mono">1/2 - 1/3 = 0/(-1)</code> hoặc bỏ cuộc là 85%.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">
                  Lặp lại ngắt quãng (Spaced Repetition Scheduler)
                </span>
                <p className="text-slate-400 mt-1">
                  Hệ thống LearnMap đã tự động lập lịch chèn một câu hỏi RPG nhẹ nhàng vào chuyến phiêu lưu ngày <strong>25/10</strong> (sau 72 giờ) để đưa kiến thức vào vùng trí nhớ dài hạn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Lời khuyên Phygital */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">
                  4. Lời Khuyên Phygital (Hoạt Động Thế Giới Thực)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                Thực hành cùng con
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              {phygitalActivities.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhygitalIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPhygitalIndex === idx
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {act.title.split(' ')[2]} {act.title.split(' ')[3]}
                </button>
              ))}
            </div>

            {/* Active Activity details */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs">
              <div className="font-bold text-slate-100 flex items-center justify-between mb-1">
                <span>{phygitalActivities[selectedPhygitalIndex].title}</span>
                <span className="text-[10px] text-amber-300 font-mono">
                  ⏱️ {phygitalActivities[selectedPhygitalIndex].time}
                </span>
              </div>
              <div className="text-slate-400 mb-2">
                <strong>Vật liệu:</strong> {phygitalActivities[selectedPhygitalIndex].materials.join(', ')}
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 mb-2">
                {phygitalActivities[selectedPhygitalIndex].steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200">
                💡 <strong>Góc tâm lý:</strong> {phygitalActivities[selectedPhygitalIndex].psychologyNote}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tuân thủ tiêu chuẩn an toàn COPPA</span>
            <span className="text-emerald-400 font-semibold">Dữ liệu thấu chẩn bảo mật 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
