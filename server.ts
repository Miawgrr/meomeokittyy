import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const DATA_DIR = path.join(process.cwd(), "data");
const CHARACTERS_FILE = path.join(DATA_DIR, "characters.json");
const COMMENTS_FILE = path.join(DATA_DIR, "secret_comments.json");
const BOT_FEEDBACKS_FILE = path.join(DATA_DIR, "bot_feedbacks.json");
const HEARTS_FILE = path.join(DATA_DIR, "hearts.json");

async function ensureDataSetup() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

async function startServer() {
  await ensureDataSetup();

  const app = express();
  const PORT = 3000;

  // Use higher limits for base64 image uploads if any
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // GET characters from server
  app.get("/api/characters", async (req, res) => {
    try {
      const exists = await fs.access(CHARACTERS_FILE).then(() => true).catch(() => false);
      if (!exists) {
        return res.json([]);
      }
      const raw = await fs.readFile(CHARACTERS_FILE, "utf-8");
      const list = JSON.parse(raw);
      res.json(list);
    } catch (error) {
      console.error("Error reading characters:", error);
      res.json([]);
    }
  });

  // POST/Save characters to server
  app.post("/api/characters", async (req, res) => {
    try {
      const newList = req.body;
      if (!Array.isArray(newList)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Read existing characters to preserve the server-side view count
      let existingList: any[] = [];
      const exists = await fs.access(CHARACTERS_FILE).then(() => true).catch(() => false);
      if (exists) {
        try {
          const raw = await fs.readFile(CHARACTERS_FILE, "utf-8");
          existingList = JSON.parse(raw);
        } catch (e) {
          console.error("Error reading existing characters during save:", e);
        }
      }

      const existingMap = new Map(existingList.map(c => [c.id, c]));

      // Merge new list with existing views to prevent clients from resetting/overwriting them
      const mergedList = newList.map(c => {
        const existing = existingMap.get(c.id);
        return {
          ...c,
          views: existing ? (existing.views || 0) : (c.views || 0)
        };
      });

      await fs.writeFile(CHARACTERS_FILE, JSON.stringify(mergedList, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error saving characters:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST increment character views atomically on the server
  app.post("/api/characters/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      let list: any[] = [];
      const exists = await fs.access(CHARACTERS_FILE).then(() => true).catch(() => false);
      if (exists) {
        const raw = await fs.readFile(CHARACTERS_FILE, "utf-8");
        list = JSON.parse(raw);
      }

      let updatedViews = 1;
      let found = false;

      const updatedList = list.map(c => {
        if (c.id === id) {
          found = true;
          updatedViews = (c.views || 0) + 1;
          return { ...c, views: updatedViews };
        }
        return c;
      });

      if (!found) {
        return res.status(404).json({ error: "Character not found" });
      }

      await fs.writeFile(CHARACTERS_FILE, JSON.stringify(updatedList, null, 2), "utf-8");
      res.json({ success: true, views: updatedViews });
    } catch (error: any) {
      console.error("Error incrementing views:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET secret comments from server
  app.get("/api/secret-comments", async (req, res) => {
    try {
      const exists = await fs.access(COMMENTS_FILE).then(() => true).catch(() => false);
      if (!exists) {
        return res.json([]);
      }
      const raw = await fs.readFile(COMMENTS_FILE, "utf-8");
      const list = JSON.parse(raw);
      res.json(list);
    } catch (error) {
      console.error("Error reading comments:", error);
      res.json([]);
    }
  });

  // POST/Save secret comments to server
  app.post("/api/secret-comments", async (req, res) => {
    try {
      const list = req.body;
      if (!Array.isArray(list)) {
        return res.status(400).json({ error: "Invalid data format" });
      }
      await fs.writeFile(COMMENTS_FILE, JSON.stringify(list, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error saving comments:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET bot feedbacks from server
  app.get("/api/bot-feedbacks", async (req, res) => {
    try {
      const exists = await fs.access(BOT_FEEDBACKS_FILE).then(() => true).catch(() => false);
      if (!exists) {
        return res.json([]);
      }
      const raw = await fs.readFile(BOT_FEEDBACKS_FILE, "utf-8");
      const list = JSON.parse(raw);
      res.json(list);
    } catch (error) {
      console.error("Error reading bot feedbacks:", error);
      res.json([]);
    }
  });

  // POST/Save bot feedbacks to server
  app.post("/api/bot-feedbacks", async (req, res) => {
    try {
      const list = req.body;
      if (!Array.isArray(list)) {
        return res.status(400).json({ error: "Invalid data format" });
      }
      await fs.writeFile(BOT_FEEDBACKS_FILE, JSON.stringify(list, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error saving bot feedbacks:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET heart total count from server
  app.get("/api/hearts", async (req, res) => {
    try {
      const exists = await fs.access(HEARTS_FILE).then(() => true).catch(() => false);
      if (!exists) {
        return res.json({ count: 520 });
      }
      const raw = await fs.readFile(HEARTS_FILE, "utf-8");
      const data = JSON.parse(raw);
      res.json({ count: data.count ?? 520 });
    } catch (error) {
      console.error("Error reading hearts:", error);
      res.json({ count: 520 });
    }
  });

  // POST/Save heart count to server
  app.post("/api/hearts", async (req, res) => {
    try {
      const { count } = req.body;
      if (typeof count !== "number") {
        return res.status(400).json({ error: "Invalid count" });
      }
      await fs.writeFile(HEARTS_FILE, JSON.stringify({ count }, null, 2), "utf-8");
      res.json({ success: true, count });
    } catch (error: any) {
      console.error("Error saving hearts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for Character Chat / Greeting
  app.post("/api/chat", async (req, res) => {
    try {
      const { characterName, characterRole, plot, storyline, userMood, customQuestion } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // High-quality fallback response when GEMINI_API_KEY is not defined yet
        const moodText = userMood ? `đang cảm thấy "${userMood}"` : "ghé thăm";
        let fallbackText = `Xin chào! Tôi là ${characterName} (${characterRole || 'Nhân vật'}). Thật tuyệt khi bạn ghé thăm tôi khi ${moodText}. `;
        
        if (plot) {
          fallbackText += `Cốt truyện của tôi xoay quanh: "${plot}". `;
        }
        
        if (customQuestion) {
          fallbackText += `Bạn hỏi tôi: "${customQuestion}". Đó là một câu hỏi rất thú vị! Hãy kết nối API Key để tôi trả lời chi tiết hơn nhé.`;
        } else {
          fallbackText += `Hãy đồng hành cùng tôi và cùng khám phá những câu chuyện phiêu lưu kỳ thú tiếp theo nhé!`;
        }
        
        return res.json({
          text: `[Chế độ Mô phỏng - Chưa kết nối Gemini API] ${fallbackText}`
        });
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemPrompt = `Bạn là một nhân vật hư cấu hoặc lịch sử đang trò chuyện trực tiếp với người dùng:
Tên nhân vật: ${characterName}
Danh hiệu/Vai trò: ${characterRole || 'Nhân vật tự do'}
Tóm tắt cốt truyện (Plot): ${plot || 'Chưa cập nhật'}
Cốt truyện chi tiết (Storyline): ${storyline || 'Chưa cập nhật'}

Nhiệm vụ của bạn: Hãy viết một lời chào mừng/phản hồi cực kỳ sinh động, mang đậm cá tính, đại từ nhân xưng và phong thái riêng biệt của nhân vật dựa theo thông tin Plot và Storyline ở trên.
Tâm trạng người dùng hiện tại: ${userMood || 'bình thường'}.

${customQuestion ? `Người dùng hỏi bạn: "${customQuestion}". Hãy trả lời câu hỏi này một cách chân thực nhất, nhập vai 100% nhân vật ${characterName}.` : `Hãy đưa ra một lời khuyên, một lời chúc hoặc một lời bộc bạch ấm áp mang đậm dấu ấn cốt truyện của bạn để khích lệ người dùng.`}

Yêu cầu nghiêm ngặt:
1. Nhập vai 100% và xưng hô nhất quán đúng với độ tuổi, tính cách của nhân vật ${characterName}.
2. Đi thẳng vào câu trả lời tự nhiên, thân mật, sống động. Tránh dùng các câu rập khuôn như "Với tư cách là..." hay giới thiệu cứng nhắc.
3. Câu trả lời súc tích, hấp dẫn, trôi chảy, dài khoảng 3-5 câu (tối đa 120 từ), sử dụng tiếng Việt tự nhiên nhất.
4. Ở cuối câu trả lời, hãy đính kèm một nhãn dán phù hợp bằng cú pháp: [STICKER: love] hoặc [STICKER: happy] hoặc [STICKER: money] hoặc [STICKER: sad] hoặc [STICKER: angry] hoặc [STICKER: cute].`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: customQuestion ? `Trả lời câu hỏi: ${customQuestion}` : "Hãy nói lời chào của bạn!",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.85,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // API Route to simulate context-appropriate comments under a user's post
  app.post("/api/generate_social_comments", async (req, res) => {
    try {
      const { postContent, characters } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      const cuteFallbacks = [
        "Trời ơi cưng xỉu luôn á! 💕",
        "Meo meo meo meo~ Cho mình xin một slot nha! 🐾",
        "Tuyệt vời quá bạn iu ơi! 😍",
        "Đồng ý hai tay hai chân luôn, chuẩn không cần chỉnh!",
        "Ủng hộ bạn iu hết mình luôn! 🚀",
        "Bão tim bão like cho bạn iu luôn nè! 💥⚡",
        "Hóng các bài viết tiếp theo nha, nhớ tag tui nha!",
        "Đang buồn mà lướt thấy bài này thấy vui hẳn lên á 🥺"
      ];

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        const selectedCount = Math.min(3, characters.length);
        const shuffled = [...characters].sort(() => 0.5 - Math.random());
        const result = shuffled.slice(0, selectedCount).map((char: any) => ({
          characterId: char.id,
          characterName: char.name,
          comment: cuteFallbacks[Math.floor(Math.random() * cuteFallbacks.length)]
        }));
        return res.json({ comments: result });
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemPrompt = `Bạn là hệ thống mô phỏng tương tác mạng xã hội cho một thế giới ảo.
Nhiệm vụ của bạn: Hãy viết các bình luận phù hợp, tự nhiên và sinh động của một số nhân vật dưới bài đăng của người dùng.

Nội dung bài đăng của người dùng: "${postContent}"

Danh sách các nhân vật có thể bình luận (mỗi người có tính cách, vai trò riêng):
${characters.map((c: any) => `- Tên: ${c.name}, Vai trò: ${c.role || "Tự do"}, Tóm tắt cốt truyện: ${c.plot || ""}`).join("\n")}

Yêu cầu:
1. Chọn ngẫu nhiên khoảng 2 đến 3 nhân vật phù hợp nhất hoặc thú vị nhất từ danh sách để viết bình luận.
2. Bình luận của mỗi nhân vật phải thể hiện đúng cá tính, ngôn từ xưng hô đặc trưng của họ và đặc biệt phải LIÊN QUAN trực tiếp hoặc đưa ra phản hồi phù hợp với nội dung bài đăng của người dùng (nếu người dùng đăng tin vui thì chúc mừng, than thở thì an ủi, đăng chuyện hài thì trêu đùa, v.v.).
3. Bình luận cực kỳ ngắn gọn (chỉ 1 hoặc 2 câu, tối đa 40 từ), tự nhiên như ngôn ngữ MXH thực tế, có thể kèm icon cảm xúc phù hợp.
4. Trả về kết quả dưới dạng mảng JSON duy nhất có định dạng sau, KHÔNG thêm bất kỳ văn bản giải thích hay thẻ code nào khác:
[
  {
    "characterId": "id-của-nhân-vật",
    "characterName": "Tên nhân vật",
    "comment": "nội dung bình luận"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Hãy tạo các bình luận phù hợp dưới bài đăng.",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "[]";
      try {
        const parsedComments = JSON.parse(text);
        res.json({ comments: parsedComments });
      } catch (parseError) {
        console.error("JSON parse error from Gemini output:", text, parseError);
        const selectedCount = Math.min(3, characters.length);
        const shuffled = [...characters].sort(() => 0.5 - Math.random());
        const result = shuffled.slice(0, selectedCount).map((char: any) => ({
          characterId: char.id,
          characterName: char.name,
          comment: cuteFallbacks[Math.floor(Math.random() * cuteFallbacks.length)]
        }));
        res.json({ comments: result });
      }
    } catch (error: any) {
      console.error("Error generating comments:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  
  // Proxy to extract og:image from URLs (useful for Pinterest, Facebook links)
  app.get("/api/extract-image", async (req, res) => {
    try {
      const targetUrl = req.query.url;
      if (!targetUrl || typeof targetUrl !== "string") {
        return res.status(400).json({ error: "Missing url parameter" });
      }
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch URL" });
      }
      
      const html = await response.text();
      // Use regex to find og:image
      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>|<meta[^>]*content="([^"]+)"[^>]*property="og:image"[^>]*>/i);
      
      let imageUrl = "";
      if (ogImageMatch) {
        imageUrl = ogImageMatch[1] || ogImageMatch[2];
      }
      
      if (!imageUrl) {
        // Fallback for some sites using twitter:image
        const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"[^>]*>|<meta[^>]*content="([^"]+)"[^>]*name="twitter:image"[^>]*>/i);
        if (twitterImageMatch) {
          imageUrl = twitterImageMatch[1] || twitterImageMatch[2];
        }
      }
      
      // Decode HTML entities if necessary
      if (imageUrl) {
        imageUrl = imageUrl.replace(/&amp;/g, '&');
      }
      
      res.json({ imageUrl: imageUrl || targetUrl });
    } catch (error) {
      console.error("Extract image error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve Vite in dev or compiled static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
