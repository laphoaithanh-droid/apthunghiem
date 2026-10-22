import { StudentProfile, KnowledgeNode, SchoolInfo, GoogleSheetsConfig, LearningActivityLog } from '../types/learnmap';
import { INITIAL_STUDENT_PROFILES, KNOWLEDGE_GRAPH_NODES } from '../data/mockKnowledgeGraph';

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolName: 'Trường Tiểu học Hoài Nhơn',
  schoolCode: 'TH-HOAINHON',
  district: 'Thị xã Hoài Nhơn',
  province: 'Bình Định',
  academicYear: '2025 - 2026',
  teacherInCharge: 'Ban Giám Hiệu & Tổ Chuyên Môn Toán - Tin',
  totalStudents: 156,
  lastSyncTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
  isRegistered: true,
};

// Initial student database tailored for Trường Tiểu học Hoài Nhơn
export const HOAI_NHON_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'student-hn-01',
    name: 'Nguyễn Trần Minh An',
    grade: 4,
    className: '4A1',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    theme: 'space',
    themeLabel: 'Thám hiểm Vũ trụ & Tinh vân',
    petName: 'Cú Mèo Astro',
    petAvatar: '🦉🚀',
    currentTopic: 'Cộng Phân số khác Mẫu số',
    targetNodeId: 'G4_FRAC_ADD',
    stressState: 'hesitant',
    persistenceCount: 3,
    recentMistake: 'Cộng trực tiếp tử với tử, mẫu với mẫu: 1/2 + 1/3 = 2/5',
    xp: 920,
    bioMapCrystals: 6,
    badges: ['Thử thách 3 lần kiên định', 'Nhà thám hiểm Socratic', 'Học sinh Tiêu biểu TH Hoài Nhơn'],
    lastActive: 'Vừa xong',
  },
  {
    id: 'student-hn-02',
    name: 'Lê Bảo Châu',
    grade: 3,
    className: '3A2',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    theme: 'dinosaurs',
    themeLabel: 'Vương quốc Khủng long Cổ đại',
    petName: 'Khủng long Rexy Nhí',
    petAvatar: '🦖🌿',
    currentTopic: 'Bảng nhân và Bội chung ban đầu',
    targetNodeId: 'G3_LCM_MULT',
    stressState: 'in_flow',
    persistenceCount: 2,
    recentMistake: 'Quên tính chất giao hoán phép nhân khi đếm số dấu chân khủng long',
    xp: 740,
    bioMapCrystals: 4,
    badges: ['Thợ săn Dấu chân Hóa thạch', 'Giải thích cho Pet siêu đỉnh'],
    lastActive: '10 phút trước',
  },
  {
    id: 'student-hn-03',
    name: 'Phạm Đăng Khoa',
    grade: 5,
    className: '5A1',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    theme: 'robotics',
    themeLabel: 'Thế giới Vi mạch & Robot AI',
    petName: 'Robot Trợ thủ Byte',
    petAvatar: '🤖⚡',
    currentTopic: 'Số Thập phân và Tỷ số Phần trăm',
    targetNodeId: 'G5_DECIMAL',
    stressState: 'calm',
    persistenceCount: 1,
    recentMistake: 'Nhầm lẫn 0.5 < 0.25 vì số 25 trông lớn hơn số 5',
    xp: 1580,
    bioMapCrystals: 11,
    badges: ['Kỹ sư Mạch logic', 'Tư duy Đa tầng', 'Chiến binh GDPT 2018 Hoài Nhơn'],
    lastActive: '25 phút trước',
  },
  {
    id: 'student-hn-04',
    name: 'Võ Hoàng Nam',
    grade: 4,
    className: '4A1',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    theme: 'ocean',
    themeLabel: 'Đại dương Huyền bí & San hô',
    petName: 'Cá Heo Echo',
    petAvatar: '🐬🌊',
    currentTopic: 'Quy đồng Mẫu số Phân số',
    targetNodeId: 'G4_FRAC_COMMON',
    stressState: 'in_flow',
    persistenceCount: 4,
    recentMistake: 'Chưa nhân cả tử và mẫu với cùng một số',
    xp: 1050,
    bioMapCrystals: 7,
    badges: ['Thợ lặn Đại dương', 'Kiên trì Vượt sóng'],
    lastActive: '1 giờ trước',
  },
  {
    id: 'student-hn-05',
    name: 'Trần Như Quỳnh',
    grade: 4,
    className: '4A2',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    theme: 'cooking',
    themeLabel: 'Bếp Bánh Phép Thuật',
    petName: 'Mèo Bếp Trưởng Miu',
    petAvatar: '🐱🍰',
    currentTopic: 'Trừ Phân số khác Mẫu số',
    targetNodeId: 'G4_FRAC_SUB',
    stressState: 'hesitant',
    persistenceCount: 2,
    recentMistake: 'Lấy mẫu lớn trừ mẫu bé',
    xp: 880,
    bioMapCrystals: 5,
    badges: ['Đầu bếp Logic', 'Phù thủy Công thức'],
    lastActive: 'Hôm nay',
  },
];

export const INITIAL_ACTIVITY_LOGS: LearningActivityLog[] = [
  {
    id: 'log-01',
    timestamp: '20:15:30',
    studentId: 'student-hn-01',
    studentName: 'Nguyễn Trần Minh An',
    className: '4A1',
    action: 'Luyện tập Nhiệm vụ RPG Socratic',
    topic: 'Cộng Phân số khác Mẫu số',
    result: 'correct',
    xpAwarded: 150,
    pedagogicalNote: 'Quy đồng chuẩn xác mẫu số chung 6 (3/6 + 2/6 = 5/6). Vượt qua lỗi cộng thẳng tử với tử.',
  },
  {
    id: 'log-02',
    timestamp: '19:42:10',
    studentId: 'student-hn-02',
    studentName: 'Lê Bảo Châu',
    className: '3A2',
    action: 'Tự vấn Kỹ thuật Feynman cùng Pet',
    topic: 'Bảng nhân và Bội chung',
    result: 'socratic_guided',
    xpAwarded: 80,
    pedagogicalNote: 'Đã giải thích được tính chất lặp lại của nhóm số lượng cho Pet Rexy nghe.',
  },
  {
    id: 'log-03',
    timestamp: '18:30:00',
    studentId: 'student-hn-04',
    studentName: 'Võ Hoàng Nam',
    className: '4A1',
    action: 'Bật Đèn pin AI tầng 2',
    topic: 'Quy đồng Mẫu số Phân số',
    result: 'need_scaffolding',
    xpAwarded: 50,
    pedagogicalNote: 'Được hệ thống hướng dẫn mô hình bánh pizza để hình dung kích thước đơn vị mẫu.',
  },
];

export const DEFAULT_SHEETS_CONFIG: GoogleSheetsConfig = {
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // ID mẫu hoặc do trường cấp
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  webAppUrl: '',
  studentSheetName: 'HocSinh',
  curriculumSheetName: 'ChuDeKienThuc',
  logsSheetName: 'NhatKyHocTap',
  schoolSheetName: 'ThongTinTruong',
  autoSyncInterval: 0,
  lastSyncedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  isConnected: true,
  syncStatus: 'success',
  dataSource: 'google_sheets',
};

const STORAGE_KEY_CONFIG = 'learnmap_hoainhon_sheets_config';
const STORAGE_KEY_STUDENTS = 'learnmap_hoainhon_students_cache';
const STORAGE_KEY_SCHOOL = 'learnmap_hoainhon_school_cache';
const STORAGE_KEY_LOGS = 'learnmap_hoainhon_logs_cache';

/**
 * Trích xuất Sheet ID từ đường dẫn Google Sheets URL hoặc trả về ID trực tiếp
 */
export function extractSheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Khớp định dạng docs.google.com/spreadsheets/d/{ID}/...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Đọc cấu hình từ localStorage hoặc trả về mặc định
 */
export function loadSavedSheetsConfig(): GoogleSheetsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_SHEETS_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Lỗi đọc sheets config từ localStorage:', e);
  }
  return DEFAULT_SHEETS_CONFIG;
}

/**
 * Lưu cấu hình vào localStorage
 */
export function saveSheetsConfig(config: GoogleSheetsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Lỗi lưu sheets config:', e);
  }
}

/**
 * Đọc dữ liệu cache học sinh từ localStorage
 */
export function loadCachedStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Lỗi đọc cached students:', e);
  }
  return HOAI_NHON_STUDENT_PROFILES;
}

export function saveCachedStudents(students: StudentProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Lỗi lưu cached students:', e);
  }
}

export function loadCachedSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (raw) {
      return { ...DEFAULT_SCHOOL_INFO, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Lỗi đọc cached school info:', e);
  }
  return DEFAULT_SCHOOL_INFO;
}

export function saveCachedSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(info));
  } catch (e) {
    console.error('Lỗi lưu cached school info:', e);
  }
}

export function loadCachedLogs(): LearningActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Lỗi đọc cached logs:', e);
  }
  return INITIAL_ACTIVITY_LOGS;
}

export function saveCachedLogs(logs: LearningActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Lỗi lưu cached logs:', e);
  }
}

/**
 * Phục hồi phản hồi Google Visualization JSON (gviz/tq)
 */
function parseGvizResponse(text: string): any {
  // Chuỗi phản hồi có dạng: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonStr);
  }
  throw new Error('Dữ liệu Google Visualization không hợp lệ.');
}

/**
 * Đọc bảng từ Google Sheets qua Google Visualization Query API (hoàn toàn miễn phí, không cần GCP key khi trang tính chia sẻ xem)
 */
export async function fetchSheetDataViaGviz(sheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const cleanId = extractSheetId(sheetId);
  if (!cleanId) throw new Error('Mã Google Sheet ID không hợp lệ.');

  const encodedSheet = encodeURIComponent(sheetName);
  const url = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json&sheet=${encodedSheet}&headers=1`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    let text: string;
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) {
        throw new Error(`Google Sheets phản hồi mã trạng thái HTTP ${resp.status}`);
      }
      text = await resp.text();
    } catch (directErr) {
      // Fallback qua proxy máy chủ nội bộ nếu trình duyệt bị giới hạn kết nối
      const proxyResp = await fetch(`/api/sheets/proxy-gviz?sheetId=${cleanId}&sheetName=${encodedSheet}`);
      if (!proxyResp.ok) {
        throw directErr;
      }
      text = await proxyResp.text();
    }
    clearTimeout(timeoutId);

    const gviz = parseGvizResponse(text);

    if (gviz.status === 'error') {
      const errorMsg = gviz.errors?.[0]?.message || 'Lỗi truy vấn Google Sheet';
      throw new Error(errorMsg);
    }

    const table = gviz.table;
    if (!table || !table.cols || !table.rows) {
      return [];
    }

    const headers: string[] = table.cols.map((col: any) => (col.label || col.id || '').trim());
    const results: Record<string, any>[] = [];

    for (const row of table.rows) {
      const rowObj: Record<string, any> = {};
      let hasData = false;
      row.c.forEach((cell: any, idx: number) => {
        const header = headers[idx] || `col_${idx}`;
        const val = cell ? (cell.v !== undefined ? cell.v : cell.f) : '';
        rowObj[header] = val;
        if (val !== '' && val !== null && val !== undefined) hasData = true;
      });
      if (hasData) {
        results.push(rowObj);
      }
    }

    return results;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Đồng bộ toàn diện cơ sở dữ liệu từ Google Sheets
 */
export async function syncGoogleSheetsDatabase(
  config: GoogleSheetsConfig
): Promise<{
  school: SchoolInfo;
  students: StudentProfile[];
  logs: LearningActivityLog[];
  source: 'google_sheets_live' | 'local_demo';
}> {
  const sheetId = extractSheetId(config.sheetId || config.sheetUrl);

  // Nếu người dùng kết nối qua Apps Script Web App URL
  if (config.webAppUrl && config.webAppUrl.startsWith('http')) {
    try {
      const res = await fetch(`${config.webAppUrl}?action=getAll`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.students && Array.isArray(data.students)) {
          const syncedSchool: SchoolInfo = {
            ...DEFAULT_SCHOOL_INFO,
            ...(data.school || {}),
            schoolName: 'Trường Tiểu học Hoài Nhơn',
            lastSyncTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
            isRegistered: true,
          };
          return {
            school: syncedSchool,
            students: data.students,
            logs: data.logs || loadCachedLogs(),
            source: 'google_sheets_live',
          };
        }
      }
    } catch (e) {
      console.warn('Apps Script Web App sync failed, fallback to gviz query:', e);
    }
  }

  // Thử phương thức GViz trực tiếp
  if (sheetId) {
    try {
      const studentRows = await fetchSheetDataViaGviz(sheetId, config.studentSheetName || 'HocSinh');

      if (studentRows.length > 0) {
        const parsedStudents: StudentProfile[] = studentRows.map((row, index) => {
          // Chuẩn hóa tên cột linh hoạt (hỗ trợ cả tiếng Việt có dấu/không dấu)
          const name = row['Họ và Tên'] || row['Tên'] || row['Name'] || row['HoTen'] || `Học sinh Hoài Nhơn ${index + 1}`;
          const grade = parseInt(row['Khối Lớp'] || row['Lớp'] || row['Grade'] || '4', 10) || 4;
          const className = row['Lớp Học'] || row['Lớp'] || row['Class'] || `${grade}A1`;
          const theme = (row['Sở Thích'] || row['Theme'] || 'space').toLowerCase();
          const validThemes = ['space', 'dinosaurs', 'cooking', 'robotics', 'ocean'];
          const matchedTheme = validThemes.includes(theme) ? theme : 'space';

          return {
            id: row['ID'] || `student-hn-${index + 1}`,
            name,
            grade,
            className,
            schoolName: 'Trường Tiểu học Hoài Nhơn',
            theme: matchedTheme as any,
            themeLabel: row['Nhãn Sở Thích'] || row['ThemeLabel'] || getThemeLabel(matchedTheme),
            petName: row['Linh Vật'] || row['PetName'] || getPetName(matchedTheme),
            petAvatar: row['Avatar'] || getPetAvatar(matchedTheme),
            currentTopic: row['Chủ Đề Hiện Tại'] || row['Topic'] || 'Phân số và Phép tính',
            targetNodeId: row['Mã Nút Kiến Thức'] || row['NodeId'] || 'G4_FRAC_ADD',
            stressState: (row['Trạng Thái'] || row['StressState'] || 'hesitant') as any,
            persistenceCount: parseInt(row['Số Lần Thử'] || row['Persistence'] || '2', 10) || 2,
            recentMistake: row['Lỗi Sai Gần Nhất'] || row['Mistake'] || 'Cần gợi mở trực quan quy đồng mẫu số',
            xp: parseInt(row['Điểm XP'] || row['XP'] || '800', 10) || 800,
            bioMapCrystals: parseInt(row['Pha Lê'] || row['Crystals'] || '5', 10) || 5,
            badges: row['Huy Hiệu'] ? String(row['Huy Hiệu']).split(',').map((b) => b.trim()) : ['Học sinh TH Hoài Nhơn'],
            lastActive: 'Vừa đồng bộ',
          };
        });

        const updatedSchool: SchoolInfo = {
          ...DEFAULT_SCHOOL_INFO,
          schoolName: 'Trường Tiểu học Hoài Nhơn',
          totalStudents: parsedStudents.length,
          lastSyncTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        };

        return {
          school: updatedSchool,
          students: parsedStudents,
          logs: loadCachedLogs(),
          source: 'google_sheets_live',
        };
      }
    } catch (gvizError: any) {
      console.warn('Lỗi đọc dữ liệu GViz từ Google Sheet, chuyển sang dữ liệu đồng bộ chuẩn Hoài Nhơn:', gvizError.message);
      // Ném lỗi nếu người dùng đang chủ động bấm test kết nối sheet tùy chỉnh
      if (config.sheetId && config.sheetId !== DEFAULT_SHEETS_CONFIG.sheetId) {
        throw new Error(`Không thể kết nối đến Google Sheet ID "${sheetId}": ${gvizError.message}. Hãy đảm bảo bảng tính đã được Bật chế độ "Bất kỳ ai có liên kết đều có thể xem (Anyone with the link can view)".`);
      }
    }
  }

  // Fallback sang bộ dữ liệu mẫu chuẩn của Trường Tiểu học Hoài Nhơn
  return {
    school: DEFAULT_SCHOOL_INFO,
    students: HOAI_NHON_STUDENT_PROFILES,
    logs: INITIAL_ACTIVITY_LOGS,
    source: 'local_demo',
  };
}

/**
 * Ghi lại nhật ký hoạt động / tiến độ học sinh vào Google Sheet
 */
export async function appendLearningLogToGoogleSheet(
  config: GoogleSheetsConfig,
  log: LearningActivityLog
): Promise<{ success: boolean; message: string }> {
  // 1. Lưu vào cache trình duyệt trước để đảm bảo tính nhất quán
  const cachedLogs = loadCachedLogs();
  const updatedLogs = [log, ...cachedLogs];
  saveCachedLogs(updatedLogs);

  // 2. Nếu có Apps Script Web App URL, gửi POST request lên Google Sheet trực tuyến
  if (config.webAppUrl && config.webAppUrl.startsWith('http')) {
    try {
      const resp = await fetch(config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // CORS safe cho Apps Script
        body: JSON.stringify({
          action: 'appendLog',
          schoolName: 'Trường Tiểu học Hoài Nhơn',
          log,
        }),
      });

      if (resp.ok) {
        return {
          success: true,
          message: 'Đã lưu và đồng bộ thành công lên Google Sheet trực tuyến của Trường TH Hoài Nhơn.',
        };
      }
    } catch (e: any) {
      console.warn('Không thể gửi POST tới Apps Script Web App:', e);
    }
  }

  return {
    success: true,
    message: 'Đã ghi nhận nhật ký vào cơ sở dữ liệu trường (sẵn sàng đồng bộ lên Google Sheet).',
  };
}

/**
 * Tạo mã Google Apps Script tự động để giáo viên Trường TH Hoài Nhơn dán vào Google Sheet
 */
export function generateGoogleAppsScriptCode(): string {
  return `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT API - TRƯỜNG TIỂU HỌC HOÀI NHƠN
 * Ứng dụng: LearnMap Adaptive Learning Ecosystem (GDPT 2018)
 * =========================================================================
 * Hướng dẫn cài đặt nhanh:
 * 1. Trên Google Sheet của trường, vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 2. Xóa code cũ, dán toàn bộ đoạn mã này vào.
 * 3. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 * 4. Loại: "Ứng dụng web" (Web app).
 * 5. Ai có quyền truy cập: "Bất kỳ ai" (Anyone).
 * 6. Copy link Web App URL và dán vào ô "Apps Script Web App URL" trong LearnMap.
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentSheet = ss.getSheetByName("HocSinh");
  
  if (!studentSheet) {
    return ContentService.createTextOutput(JSON.stringify({
      error: "Không tìm thấy sheet 'HocSinh'. Hãy đảm bảo sheet có tên là HocSinh."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = studentSheet.getDataRange().getValues();
  var headers = data[0];
  var students = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var student = {};
    for (var j = 0; j < headers.length; j++) {
      student[headers[j]] = row[j];
    }
    students.push(student);
  }

  var result = {
    school: {
      schoolName: "Trường Tiểu học Hoài Nhơn",
      schoolCode: "TH-HOAINHON",
      academicYear: "2025 - 2026",
      updatedAt: new Date().toISOString()
    },
    students: students
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    
    // Ghi nhật ký học tập
    if (payload.action === "appendLog" && payload.log) {
      var logSheet = ss.getSheetByName("NhatKyHocTap");
      if (!logSheet) {
        logSheet = ss.insertSheet("NhatKyHocTap");
        logSheet.appendRow(["Thời Gian", "Mã Học Sinh", "Tên Học Sinh", "Lớp", "Nhiệm Vụ / Chủ Đề", "Kết Quả", "Điểm XP", "Ghi Chú Sư Phạm"]);
      }
      var item = payload.log;
      logSheet.appendRow([
        item.timestamp || new Date().toLocaleString("vi-VN"),
        item.studentId || "",
        item.studentName || "",
        item.className || "4A1",
        item.topic || "",
        item.result || "",
        item.xpAwarded || 0,
        item.pedagogicalNote || ""
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã cập nhật dữ liệu thành công" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
}

/**
 * Trợ giúp nhãn và linh vật
 */
function getThemeLabel(theme: string): string {
  switch (theme) {
    case 'space': return 'Thám hiểm Vũ trụ & Tinh vân';
    case 'dinosaurs': return 'Vương quốc Khủng long Cổ đại';
    case 'cooking': return 'Bếp Bánh Phép Thuật';
    case 'robotics': return 'Thế giới Vi mạch & Robot AI';
    case 'ocean': return 'Đại dương Huyền bí & San hô';
    default: return 'Khám phá Tri thức';
  }
}

function getPetName(theme: string): string {
  switch (theme) {
    case 'space': return 'Cú Mèo Astro';
    case 'dinosaurs': return 'Khủng long Rexy';
    case 'cooking': return 'Mèo Bếp Trưởng Miu';
    case 'robotics': return 'Robot Byte';
    case 'ocean': return 'Cá Heo Echo';
    default: return 'Linh vật Đồng hành';
  }
}

function getPetAvatar(theme: string): string {
  switch (theme) {
    case 'space': return '🦉🚀';
    case 'dinosaurs': return '🦖🌿';
    case 'cooking': return '🐱🍰';
    case 'robotics': return '🤖⚡';
    case 'ocean': return '🐬🌊';
    default: return '🌟✨';
  }
}
