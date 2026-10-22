export type AppMode = 'student' | 'parent_teacher' | 'architect';

export type StudentTheme = 'space' | 'dinosaurs' | 'cooking' | 'robotics' | 'ocean';

export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  className?: string; // Ví dụ: 4A1, 4A2
  schoolName?: string; // Trường Tiểu học Hoài Nhơn
  theme: StudentTheme;
  themeLabel: string;
  petName: string;
  petAvatar: string;
  currentTopic: string;
  targetNodeId: string;
  stressState: 'calm' | 'hesitant' | 'frustrated' | 'in_flow';
  persistenceCount: number;
  recentMistake: string;
  xp: number;
  bioMapCrystals: number;
  badges: string[];
  lastActive?: string;
}

export interface KnowledgeNode {
  id: string;
  code: string;
  label: string;
  grade: number;
  domain: string;
  status: 'mastered' | 'current_challenge' | 'gap_alert' | 'fog' | 'locked';
  x: number; // For visualization
  y: number;
  ancestors: string[]; // Root causes / prerequisites
  description: string;
  coreConcept: string;
  misconceptionAlert?: string;
  phygitalActivity?: {
    title: string;
    materials: string[];
    steps: string[];
    pedagogicalGoal: string;
  };
}

export interface SocraticStep {
  level: number;
  title: string;
  prompt: string;
  hint: string;
}

export interface GeneratedResponse {
  format: 'student_mission' | 'parent_report' | 'system_analysis';
  rawText: string;
  timestamp: string;
  source: string;
}

export interface SchoolInfo {
  schoolName: string; // Tên trường đăng ký: "Trường Tiểu học Hoài Nhơn"
  schoolCode: string; // TH-HOAINHON
  district: string; // Thị xã Hoài Nhơn
  province: string; // Bình Định
  academicYear: string; // 2025 - 2026
  teacherInCharge: string; // Thầy/Cô phụ trách
  totalStudents: number;
  lastSyncTime?: string;
  isRegistered: boolean;
}

export interface GoogleSheetsConfig {
  sheetId: string;
  sheetUrl: string;
  webAppUrl?: string; // Google Apps Script URL for 2-way sync
  studentSheetName: string; // 'HocSinh'
  curriculumSheetName: string; // 'ChuDeKienThuc'
  logsSheetName: string; // 'NhatKyHocTap'
  schoolSheetName: string; // 'ThongTinTruong'
  autoSyncInterval: number; // In seconds (0 = disabled)
  lastSyncedAt?: string;
  isConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  dataSource: 'google_sheets' | 'local_demo';
}

export interface LearningActivityLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  action: string;
  topic: string;
  result: 'correct' | 'socratic_guided' | 'need_scaffolding';
  xpAwarded: number;
  pedagogicalNote: string;
}
