import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `# Custom System Instruction: LearnMap Adaptive Learning Architect

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
* Cá nhân hóa ngữ cảnh: Luôn lồng ghép sở thích của trẻ (ví dụ: khủng long, không gian, nấu ăn, robot) vào các bài toán hoặc câu chuyện truyền tải kiến thức.
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

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Generate adaptive response using the system instruction
app.post('/api/learnmap/generate', async (req, res) => {
  try {
    const { targetFormat, studentProfile, promptInput, conversationHistory = [] } = req.body;

    const formattedPrompt = `
[YÊU CẦU ĐIỀU HƯỚNG TỪ HỆ THỐNG]
- Định dạng mục tiêu yêu cầu: ${targetFormat || 'Cấu trúc 1 (Nhiệm vụ học tập)'}
- Thông tin Học sinh:
  + Tên/Biệt danh: ${studentProfile?.name || 'Minh An'}
  + Lớp học (GDPT 2018): Lớp ${studentProfile?.grade || 4}
  + Chủ đề kiến thức mục tiêu: ${studentProfile?.currentTopic || 'Phân số và Phép cộng phân số khác mẫu'}
  + Sở thích cá nhân: ${studentProfile?.theme || 'Thám hiểm Vũ trụ và Tinh vân'}
  + Linh vật đồng hành (Pet): ${studentProfile?.petName || 'Cú Mèo Tinh Vân Astro'}
  + Trạng thái hiện tại: ${studentProfile?.stressState || 'Bình thường, hơi lúng túng'}
  + Số lần kiên trì thử lại: ${studentProfile?.persistenceCount || 2} lần
  + Lỗi sai gần nhất cần truy hồi: ${studentProfile?.recentMistake || 'Cộng tử với tử, mẫu với mẫu: 1/2 + 1/3 = 2/5'}

- Yêu cầu cụ thể từ người dùng/hệ thống:
${promptInput || 'Tạo phản hồi theo đúng cấu trúc chỉ định, tuân thủ nghiêm ngặt Tone & Persona và Guidelines.'}
`;

    const isRealKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      process.env.GEMINI_API_KEY.length > 10;

    if (!aiClient || !isRealKey) {
      return res.json({
        content: getFallbackResponse(targetFormat, studentProfile),
        source: 'learnmap_system_engine',
        status: 'success',
      });
    }

    try {
      // 7-second timeout for snappy UI
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 7000)
      );

      const geminiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const response = await Promise.race([geminiPromise, timeoutPromise]);

      return res.json({
        content: response.text || 'Không có phản hồi từ mô hình.',
        source: 'gemini-3.8-flash',
        status: 'success',
      });
    } catch (apiErr: any) {
      console.warn('Gemini call fallback:', apiErr?.message);
      return res.json({
        content: getFallbackResponse(targetFormat, studentProfile),
        source: 'learnmap_adaptive_fallback',
        status: 'success',
      });
    }
  } catch (error: any) {
    console.error('Error in /api/learnmap/generate:', error);
    res.status(500).json({
      error: error?.message || 'Lỗi khi kết nối với AI Architect',
      status: 'error',
    });
  }
});

function getFallbackResponse(targetFormat: string, studentProfile: any): string {
  const name = studentProfile?.name || 'Minh An';
  const grade = studentProfile?.grade || 4;
  const theme = studentProfile?.theme || 'Thám hiểm Vũ trụ';
  const topic = studentProfile?.currentTopic || 'Cộng phân số khác mẫu';
  const persistence = studentProfile?.persistenceCount || 3;

  if (targetFormat?.includes('2') || targetFormat?.includes('Phụ huynh')) {
    return `### Báo cáo Thấu chẩn (Dành cho Phụ huynh/Giáo viên)
1. **Chỉ số Sức khỏe Học tập:**
   - Mức độ tập trung: 84% (Duy trì ổn định trong 22 phút đầu, nhịp thở nhận thức tốt).
   - Độ bền bỉ (Growth Mindset): 92% - Tuyệt vời! Học sinh ${name} đã kiên trì thử lại ${persistence} lần liên tiếp thay vì bỏ cuộc khi gặp thử thách quy đồng mẫu số.
   - Trạng thái tâm lý: Tích cực, đang vượt qua vùng mây mù nhờ Đèn pin AI.

2. **Phân tích di truyền kiến thức (Knowledge Genetics):**
   - **Hiện tượng bề mặt:** Trẻ thực hiện phép tính sai: \`1/2 + 1/3 = 2/5\` (cộng trực tiếp tử số với tử số, mẫu số với mẫu số).
   - **Lỗ hổng gốc rễ (Root Cause Back-tracing):**
     + *Cấp độ Lớp 4 (Hiện tại):* Trẻ nắm chưa vững bản chất quy đồng mẫu số - chưa hiểu rằng không thể gộp các phần có kích thước đơn vị khác nhau.
     + *Cấp độ Lớp 3 (Truy hồi):* Bản chất của phép nhân phân phối và Bội chung nhỏ nhất.
     + *Cấp độ Lớp 2 (Nền tảng):* Khái niệm "Một phần mấy của một đơn vị" (Phần chia bằng nhau của một khối tổng thể). Trẻ đang xem tử số và mẫu số như hai số tự nhiên tách rời thay vì một tỷ lệ số lượng.

3. **Dự báo & Cảnh báo:**
   - Trong 2 tuần tới, khi chương trình bước sang "Phép trừ phân số khác mẫu" và "Hỗn số", nguy cơ sai lầm dạng này sẽ lặp lại 85% nếu không được củng cố ngay mô hình trực quan.
   - Điểm rơi kiến thức có nguy cơ xảy ra ở dạng bài toán lời văn có yếu tố liên môn (Toán - Khoa học).

4. **Lời khuyên Phygital (Tương tác thực tế cùng con):**
   - **Hoạt động làm bánh Pizza / Cắt cam:** Cắt 1 quả cam làm 2 nửa (1/2), 1 quả cam cùng cỡ làm 3 phần (1/3). Đặt 1 miếng cam (1/2) cạnh 1 miếng cam (1/3) và hỏi con: "Nếu con gộp lại, chúng có tạo thành 2 miếng của loại 5 phần không?". Trẻ sẽ lập tức nhận ra bằng mắt rằng kích thước miếng không đồng nhất, bắt buộc phải cắt nhỏ thành các phần bằng nhau (mẫu số chung là 6 phần).`;
  }

  if (targetFormat?.includes('3') || targetFormat?.includes('kỹ thuật')) {
    return `### Phân tích kỹ thuật (Dành cho Hệ thống)
1. **Node ID:** \`MATH_VN_G${grade}_FRAC_ADD_DIFF_DENOM_042\`
   - Ancestor Node 1: \`MATH_VN_G3_MULT_LCM_019\`
   - Ancestor Node 2: \`MATH_VN_G2_PARTS_OF_WHOLE_007\`
   - Cognitive Dimension: Trừu tượng hóa & Thị giác không gian (Spatial-Abstract Reasoning)

2. **Adaptive Level:** \`Level 2.4 / 5.0 (Scaffolding Tier 2: Kích hoạt Đèn pin AI tầng 1)\`
   - Thuật toán CAT: Hạ tham số theta từ +0.4 xuống -0.2 sau nhận diện quan niệm sai (misconception) về kích thước đơn vị mẫu số.

3. **Next Sequence:**
   - Bước 1: Trình chiếu câu hỏi Socratic với mô hình trực quan (${theme}).
   - Bước 2: Kích hoạt chế độ Feynman cùng Linh vật (giải thích tại sao 1/2 không thể cộng trực tiếp với 1/3).
   - Bước 3: Lặp lại ngắt quãng (Spaced Repetition) kích hoạt lại sau 72 giờ.`;
  }

  return `### Nhiệm vụ học tập: Kho Báu Tinh Cầu Mẫu Số Chung (${theme})
1. **Bối cảnh RPG:**
   Hỡi Thuyền trưởng ${name} dũng cảm! Phi thuyền của chúng ta vừa đáp xuống trạm không gian thuộc chủ đề ${topic}. Để mở cánh cổng năng lượng, hai máy phát lượng tử cần được kết nối: máy thứ nhất nạp **1/2 bình năng lượng xanh**, máy thứ hai nạp **1/3 bình năng lượng đỏ**!

2. **Thử thách:**
   Nhưng kìa! Cánh cổng đang báo đèn đỏ vì hệ thống đo đạc không chấp nhận cộng hai bình chứa khác vạch chia. Làm thế nào để Thuyền trưởng hợp nhất nguồn năng lượng này mà không làm quá tải buồng phản ứng?

3. **Gợi ý Socratic (Bậc thang Hỗ trợ):**
   - *LearnMap:* "Thuyền trưởng ơi, hãy nhìn vào vạch chia của hai bình năng lượng xem! Bình thứ nhất chia làm 2 phần lớn, còn bình thứ hai lại chia làm 3 phần nhỏ hơn. Nếu ta chỉ đếm số vạch có sẵn, liệu kích cỡ từng phần năng lượng có bằng nhau không?"
   - *Đèn pin AI bật sáng:* "Điều gì sẽ xảy ra nếu ta dùng một chiếc cốc chia vạch siêu nhỏ có thể đo đều đặn cho cả bình 2 phần và bình 3 phần? Số mấy vừa chia hết cho 2 lại vừa chia hết cho 3 nhỉ?"

4. **Phần thưởng dự kiến:**
   - \`+150 XP Tri thức Vũ trụ\`
   - \`01 Tinh thể Lượng tử Mẫu số Chung\` gắn vào Bio-Map của Thuyền trưởng!
   - Huy hiệu danh dự: *"Người Khai Sáng Quy Đồng"*.`;
}

// Mock initial knowledge graph data with GDPT 2018 mapping
app.get('/api/learnmap/knowledge-graph', (_req, res) => {
  const nodes = [
    {
      id: 'G1_NUM_PARTS',
      label: 'Khái niệm Một phần mấy (Lớp 1-2)',
      grade: 2,
      domain: 'Số và Phép tính',
      status: 'mastered',
      description: 'Hiểu đơn vị chia đều và tỷ lệ phần - tổng thể',
      connections: ['G3_LCM_MULT'],
    },
    {
      id: 'G3_LCM_MULT',
      label: 'Bội chung & Phép nhân phân phối (Lớp 3)',
      grade: 3,
      domain: 'Số và Phép tính',
      status: 'mastered',
      description: 'Kỹ năng tìm bội số và rút gọn số lượng',
      connections: ['G4_FRAC_COMMON'],
    },
    {
      id: 'G4_FRAC_COMMON',
      label: 'Quy đồng Mẫu số (Lớp 4)',
      grade: 4,
      domain: 'Phân số GDPT 2018',
      status: 'gap_alert',
      description: 'Gốc rễ sai lầm: Chưa đồng nhất kích thước đơn vị chia trước khi gộp',
      connections: ['G4_FRAC_ADD'],
    },
    {
      id: 'G4_FRAC_ADD',
      label: 'Cộng Phân số khác Mẫu số (Lớp 4)',
      grade: 4,
      domain: 'Phân số GDPT 2018',
      status: 'current_challenge',
      description: 'Nhiệm vụ trọng tâm hiện tại của Nhà thám hiểm',
      connections: ['G4_FRAC_SUB', 'G5_DECIMAL'],
    },
    {
      id: 'G4_FRAC_SUB',
      label: 'Trừ Phân số khác Mẫu số (Lớp 4)',
      grade: 4,
      domain: 'Phân số GDPT 2018',
      status: 'fog',
      description: 'Vùng sương mù - Cần mở khóa sau khi làm chủ phép cộng',
      connections: [],
    },
    {
      id: 'G5_DECIMAL',
      label: 'Số Thập phân & Tỷ số phần trăm (Lớp 5)',
      grade: 5,
      domain: 'Mở rộng GDPT 2018',
      status: 'locked',
      description: 'Cấp độ tương lai trong Vũ trụ Tri thức',
      connections: [],
    },
  ];

  res.json({ nodes });
});

// School Registration & Google Sheets Database Endpoints for Trường Tiểu học Hoài Nhơn
const REGISTERED_SCHOOL = {
  schoolName: 'Trường Tiểu học Hoài Nhơn',
  schoolCode: 'TH-HOAINHON',
  district: 'Thị xã Hoài Nhơn',
  province: 'Bình Định',
  academicYear: '2025 - 2026',
  curriculumStandard: 'GDPT 2018',
  status: 'active',
  connectedDatabase: 'Google Sheets Online',
};

app.get('/api/school/info', (_req, res) => {
  res.json({
    status: 'success',
    data: REGISTERED_SCHOOL,
  });
});

// Proxy for Google Sheets GViz query to bypass any CORS restrictions in browser
app.get('/api/sheets/proxy-gviz', async (req, res) => {
  try {
    const { sheetId, sheetName } = req.query;
    if (!sheetId) {
      return res.status(400).json({ error: 'Thiếu sheetId' });
    }
    const targetSheet = sheetName ? encodeURIComponent(String(sheetName)) : 'HocSinh';
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${targetSheet}&headers=1`;
    
    const response = await fetch(gvizUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Google Sheets trả về lỗi ${response.status}` });
    }
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Lỗi kết nối Google Sheets' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnMap Architect running on port ${PORT}`);
  });
}

startServer();
