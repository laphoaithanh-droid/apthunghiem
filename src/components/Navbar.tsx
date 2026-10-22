import React from 'react';
import { AppMode, StudentProfile, SchoolInfo, GoogleSheetsConfig } from '../types/learnmap';
import { 
  Compass, 
  BarChart3, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  BookOpenCheck,
  ChevronDown,
  School,
  FileSpreadsheet,
  RefreshCw,
  Key
} from 'lucide-react';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  selectedProfile: StudentProfile;
  profiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
  onOpenSystemInstruction: () => void;
  schoolInfo: SchoolInfo;
  sheetsConfig: GoogleSheetsConfig;
  onOpenGoogleSheets: () => void;
  onOpenApiKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  selectedProfile,
  profiles,
  onSelectProfile,
  onOpenSystemInstruction,
  schoolInfo,
  sheetsConfig,
  onOpenGoogleSheets,
  onOpenApiKeyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-900/40 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Registered School Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                LearnMap
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                GDPT 2018
              </span>
              <span 
                onClick={onOpenGoogleSheets}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 cursor-pointer hover:bg-emerald-500/25 transition-colors"
                title="Đơn vị đăng ký chính thức - Nhấp để quản lý cơ sở dữ liệu Google Sheets"
              >
                <School className="w-3.5 h-3.5 text-emerald-400" />
                <span>{schoolInfo.schoolName}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Hệ sinh thái Học tập Thích ứng • {schoolInfo.schoolName}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => onSelectMode('student')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'student'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Học sinh (RPG)</span>
          </button>

          <button
            onClick={() => onSelectMode('parent_teacher')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'parent_teacher'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Phụ huynh / Báo cáo</span>
          </button>

          <button
            onClick={() => onSelectMode('architect')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'architect'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Hạt nhân AI</span>
          </button>
        </nav>

        {/* Right: Settings (API Key), Google Sheets DB, Student Profile & System Instruction Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Settings (API Key) Button with required red text */}
          <button
            onClick={onOpenApiKeyModal}
            title="Thiết lập Gemini API Key & Model AI"
            className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 shadow-md transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Key className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold text-slate-200">Settings</span>
              <span className="text-[9px] font-bold text-rose-500 group-hover:underline animate-pulse">
                Lấy API key để sử dụng app
              </span>
            </div>
          </button>

          {/* Google Sheets Database Status Button */}
          <button
            onClick={onOpenGoogleSheets}
            title={`Kết nối Google Sheets: ${schoolInfo.schoolName} (${sheetsConfig.isConnected ? 'Đang kết nối' : 'Ngoại tuyến'})`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Google Sheets</span>
            <span className="hidden sm:inline text-[11px] font-mono text-emerald-400/90 font-bold">
              {profiles.length} HS
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          {/* Profile selector dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors text-xs text-left">
              <span className="text-base">{selectedProfile.petAvatar.slice(0, 2)}</span>
              <div className="hidden sm:block">
                <div className="font-semibold text-slate-200 leading-tight">
                  {selectedProfile.name} ({selectedProfile.className || `Lớp ${selectedProfile.grade}`})
                </div>
                <div className="text-[10px] text-indigo-400 flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span>{selectedProfile.xp} XP</span>
                  <span className="text-slate-600">•</span>
                  <span>💎 {selectedProfile.bioMapCrystals}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 mb-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Học sinh TH Hoài Nhơn
                </span>
                <button
                  onClick={onOpenGoogleSheets}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>Quản lý Sheet</span>
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                      p.id === selectedProfile.id
                        ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xl">{p.petAvatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-100 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.className || `Lớp ${p.grade}`} • {p.themeLabel}
                      </div>
                    </div>
                    {p.id === selectedProfile.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Instruction Inspector */}
          <button
            onClick={onOpenSystemInstruction}
            title="Xem Thiết kế System Instruction Chuẩn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-colors"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">System Instruction</span>
          </button>
        </div>
      </div>

      {/* Mobile School Banner */}
      <div className="sm:hidden px-4 py-1 bg-emerald-950/60 border-t border-emerald-900/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold truncate">
          <School className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{schoolInfo.schoolName}</span>
        </div>
        <button
          onClick={onOpenGoogleSheets}
          className="text-emerald-400 font-bold shrink-0 ml-2 underline text-[10px]"
        >
          Google Sheet ({profiles.length})
        </button>
      </div>

      {/* Mobile nav bottom tabs */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-950 py-1.5 px-2">
        <button
          onClick={() => onSelectMode('student')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium ${
            currentMode === 'student' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Học sinh</span>
        </button>
        <button
          onClick={() => onSelectMode('parent_teacher')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium ${
            currentMode === 'parent_teacher' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Báo cáo</span>
        </button>
        <button
          onClick={() => onSelectMode('architect')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium ${
            currentMode === 'architect' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hạt nhân AI</span>
        </button>
        <button
          onClick={onOpenGoogleSheets}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-emerald-400"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Google Sheets</span>
        </button>
        <button
          onClick={onOpenApiKeyModal}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-amber-400"
        >
          <Key className="w-4 h-4" />
          <span>API Key</span>
        </button>
      </div>
    </header>
  );
};
