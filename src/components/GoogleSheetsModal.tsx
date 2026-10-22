import React, { useState } from 'react';
import { SchoolInfo, GoogleSheetsConfig, StudentProfile, LearningActivityLog } from '../types/learnmap';
import { 
  extractSheetId, 
  generateGoogleAppsScriptCode, 
  syncGoogleSheetsDatabase,
  appendLearningLogToGoogleSheet
} from '../services/googleSheetsService';
import { 
  Database, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Settings, 
  ListFilter, 
  UserCheck, 
  Layers, 
  Sparkles, 
  X, 
  Plus, 
  ShieldCheck, 
  School,
  Clock,
  ArrowRight,
  Code2
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onUpdateConfig: (newConfig: GoogleSheetsConfig) => void;
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (info: SchoolInfo) => void;
  students: StudentProfile[];
  onUpdateStudents: (students: StudentProfile[]) => void;
  selectedStudentId: string;
  onSelectStudentId: (id: string) => void;
  activityLogs: LearningActivityLog[];
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  schoolInfo,
  onUpdateSchoolInfo,
  students,
  onUpdateStudents,
  selectedStudentId,
  onSelectStudentId,
  activityLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'live_data' | 'logs' | 'guide'>('overview');
  const [inputUrlOrId, setInputUrlOrId] = useState(config.sheetUrl || config.sheetId);
  const [inputWebAppUrl, setInputWebAppUrl] = useState(config.webAppUrl || '');
  const [inputStudentSheet, setInputStudentSheet] = useState(config.studentSheetName || 'HocSinh');
  const [inputAutoSync, setInputAutoSync] = useState(config.autoSyncInterval || 0);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedCsv, setIsCopiedCsv] = useState(false);

  // Form thêm học sinh mới
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<number>(4);
  const [newStudentClass, setNewStudentClass] = useState('4A1');
  const [newStudentTheme, setNewStudentTheme] = useState<'space' | 'dinosaurs' | 'cooking' | 'robotics' | 'ocean'>('space');

  if (!isOpen) return null;

  const handleTestAndSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);

    const sheetId = extractSheetId(inputUrlOrId);
    const updatedCfg: GoogleSheetsConfig = {
      ...config,
      sheetId,
      sheetUrl: inputUrlOrId.includes('http') ? inputUrlOrId : `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      webAppUrl: inputWebAppUrl,
      studentSheetName: inputStudentSheet,
      autoSyncInterval: inputAutoSync,
      syncStatus: 'syncing',
    };

    try {
      const result = await syncGoogleSheetsDatabase(updatedCfg);
      
      const newConfig: GoogleSheetsConfig = {
        ...updatedCfg,
        isConnected: true,
        syncStatus: 'success',
        lastSyncedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        dataSource: result.source === 'google_sheets_live' ? 'google_sheets' : 'local_demo',
      };

      onUpdateConfig(newConfig);
      onUpdateSchoolInfo(result.school);
      onUpdateStudents(result.students);

      setSyncFeedback({
        type: 'success',
        message: result.source === 'google_sheets_live'
          ? `Đã đồng bộ thành công ${result.students.length} học sinh trực tuyến từ Google Sheets của ${result.school.schoolName}!`
          : `Đã kết nối và nạp dữ liệu cơ sở của ${result.school.schoolName} (${result.students.length} học sinh).`,
      });
    } catch (err: any) {
      const newConfig: GoogleSheetsConfig = {
        ...updatedCfg,
        syncStatus: 'error',
        errorMessage: err.message,
      };
      onUpdateConfig(newConfig);
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Lỗi khi đồng bộ dữ liệu Google Sheets.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateGoogleAppsScriptCode());
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = ['ID', 'Họ và Tên', 'Khối Lớp', 'Lớp Học', 'Trường Học', 'Sở Thích', 'Linh Vật', 'Chủ Đề Hiện Tại', 'Điểm XP', 'Pha Lê', 'Lỗi Sai Gần Nhất'];
    const rows = students.map((s) => [
      s.id,
      `"${s.name}"`,
      s.grade,
      s.className || `${s.grade}A1`,
      `"${s.schoolName || schoolInfo.schoolName}"`,
      s.theme,
      `"${s.petName}"`,
      `"${s.currentTopic}"`,
      s.xp,
      s.bioMapCrystals,
      `"${s.recentMistake.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LearnMap_TruongTH_HoaiNhon_DanhSachHocSinh.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNewStudent = () => {
    if (!newStudentName.trim()) return;

    const newId = `student-hn-${Date.now().toString().slice(-4)}`;
    const newStudent: StudentProfile = {
      id: newId,
      name: newStudentName.trim(),
      grade: newStudentGrade,
      className: newStudentClass.trim(),
      schoolName: schoolInfo.schoolName,
      theme: newStudentTheme,
      themeLabel: newStudentTheme === 'space' ? 'Thám hiểm Vũ trụ' : newStudentTheme === 'dinosaurs' ? 'Vương quốc Khủng long' : newStudentTheme === 'robotics' ? 'Robot AI' : newStudentTheme === 'cooking' ? 'Bếp Bánh Phép Thuật' : 'Đại dương Huyền bí',
      petName: newStudentTheme === 'space' ? 'Cú Astro' : newStudentTheme === 'dinosaurs' ? 'Rexy Nhí' : newStudentTheme === 'robotics' ? 'Byte' : 'Linh vật',
      petAvatar: newStudentTheme === 'space' ? '🦉🚀' : newStudentTheme === 'dinosaurs' ? '🦖🌿' : newStudentTheme === 'robotics' ? '🤖⚡' : '✨',
      currentTopic: 'Cộng Phân số khác Mẫu số',
      targetNodeId: 'G4_FRAC_ADD',
      stressState: 'calm',
      persistenceCount: 1,
      recentMistake: 'Mới khởi tạo hồ sơ',
      xp: 100,
      bioMapCrystals: 1,
      badges: ['Tân học sinh TH Hoài Nhơn'],
      lastActive: 'Vừa thêm',
    };

    const updated = [newStudent, ...students];
    onUpdateStudents(updated);
    onSelectStudentId(newStudent.id);
    setIsAddingStudent(false);
    setNewStudentName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-indigo-950/50 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 shadow-lg shadow-emerald-600/20 text-white">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Cơ sở Dữ liệu Trực tuyến Google Sheets
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Trực tuyến
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đơn vị đăng ký:</span>
                <span className="font-semibold text-indigo-300 underline decoration-indigo-500/40">
                  {schoolInfo.schoolName}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">GDPT 2018</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800/80 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Tổng quan & Trạng thái</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cấu hình Google Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('live_data')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'live_data'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Dữ liệu Học sinh ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Nhật ký Ghi nhận ({activityLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Hướng dẫn & Apps Script</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Feedback banner */}
          {syncFeedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                syncFeedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {syncFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{syncFeedback.message}</span>
              </div>
              <button
                onClick={() => setSyncFeedback(null)}
                className="text-slate-400 hover:text-slate-200 ml-4 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status summary banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-emerald-950/40 border border-slate-700/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {schoolInfo.schoolName}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          Mã: {schoolInfo.schoolCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Địa bàn: {schoolInfo.district}, {schoolInfo.province} • Niên khóa: {schoolInfo.academicYear}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Phụ trách: {schoolInfo.teacherInCharge}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={handleTestAndSync}
                      disabled={isSyncing}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Google Sheets'}</span>
                    </button>

                    <a
                      href={config.sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Trang tính</span>
                    </a>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Trạng thái kết nối</span>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{config.isConnected ? 'Đang hoạt động' : 'Chưa kết nối'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Học sinh trực tuyến</span>
                    <div className="mt-1 font-extrabold text-sm text-indigo-300">
                      {students.length} em (Lớp 3, 4, 5)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Thời gian đồng bộ</span>
                    <div className="mt-1 font-bold text-xs text-slate-300">
                      {config.lastSyncedAt || 'Vừa xong'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Nguồn cơ sở dữ liệu</span>
                    <div className="mt-1 font-bold text-xs text-amber-300 flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                      <span>{config.dataSource === 'google_sheets' ? 'Google Sheet Online' : 'Dữ liệu Hoài Nhơn'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick student roster list preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Danh sách Học sinh Đang Học (Trường TH Hoài Nhơn)</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('live_data')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Xem đầy đủ & Thêm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {students.map((student) => {
                    const isSelected = student.id === selectedStudentId;
                    return (
                      <div
                        key={student.id}
                        onClick={() => onSelectStudentId(student.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{student.petAvatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white truncate">
                                {student.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                                {student.className || `Lớp ${student.grade}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {student.currentTopic}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-amber-400 mt-1 font-semibold">
                              <span>⭐ {student.xp} XP</span>
                              <span>•</span>
                              <span>💎 {student.bioMapCrystals}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Đường dẫn Google Sheets URL hoặc Mã Sheet ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputUrlOrId}
                      onChange={(e) => setInputUrlOrId(e.target.value)}
                      placeholder="Dán link bảng tính Google Sheet của trường, ví dụ: https://docs.google.com/spreadsheets/d/.../edit"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <FileSpreadsheet className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    💡 Hỗ trợ đọc trực tiếp qua Google Visualization Query API. Bạn chỉ cần bật quyền bảng tính sang chế độ 
                    <span className="text-emerald-400 font-semibold"> "Bất kỳ ai có liên kết đều có thể xem"</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tên Sheet Học Sinh (Tab Name)
                    </label>
                    <input
                      type="text"
                      value={inputStudentSheet}
                      onChange={(e) => setInputStudentSheet(e.target.value)}
                      placeholder="HocSinh"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tự động làm mới (Auto Refresh)
                    </label>
                    <select
                      value={inputAutoSync}
                      onChange={(e) => setInputAutoSync(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value={0}>Thủ công (Khi bấm nút Đồng bộ)</option>
                      <option value={30}>Mỗi 30 giây</option>
                      <option value={60}>Mỗi 1 phút</option>
                      <option value={300}>Mỗi 5 phút</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Google Apps Script Web App URL (Tùy chọn ghi dữ liệu 2 chiều)
                  </label>
                  <input
                    type="text"
                    value={inputWebAppUrl}
                    onChange={(e) => setInputWebAppUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cần thiết nếu bạn muốn tự động ghi điểm XP, lịch sử làm bài và lỗi sai của học sinh ngược trở lại Google Sheet.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setInputUrlOrId('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
                    setInputStudentSheet('HocSinh');
                    setInputAutoSync(0);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Đặt lại dữ liệu chuẩn TH Hoài Nhơn
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestAndSync}
                    disabled={isSyncing}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Lưu Cấu hình & Đồng bộ ngay</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE DATA EXPLORER */}
          {activeTab === 'live_data' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                  <span>Trường Tiểu học Hoài Nhơn:</span>
                  <span className="text-emerald-400 font-bold">{students.length} học sinh</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCsv}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Xuất CSV / Excel</span>
                  </button>

                  <button
                    onClick={() => setIsAddingStudent(!isAddingStudent)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm học sinh mới</span>
                  </button>
                </div>
              </div>

              {/* Add student inline box */}
              {isAddingStudent && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-3 animate-fade-in">
                  <div className="text-xs font-bold text-indigo-200">Thêm học sinh mới vào Trường TH Hoài Nhơn:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Họ và tên học sinh"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Lớp (VD: 4A1)"
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={newStudentTheme}
                      onChange={(e) => setNewStudentTheme(e.target.value as any)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="space">Vũ trụ & Tinh vân</option>
                      <option value="dinosaurs">Khủng long Cổ đại</option>
                      <option value="robotics">Robot & Mạch AI</option>
                      <option value="ocean">Đại dương Huyền bí</option>
                      <option value="cooking">Bếp Bánh Phép Thuật</option>
                    </select>
                    <button
                      onClick={handleAddNewStudent}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      Xác nhận Thêm
                    </button>
                  </div>
                </div>
              )}

              {/* Table view */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Học sinh</th>
                      <th className="py-2.5 px-3">Lớp</th>
                      <th className="py-2.5 px-3">Linh vật / Sở thích</th>
                      <th className="py-2.5 px-3">Chủ đề mục tiêu</th>
                      <th className="py-2.5 px-3">Lỗi sai trọng tâm</th>
                      <th className="py-2.5 px-3 text-right">XP / Pha lê</th>
                      <th className="py-2.5 px-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {students.map((student) => (
                      <tr 
                        key={student.id}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          student.id === selectedStudentId ? 'bg-indigo-950/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{student.petAvatar}</span>
                            <div>
                              <div className="font-bold text-white">{student.name}</div>
                              <div className="text-[10px] text-slate-500">{student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-300">
                          {student.className || `Lớp ${student.grade}`}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-indigo-300 font-medium">
                            {student.themeLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 max-w-[180px] truncate" title={student.currentTopic}>
                          {student.currentTopic}
                        </td>
                        <td className="py-3 px-3 text-rose-300/80 max-w-[200px] truncate text-[11px]" title={student.recentMistake}>
                          {student.recentMistake}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-amber-400">
                          {student.xp} XP / 💎 {student.bioMapCrystals}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              onSelectStudentId(student.id);
                              onClose();
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                              student.id === selectedStudentId
                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {student.id === selectedStudentId ? 'Đang chọn' : 'Chọn học'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Nhật ký học tập thích ứng của Trường Tiểu học Hoài Nhơn</span>
                <span className="text-emerald-400 font-semibold">{activityLogs.length} bản ghi</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.studentName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                          {log.className}
                        </span>
                        <span className="text-slate-500 text-[10px]">• {log.timestamp}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        <span className="font-semibold text-emerald-400">{log.action}:</span> {log.topic}
                      </div>
                      <div className="text-slate-400 text-[10px] italic">
                        {log.pedagogicalNote}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.result === 'correct'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : log.result === 'socratic_guided'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {log.result === 'correct' ? 'Chính xác' : log.result === 'socratic_guided' ? 'Gợi mở Socratic' : 'Hỗ trợ Scaffolding'}
                      </span>
                      <span className="font-bold text-amber-400">+{log.xpAwarded} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GUIDE & APPS SCRIPT */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quy trình 3 bước kết nối Google Sheets cho Trường Tiểu học Hoài Nhơn</span>
                </h4>
                
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-white">Bước 1: Tạo Google Sheet:</strong> Tạo một bảng tính Google Sheets mới hoặc mở bảng tính sẵn có của trường. Đặt tên Sheet đầu tiên là <code className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">HocSinh</code>.
                  </li>
                  <li>
                    <strong className="text-white">Bước 2: Các cột dữ liệu chuẩn:</strong> Đặt dòng đầu tiên (hàng 1) gồm các tiêu đề cột:
                    <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      ID, Họ và Tên, Khối Lớp, Lớp Học, Sở Thích, Linh Vật, Chủ Đề Hiện Tại, Mã Nút Kiến Thức, Trạng Thái, Số Lần Thử, Lỗi Sai Gần Nhất, Điểm XP, Pha Lê, Huy Hiệu
                    </div>
                  </li>
                  <li>
                    <strong className="text-white">Bước 3: Mở quyền truy cập:</strong> Bấm nút <strong>Chia sẻ (Share)</strong> góc trên bên phải trang tính &rarr; Đổi quyền từ "Hạn chế" sang <strong className="text-emerald-400">"Bất kỳ ai có đường liên kết đều có thể xem"</strong>. Sau đó sao chép link dán vào ô Cấu hình trong ứng dụng.
                  </li>
                </ol>
              </div>

              {/* Apps script code viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>Mã nguồn Google Apps Script (Hỗ trợ đọc & ghi 2 chiều)</span>
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    {isCopiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedCode ? 'Đã sao chép!' : 'Sao chép mã Apps Script'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
                  {generateGoogleAppsScriptCode()}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-400" />
            <span>Hệ sinh thái Giáo dục: <strong>Trường Tiểu học Hoài Nhơn</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
