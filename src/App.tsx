import React, { useState, useEffect } from 'react';
import { 
  AppMode, 
  StudentProfile, 
  KnowledgeNode, 
  SchoolInfo, 
  GoogleSheetsConfig, 
  LearningActivityLog 
} from './types/learnmap';
import { KNOWLEDGE_GRAPH_NODES } from './data/mockKnowledgeGraph';
import { 
  loadCachedStudents, 
  saveCachedStudents, 
  loadCachedSchoolInfo, 
  saveCachedSchoolInfo, 
  loadSavedSheetsConfig, 
  saveSheetsConfig,
  loadCachedLogs,
  saveCachedLogs,
  appendLearningLogToGoogleSheet,
  syncGoogleSheetsDatabase
} from './services/googleSheetsService';
import { getStoredApiKey } from './services/geminiClientService';
import { Navbar } from './components/Navbar';
import { StudentExplorerView } from './components/StudentExplorerView';
import { ParentTeacherReportView } from './components/ParentTeacherReportView';
import { SystemArchitectConsole } from './components/SystemArchitectConsole';
import { SystemInstructionModal } from './components/SystemInstructionModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  Compass, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Heart, 
  School, 
  FileSpreadsheet,
  CheckCircle2,
  Key
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('student');
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(loadCachedSchoolInfo);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(loadSavedSheetsConfig);
  const [profiles, setProfiles] = useState<StudentProfile[]>(loadCachedStudents);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    const cached = loadCachedStudents();
    return cached[0]?.id || 'student-hn-01';
  });
  const [nodes, setNodes] = useState<KnowledgeNode[]>(KNOWLEDGE_GRAPH_NODES);
  const [activityLogs, setActivityLogs] = useState<LearningActivityLog[]>(loadCachedLogs);
  const [isSystemInstructionOpen, setIsSystemInstructionOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(() => {
    // Tự động mở modal nếu người dùng chưa nhập API key theo AI_INSTRUCTIONS
    return !getStoredApiKey();
  });

  // Auto-sync interval if configured by teacher
  useEffect(() => {
    if (!sheetsConfig.autoSyncInterval || sheetsConfig.autoSyncInterval <= 0) return;
    const interval = setInterval(async () => {
      try {
        const res = await syncGoogleSheetsDatabase(sheetsConfig);
        setProfiles(res.students);
        setSchoolInfo(res.school);
        saveCachedStudents(res.students);
        saveCachedSchoolInfo(res.school);
      } catch (e) {
        console.warn('Auto-sync tick error:', e);
      }
    }, sheetsConfig.autoSyncInterval * 1000);

    return () => clearInterval(interval);
  }, [sheetsConfig]);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === selectedProfile.id ? { ...p, ...updated } : p));
      saveCachedStudents(next);
      return next;
    });
  };

  const handleSelectProfile = (profile: StudentProfile) => {
    setSelectedProfileId(profile.id);
  };

  const handleUpdateConfig = (newConfig: GoogleSheetsConfig) => {
    setSheetsConfig(newConfig);
    saveSheetsConfig(newConfig);
  };

  const handleUpdateSchoolInfo = (newSchool: SchoolInfo) => {
    setSchoolInfo(newSchool);
    saveCachedSchoolInfo(newSchool);
  };

  const handleUpdateStudents = (newStudents: StudentProfile[]) => {
    setProfiles(newStudents);
    saveCachedStudents(newStudents);
  };

  const handleLogActivity = async (log: LearningActivityLog) => {
    const updated = [log, ...activityLogs];
    setActivityLogs(updated);
    saveCachedLogs(updated);
    await appendLearningLogToGoogleSheet(sheetsConfig, log);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        selectedProfile={selectedProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onOpenSystemInstruction={() => setIsSystemInstructionOpen(true)}
        schoolInfo={schoolInfo}
        sheetsConfig={sheetsConfig}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentMode === 'student' && (
          <StudentExplorerView
            profile={selectedProfile}
            nodes={nodes}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToReport={() => setCurrentMode('parent_teacher')}
            schoolInfo={schoolInfo}
            onLogActivity={handleLogActivity}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          />
        )}

        {currentMode === 'parent_teacher' && (
          <ParentTeacherReportView
            profile={selectedProfile}
            nodes={nodes}
            onOpenArchitect={() => setCurrentMode('architect')}
            schoolInfo={schoolInfo}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            onLogActivity={handleLogActivity}
          />
        )}

        {currentMode === 'architect' && (
          <SystemArchitectConsole
            profile={selectedProfile}
            nodes={nodes}
            onOpenSystemInstructionModal={() => setIsSystemInstructionOpen(true)}
            schoolInfo={schoolInfo}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-300">LearnMap Adaptive Learning Ecosystem</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              Đơn vị: {schoolInfo.schoolName}
            </span>
            <span>•</span>
            <span>Chuẩn GDPT 2018 (Việt Nam)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1 text-amber-400 hover:underline font-semibold"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Thiết lập Gemini Key</span>
            </button>
            <button
              onClick={() => setIsGoogleSheetsOpen(true)}
              className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Cơ sở dữ liệu Google Sheets ({profiles.length} học sinh)</span>
            </button>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bảo mật COPPA</span>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Socratic & Feynman</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Google Sheets Database Management Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        config={sheetsConfig}
        onUpdateConfig={handleUpdateConfig}
        schoolInfo={schoolInfo}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        students={profiles}
        onUpdateStudents={handleUpdateStudents}
        selectedStudentId={selectedProfileId}
        onSelectStudentId={setSelectedProfileId}
        activityLogs={activityLogs}
      />

      {/* Gemini API Key & Model Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* System Instruction Modal */}
      <SystemInstructionModal
        isOpen={isSystemInstructionOpen}
        onClose={() => setIsSystemInstructionOpen(false)}
      />
    </div>
  );
}
