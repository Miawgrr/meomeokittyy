import React, { useState, useEffect, useRef } from "react";
import { Send, DollarSign, Heart, Sparkles, ArrowLeft, RefreshCw, Bot, User as UserIcon, Image as ImageIcon, Smile, ChevronDown, Check, BookOpen, X, ZoomIn, CornerUpLeft, Hand, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Character } from "../types";
import { playMeowSound } from "../utils/audio";
import { formatImageUrl, isImageUrl } from "../utils/image";
import { STICKER_COLLECTION, getStickerForContext, detectStickerCategoryFromText, Sticker } from "../data/stickers";
import { safeJsonStringify } from "../utils/json";
import confetti from "canvas-confetti";

interface Message {
  id: string;
  sender: "user" | "character";
  text: string;
  timestamp: string;
  isMoneyTransfer?: boolean;
  moneyAmount?: number;
  moneyNote?: string;
  stickerUrl?: string;
  stickerAlt?: string;
  replyTo?: {
    id: string;
    text: string;
    sender: "user" | "character";
  };
  reactions?: {
    [emoji: string]: ("user" | "character")[];
  };
}

interface CharacterChatViewProps {
  characters: Character[];
  selectedCharacterId?: string;
  onBackToGrid: () => void;
  isDarkMode?: boolean;
}

const PRESET_MONEY_AMOUNTS = [
  { label: "20k", value: 20000, desc: "Ly trà sữa 🧋" },
  { label: "50k", value: 50000, desc: "Bữa ăn sáng 🥐" },
  { label: "100k", value: 100000, desc: "Túi bánh ngọt 🍰" },
  { label: "200k", value: 200000, desc: "Đi xem phim 🎬" },
  { label: "500k", value: 500000, desc: "Mua quà xinh 🎁" },
  { label: "1 triệu", value: 1000000, desc: "Cho anh/em tiêu xài 💸" },
  { label: "5 triệu", value: 5000000, desc: "Bao trọn tháng 💕" },
];

export const CharacterChatView: React.FC<CharacterChatViewProps> = ({
  characters,
  selectedCharacterId,
  onBackToGrid,
  isDarkMode = false,
}) => {
  const [activeCharId, setActiveCharId] = useState<string>(
    selectedCharacterId || (characters[0]?.id ?? "")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedStickerCat, setSelectedStickerCat] = useState<string>("all");
  const [zoomedSticker, setZoomedSticker] = useState<{ url: string; alt?: string } | null>(null);

  const [customAmount, setCustomAmount] = useState<number>(50000);
  const [moneyNote, setMoneyNote] = useState("Mua trà sữa cho anh/em nè 💕");
  const [showCharDropdown, setShowCharDropdown] = useState(false);
  const [showStorylineBanner, setShowStorylineBanner] = useState(true);
  const [isChatStoryExpanded, setIsChatStoryExpanded] = useState(false);

  useEffect(() => {
    setIsChatStoryExpanded(false);
  }, [activeCharId]);

  // Sync activeCharId when characters load or selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      setActiveCharId(selectedCharacterId);
    } else if (!activeCharId && characters && characters.length > 0) {
      setActiveCharId(characters[0].id);
    }
  }, [selectedCharacterId, characters]);

  // New Interactive States
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [charLiveStatus, setCharLiveStatus] = useState<string>("🟢 Đang online • Sẵn sàng trò chuyện");
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  const activeChar = (characters && characters.length > 0)
    ? (characters.find((c) => c && c.id === activeCharId) || characters.filter(Boolean)[0])
    : undefined;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Character Reaction Trigger
  const triggerAutoCharacterReaction = (
    msgId: string,
    msgType: "text" | "sticker" | "money",
    textContent = ""
  ) => {
    setTimeout(() => {
      let emoji = "❤️";
      if (msgType === "money") emoji = "💸";
      else if (msgType === "sticker") emoji = "🥰";
      else {
        const lower = textContent.toLowerCase();
        if (lower.includes("vui") || lower.includes("haha") || lower.includes("kk")) emoji = "😂";
        else if (lower.includes("buồn") || lower.includes("khóc") || lower.includes("nhớ")) emoji = "🥺";
        else if (lower.includes("mèo") || lower.includes("ngoan") || lower.includes("dễ thương")) emoji = "🐱";
        else if (lower.includes("yêu") || lower.includes("thương") || lower.includes("thích")) emoji = "💖";
        else emoji = "❤️";
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== msgId) return m;
          const currentRx = m.reactions || {};
          const charUsers = currentRx[emoji] || [];
          if (charUsers.includes("character")) return m;
          return {
            ...m,
            reactions: {
              ...currentRx,
              [emoji]: [...charUsers, "character"],
            },
          };
        })
      );

      setCharLiveStatus(`🥰 ${activeChar?.name} vừa thả cảm xúc ${emoji} vào tin nhắn của bạn!`);
    }, 1100);
  };

  // User Reaction Toggle
  const handleToggleReaction = (msgId: string, emoji: string, silent = false) => {
    playMeowSound();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const currentRx = m.reactions || {};
        const emojiUsers = currentRx[emoji] || [];
        const hasUser = emojiUsers.includes("user");

        const newEmojiUsers = hasUser
          ? emojiUsers.filter((u) => u !== "user")
          : [...emojiUsers, "user"];

        const updatedRx = { ...currentRx };
        if (newEmojiUsers.length === 0) {
          delete updatedRx[emoji];
        } else {
          updatedRx[emoji] = newEmojiUsers;
        }

        return { ...m, reactions: updatedRx };
      })
    );

    if (!silent) {
      const targetMsg = messages.find((m) => m.id === msgId);
      if (targetMsg && targetMsg.sender === "character") {
        setCharLiveStatus(`💖 ${activeChar?.name} cảm nhận được bạn vừa thả cảm xúc ${emoji}!`);
      }
    }
  };

  // Interactive Poke Character Action
  const handlePokeCharacter = async () => {
    if (!activeChar || isTyping) return;
    playMeowSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f43f5e", "#ec4899", "#a855f7"],
    });

    const pokePrompt = `[THÔNG BÁO HỆ THỐNG: Người dùng vừa chọc nhẹ vào má bạn (Poke 👋)]
Hãy phản hồi ngắn gọn 1-2 câu với phong thái giật mình, thẹn thùng hoặc trêu đùa ngọt ngào đúng tính cách nhân vật ${activeChar.name}!`;

    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: activeChar.name,
          characterRole: activeChar.plot || "Nhân vật",
          plot: activeChar.plot,
          storyline: activeChar.storyline,
          customQuestion: pokePrompt,
        }),
      });

      const data = await res.json();
      const rawReply = data.text || `Ơ... em chọc má anh đấy à? Nghiện chọc anh rồi đúng không? 💕`;
      const { cleanText, stickerObj } = parseAiReplyAndSticker(rawReply);

      const replySticker = stickerObj || getStickerForContext("cute");
      const charMsg: Message = {
        id: `msg_poke_${Date.now()}`,
        sender: "character",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        stickerUrl: replySticker.url,
        stickerAlt: replySticker.name,
      };
      setMessages((prev) => [...prev, charMsg]);
    } catch (err) {
      const fallbackSticker = getStickerForContext("cute");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_poke_fb_${Date.now()}`,
          sender: "character",
          text: `Này nhé! Lần sau chọc nữa là anh ôm chặt luôn đấy 💕`,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          stickerUrl: fallbackSticker.url,
          stickerAlt: fallbackSticker.name,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Interactive Heart Character Action
  const handleHeartCharacter = () => {
    playMeowSound();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#f43f5e", "#fb7185", "#fda4af"],
    });

    // Auto-react heart to latest character message
    const lastCharMsg = [...messages].reverse().find((m) => m.sender === "character");
    if (lastCharMsg) {
      handleToggleReaction(lastCharMsg.id, "❤️", true);
    }
  };

  // Load chat history from localStorage when active character changes
  useEffect(() => {
    if (!activeChar) return;
    setShowStorylineBanner(true);
    const storageKey = `meomeo_chat_history_${activeChar.id}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed: Message[] = JSON.parse(saved);
        // Filter out any previously auto-generated initial greeting messages
        const cleanMsgs = parsed.filter((m) => !m.id.startsWith("msg_init_"));
        setMessages(cleanMsgs);
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [activeCharId]);

  // Save messages to localStorage
  useEffect(() => {
    if (!activeChar) return;
    const storageKey = `meomeo_chat_history_${activeChar.id}`;
    try {
      localStorage.setItem(storageKey, safeJsonStringify(messages));
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  }, [messages, activeChar]);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Helper to process AI reply and extract sticker tag
  const parseAiReplyAndSticker = (rawText: string) => {
    let cleanText = rawText;
    let stickerObj: Sticker | null = null;

    // Check for [STICKER: category_or_tag] pattern
    const stickerMatch = rawText.match(/\[STICKER:\s*([a-zA-Z0-9_]+)\]/i);
    if (stickerMatch) {
      const categoryTag = stickerMatch[1].toLowerCase();
      cleanText = rawText.replace(/\[STICKER:\s*([a-zA-Z0-9_]+)\]/gi, "").trim();
      stickerObj = getStickerForContext(categoryTag);
    } else {
      // Auto-detect sticker category based on sentiment/content
      const detectedCat = detectStickerCategoryFromText(rawText);
      stickerObj = getStickerForContext(detectedCat);
    }

    return { cleanText, stickerObj };
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride !== undefined ? textOverride : inputText.trim();
    const attachedSticker = selectedSticker;

    if ((!textToSend && !attachedSticker) || isTyping || !activeChar) return;

    playMeowSound();

    const userMsgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      stickerUrl: attachedSticker?.url,
      stickerAlt: attachedSticker?.name,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            text: replyingTo.text || replyingTo.moneyNote || "Nhãn dán biểu cảm",
            sender: replyingTo.sender,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (textOverride === undefined) {
      setInputText("");
    }
    setSelectedSticker(null);

    const currentQuote = replyingTo;
    setReplyingTo(null);
    setIsTyping(true);
    setCharLiveStatus(`👀 ${activeChar.name} đang xem tin nhắn của bạn...`);

    // Trigger character auto-reaction on user message
    triggerAutoCharacterReaction(
      userMsgId,
      attachedSticker ? "sticker" : "text",
      textToSend || attachedSticker?.name
    );

    try {
      let promptPayload = textToSend;
      if (attachedSticker && textToSend) {
        promptPayload = `[THÔNG BÁO HỆ THỐNG: Người dùng vừa gửi cho bạn nhãn dán biểu cảm "${attachedSticker.name}" ĐI KÈM với tin nhắn: "${textToSend}"]. Hãy trả lời nối tiếp nội dung tin nhắn và bày tỏ cảm xúc ngọt ngào phù hợp tính cách nhân vật!`;
      } else if (attachedSticker && !textToSend) {
        promptPayload = `[THÔNG BÁO HỆ THỐNG: Người dùng vừa gửi cho bạn 1 nhãn dán biểu cảm: "${attachedSticker.name}"]. Hãy đáp lại ngọt ngào phù hợp tính cách nhân vật!`;
      } else if (currentQuote) {
        promptPayload = `[THÔNG BÁO HỆ THỐNG: Người dùng đang TRẢ LỜI TRỰC TIẾP tin nhắn trước đó của bạn (${currentQuote.sender === "character" ? "tin nhắn của bạn" : "tin nhắn của họ"}): "${currentQuote.text || "Nhãn dán/Chuyển tiền"}"].
Nội dung người dùng đáp lại: "${textToSend}". Hãy trả lời nối tiếp đúng ý này!`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: activeChar.name,
          characterRole: activeChar.plot || "Nhân vật hư cấu",
          plot: activeChar.plot,
          storyline: activeChar.storyline,
          customQuestion: promptPayload,
        }),
      });

      const data = await res.json();
      const rawReply = data.text || `Cảm ơn em đã nhắn cho anh nhé! Anh luôn ở đây lắng nghe em. 💕`;
      const { cleanText, stickerObj } = parseAiReplyAndSticker(rawReply);

      const charMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sender: "character",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        stickerUrl: stickerObj?.url,
        stickerAlt: stickerObj?.name,
        replyTo: {
          id: userMsgId,
          text: textToSend || attachedSticker?.name || "Nhãn dán",
          sender: "user",
        },
      };

      setMessages((prev) => [...prev, charMsg]);
    } catch (error) {
      console.error("Chat API error:", error);
      const fallbackSticker = getStickerForContext("love");
      const fallbackMsg: Message = {
        id: `msg_${Date.now()}_fallback`,
        sender: "character",
        text: `Anh rất vui khi nghe em chia sẻ! Hãy luôn vui vẻ và hạnh phúc nhé 💖`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        stickerUrl: fallbackSticker.url,
        stickerAlt: fallbackSticker.name,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setCharLiveStatus("🟢 Sẵn sàng trò chuyện");
    }
  };

  const handleSelectSticker = (sticker: Sticker) => {
    playMeowSound();
    setSelectedSticker(sticker);
    setShowStickerPicker(false);
  };

  const handleSendMoneyTransfer = async () => {
    if (!activeChar || customAmount <= 0) return;

    playMeowSound();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#fbbf24", "#f43f5e", "#10b981", "#3b82f6"],
    });

    const moneySticker = getStickerForContext("money");
    const moneyMsgId = `money_${Date.now()}`;

    const moneyMsg: Message = {
      id: moneyMsgId,
      sender: "user",
      text: `Đã chuyển ${customAmount.toLocaleString("vi-VN")} VNĐ`,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      isMoneyTransfer: true,
      moneyAmount: customAmount,
      moneyNote: moneyNote.trim() || "Chuyển tiền yêu thương 💕",
      stickerUrl: moneySticker.url,
      stickerAlt: moneySticker.name,
    };

    setMessages((prev) => [...prev, moneyMsg]);
    setShowMoneyModal(false);
    setIsTyping(true);
    setCharLiveStatus(`💸 ${activeChar.name} ngỡ ngàng nhận được ${customAmount.toLocaleString("vi-VN")} VNĐ!`);

    triggerAutoCharacterReaction(moneyMsgId, "money");

    try {
      const promptForMoney = `[THÔNG BÁO HỆ THỐNG: Người dùng vừa chuyển cho bạn ${customAmount.toLocaleString("vi-VN")} VNĐ với lời nhắn đính kèm: "${moneyNote.trim()}"]
Hãy phản hồi với tư cách nhân vật ${activeChar.name}.
Tính cách & Cốt truyện: ${activeChar.plot}.
Hãy thể hiện cảm xúc chân thực (bất ngờ, blushing/ngượng ngùng, cảm ơn ấm áp, hoặc nhận tiền với phong thái đặc trưng của bạn trong cốt truyện)!`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: activeChar.name,
          characterRole: activeChar.plot || "Nhân vật",
          plot: activeChar.plot,
          storyline: activeChar.storyline,
          customQuestion: promptForMoney,
        }),
      });

      const data = await res.json();
      const rawReply =
        data.text ||
        `Ôi, em chuyển ${customAmount.toLocaleString("vi-VN")} VNĐ cho anh sao?! Cảm ơn em rất nhiều vì sự ngọt ngào này nhé! 💕`;

      const { cleanText, stickerObj } = parseAiReplyAndSticker(rawReply);
      const replyMoneySticker = stickerObj || getStickerForContext("money");

      const charMsg: Message = {
        id: `msg_${Date.now()}_money_reply`,
        sender: "character",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        stickerUrl: replyMoneySticker.url,
        stickerAlt: replyMoneySticker.name,
      };

      setMessages((prev) => [...prev, charMsg]);
    } catch (error) {
      console.error("Money transfer reply error:", error);
      const replySticker = getStickerForContext("money");
      const fallbackMsg: Message = {
        id: `msg_${Date.now()}_fallback`,
        sender: "character",
        text: `Cảm ơn em đã gửi ${customAmount.toLocaleString("vi-VN")} VNĐ cho anh nhé! Anh thực sự rất bất ngờ và xúc động 💕`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        stickerUrl: replySticker.url,
        stickerAlt: replySticker.name,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetHistory = () => {
    if (!activeChar) return;
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện với ${activeChar.name}?`)) {
      const storageKey = `meomeo_chat_history_${activeChar.id}`;
      localStorage.removeItem(storageKey);
      setMessages([]);
      setShowStorylineBanner(true);
      playMeowSound();
    }
  };

  const filteredStickers = STICKER_COLLECTION;

  if (!activeChar) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p>Chưa có nhân vật nào để trò chuyện.</p>
        <button
          onClick={onBackToGrid}
          className={`mt-4 px-4 py-2 rounded-xl transition-all ${
            isDarkMode 
              ? "bg-rose-500 text-white" 
              : "bg-rose-100 text-stone-900 border border-rose-200 hover:bg-rose-200"
          }`}
        >
          Trở về kho nhân vật
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto w-full px-2 sm:px-4 py-2">
      {/* Top Bar / Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl border shadow-sm mb-3 transition-colors gap-3 ${
          isDarkMode
            ? "bg-stone-900/90 border-stone-800 text-stone-100"
            : "bg-white/90 border-[#eadbca] text-stone-800"
        }`}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToGrid}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isDarkMode
                ? "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700"
                : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200"
            }`}
            title="Trở về kho nhân vật"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Character Avatar & Selector Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowCharDropdown(!showCharDropdown)}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="relative w-11 h-11 rounded-full border overflow-hidden shrink-0 shadow-inner">
                {isImageUrl(activeChar.avatar) ? (
                  <img
                    src={formatImageUrl(activeChar.avatar)}
                    alt={activeChar.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-rose-100 text-xl">
                    {activeChar.avatar}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-serif font-bold text-sm sm:text-base">{activeChar.name}</h2>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-500 transition-transform" />
                </div>
                <p className={`text-[11px] truncate max-w-[180px] sm:max-w-xs ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                  {activeChar.plot || "Nhân vật trực tuyến"}
                </p>
              </div>
            </button>

            {/* Character Selector Dropdown */}
            <AnimatePresence>
              {showCharDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className={`absolute top-full left-0 mt-2 w-64 sm:w-72 rounded-2xl border shadow-xl z-50 p-2 max-h-80 overflow-y-auto ${
                    isDarkMode
                      ? "bg-stone-900 border-stone-800 text-stone-100"
                      : "bg-white border-[#eadbca] text-stone-800"
                  }`}
                >
                  <div className="px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 border-b border-stone-200/10 mb-1">
                    Chọn Nhân Vật Để Chat
                  </div>
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setActiveCharId(char.id);
                        setShowCharDropdown(false);
                        playMeowSound();
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                        char.id === activeCharId
                          ? isDarkMode
                            ? "bg-rose-950/50 text-rose-300 border border-rose-800/50"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                          : isDarkMode
                          ? "hover:bg-stone-800"
                          : "hover:bg-stone-100"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border overflow-hidden shrink-0">
                        {isImageUrl(char.avatar) ? (
                          <img
                            src={formatImageUrl(char.avatar)}
                            alt={char.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-sm">
                            {char.avatar}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-serif font-bold truncate">{char.name}</div>
                        <div className="text-[10px] opacity-60 truncate">{char.plot || "Hồ sơ"}</div>
                      </div>
                      {char.id === activeCharId && <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-5 gap-1.5 w-full sm:flex sm:items-center sm:gap-2 sm:w-auto shrink-0">
          {/* Poke Character Button */}
          <button
            type="button"
            onClick={handlePokeCharacter}
            disabled={isTyping}
            className={`h-9 sm:h-auto p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 w-full sm:w-auto ${
              isDarkMode
                ? "bg-rose-950/80 border-rose-800 text-rose-300 hover:bg-rose-900"
                : "bg-rose-100 border-rose-300 text-rose-800 hover:bg-rose-200"
            }`}
            title="Nựng nhẹ má phúng phính đáng yêu 👋"
          >
            <Hand className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Nựng má 👋</span>
          </button>

          {/* Heart Character Button */}
          <button
            type="button"
            onClick={handleHeartCharacter}
            className={`h-9 sm:h-auto p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 w-full sm:w-auto ${
              isDarkMode
                ? "bg-pink-950/70 border-pink-800 text-pink-300 hover:bg-pink-900"
                : "bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200"
            }`}
            title="Bắn tim yêu thương dạt dào ❤️"
          >
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-bounce shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Bắn tim ❤️</span>
          </button>

          {/* Storyline Button */}
          <button
            type="button"
            onClick={() => {
              setShowStorylineBanner((prev) => !prev);
              playMeowSound();
            }}
            className={`h-9 sm:h-auto p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 w-full sm:w-auto ${
              showStorylineBanner
                ? isDarkMode
                  ? "bg-rose-950/70 border-rose-800 text-rose-300"
                  : "bg-rose-100 border-rose-300 text-rose-800"
                : isDarkMode
                ? "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700"
                : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
            }`}
            title="Xem bối cảnh và nhật ký bí mật"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Nhật ký 📖</span>
          </button>

          {/* Money Transfer Button */}
          <button
            type="button"
            onClick={() => {
              setShowMoneyModal(true);
              playMeowSound();
            }}
            className={`h-9 sm:h-auto p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 w-full sm:w-auto ${
              isDarkMode
                ? "bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900"
                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            }`}
            title="Gửi tặng món quà ngọt ngào nhất 🍬"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-500 animate-bounce shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Tặng quà 🍬</span>
          </button>

          {/* Reset History Button */}
          <button
            type="button"
            onClick={handleResetHistory}
            className={`h-9 sm:h-auto p-1.5 sm:p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer w-full sm:w-auto ${
              isDarkMode
                ? "bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-750"
                : "bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-150"
            }`}
            title="Trở về điểm bắt đầu định mệnh 🍃"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div
        className={`flex-1 rounded-2xl border p-4 overflow-y-auto space-y-4 shadow-inner relative transition-colors ${
          isDarkMode
            ? "bg-stone-950/60 border-stone-800/80"
            : "bg-[#fffdfb]/80 border-[#eadbca]/60"
        }`}
      >
        {/* Live Character Interactive Status Pill */}
        <div className="sticky top-0 z-20 flex justify-center my-1 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium shadow-md border backdrop-blur-md flex items-center gap-1.5 ${
              isDarkMode
                ? "bg-stone-900/90 border-rose-900/50 text-rose-300"
                : "bg-white/90 border-rose-200 text-rose-600"
            }`}
          >
            <Sparkles className="w-3 h-3 text-rose-500 animate-spin" />
            <span>{charLiveStatus}</span>
          </motion.div>
        </div>
        {/* Pinned Character Storyline Card */}
        <AnimatePresence>
          {showStorylineBanner && activeChar && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className={`p-4 sm:p-5 rounded-2xl border shadow-sm relative transition-all mb-4 ${
                isDarkMode
                  ? "bg-stone-900/90 border-rose-900/50 text-stone-200 shadow-rose-950/20"
                  : "bg-gradient-to-br from-rose-50/90 via-rose-50/40 to-amber-50/30 border-rose-200 text-stone-800 shadow-rose-100/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-full border overflow-hidden shrink-0 shadow-xs">
                    {isImageUrl(activeChar.avatar) ? (
                      <img
                        src={formatImageUrl(activeChar.avatar)}
                        alt={activeChar.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-100 text-lg">
                        {activeChar.avatar}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base flex items-center gap-2">
                      <span>{activeChar.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                        {activeChar.role || "Hồ sơ nhân vật"}
                      </span>
                    </h3>
                    <p className="text-[11px] opacity-70 font-mono">Hồ sơ & Cốt truyện chi tiết</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStorylineBanner(false)}
                  className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer font-mono font-medium ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200"
                      : "bg-white/80 border-stone-200 text-stone-500 hover:text-stone-800"
                  }`}
                  title="Thu gọn cốt truyện"
                >
                  Thu gọn ✕
                </button>
              </div>

              {/* Tóm tắt cốt truyện (Plot) */}
              {activeChar.plot && (
                <div className="mb-3 text-xs sm:text-sm font-medium leading-relaxed italic bg-white/60 dark:bg-black/40 p-3 rounded-xl border border-rose-200/40 dark:border-rose-900/30">
                  <span className="font-bold text-rose-500 not-italic mr-1.5 font-serif">📌 Tóm tắt cốt truyện:</span>
                  <span className="font-serif">{activeChar.plot}</span>
                </div>
              )}

              {/* Cốt truyện chi tiết (Storyline) */}
              {activeChar.storyline && (
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap opacity-95 space-y-1.5 border-t pt-3 border-rose-200/30 dark:border-rose-900/30">
                  <div className="font-bold text-xs uppercase tracking-wider text-rose-500 font-mono flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cốt truyện chi tiết & Bối cảnh:</span>
                  </div>
                  <div className="relative">
                    <div 
                      onClick={() => setIsChatStoryExpanded(!isChatStoryExpanded)}
                      className={`font-sans leading-[1.8] tracking-wide text-xs sm:text-sm text-stone-700 dark:text-stone-300 overflow-y-auto scrollbar-none cursor-pointer transition-all duration-300 relative ${
                        isChatStoryExpanded ? "max-h-[300px]" : "max-h-[100px] overflow-hidden"
                      }`}
                    >
                      {activeChar.storyline.split('\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (trimmed === "") {
                          return <div key={idx} className="h-2" />;
                        }
                        return (
                          <p key={idx} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        );
                      })}
                      
                      {!isChatStoryExpanded && (
                        <div className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t pointer-events-none ${
                          isDarkMode ? "from-stone-900/90 to-transparent" : "from-rose-50/90 to-transparent"
                        }`} />
                      )}
                    </div>
                    
                    <button
                      onClick={() => setIsChatStoryExpanded(!isChatStoryExpanded)}
                      className="mt-1.5 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isChatStoryExpanded ? (
                        <>
                          <span>Thu gọn cốt truyện</span>
                          <span>▲</span>
                        </>
                      ) : (
                        <>
                          <span>Xem toàn bộ cốt truyện</span>
                          <span>▼</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeChar.link && (
                <div className="mt-3 pt-2.5 border-t border-rose-200/30 dark:border-rose-900/30 flex items-center justify-between text-xs">
                  <a
                    href={activeChar.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-500 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>🔗 Nhấp để tới yêu thương bé</span>
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 0 && !showStorylineBanner && (
          <div className="text-center py-10 text-stone-400 dark:text-stone-500 font-sans text-xs">
            <MessageCircle className="w-7 h-7 mx-auto mb-2 opacity-50 text-rose-400" />
            <p>Bắt đầu trò chuyện hoặc gửi nhãn dán cho {activeChar.name} ngay nhé! 💕</p>
          </div>
        )}

        {messages.map((msg) => {
          const isHovered = hoveredMsgId === msg.id;
          const reactionEntries = Object.entries(msg.reactions || {});

          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMsgId(msg.id)}
              onMouseLeave={() => setHoveredMsgId(null)}
              className={`flex flex-col relative group ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Floating Quick Reactions & Reply Toolbar */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 5 }}
                    className={`absolute -top-9 z-20 flex items-center gap-1 p-1 rounded-2xl border shadow-lg backdrop-blur-md ${
                      msg.sender === "user" ? "right-0" : "left-8"
                    } ${
                      isDarkMode
                        ? "bg-stone-900/95 border-stone-700 text-stone-200"
                        : "bg-white/95 border-rose-200 text-stone-800"
                    }`}
                  >
                    {["❤️", "🥰", "😂", "😮", "🥺", "🐱", "💸"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className="p-1 hover:scale-130 active:scale-95 transition-transform text-sm cursor-pointer"
                        title={`Thả ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="w-[1px] h-4 bg-stone-300 dark:bg-stone-700 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(msg);
                        playMeowSound();
                      }}
                      className="p-1 px-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl text-rose-500 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Trả lời tin nhắn này"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Trả lời</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                {msg.sender === "character" && (
                  <div className="w-7 h-7 rounded-full border overflow-hidden shrink-0 mb-1 shadow-xs">
                    {isImageUrl(activeChar.avatar) ? (
                      <img
                        src={formatImageUrl(activeChar.avatar)}
                        alt={activeChar.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-100 text-xs">
                        {activeChar.avatar}
                      </div>
                    )}
                  </div>
                )}

                {msg.isMoneyTransfer ? (
                  /* Money Transfer Rich Message Bubble */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`p-4 rounded-2xl border shadow-md w-64 sm:w-72 bg-gradient-to-br ${
                      isDarkMode
                        ? "from-amber-950/90 via-amber-900/80 to-yellow-950/90 border-amber-700/60 text-amber-100 shadow-amber-950/30"
                        : "from-amber-100 via-amber-50 to-yellow-100 border-amber-300 text-amber-900 shadow-amber-100/50"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-2 border-amber-400/20">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <DollarSign className="w-4 h-4 text-amber-500 animate-spin" />
                        <span>CHUYỂN TIỀN NHẮN TIN</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-bold">
                        Thành công 🎉
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight my-1 text-center text-amber-600 dark:text-amber-300">
                      +{msg.moneyAmount?.toLocaleString("vi-VN")} VNĐ
                    </div>

                    {msg.moneyNote && (
                      <p className="text-xs italic text-center opacity-90 mt-1 font-serif bg-white/40 dark:bg-black/20 p-2 rounded-xl">
                        "{msg.moneyNote}"
                      </p>
                    )}

                    {msg.stickerUrl && (
                      <div
                        onClick={() => setZoomedSticker({ url: msg.stickerUrl!, alt: msg.stickerAlt })}
                        className="mt-3 flex justify-center cursor-pointer group"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4, rotate: -6 }}
                          animate={{ opacity: 1, scale: [0.4, 1.15, 1], rotate: [-6, 3, 0] }}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                          className="relative overflow-hidden rounded-xl border border-amber-300/40 shadow-xs max-w-[140px]"
                        >
                          <img
                            src={msg.stickerUrl}
                            alt={msg.stickerAlt || "Sticker"}
                            className="w-full h-28 object-contain bg-white/30 dark:bg-black/20"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    <div className="mt-2 text-[9px] text-right opacity-60 font-mono">
                      {msg.timestamp}
                    </div>
                  </motion.div>
                ) : (
                  /* Standard Message Bubble with Optional Sticker & Quoted Message */
                  <div className="flex flex-col gap-1.5">
                    {/* Quoted Parent Message Preview */}
                    {msg.replyTo && (
                      <div
                        className={`text-[10px] p-2 rounded-xl border border-dashed flex items-center gap-1.5 opacity-90 max-w-full ${
                          msg.sender === "user"
                            ? "bg-rose-100/70 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 self-end"
                            : "bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 self-start"
                        }`}
                      >
                        <CornerUpLeft className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="font-bold shrink-0">
                          {msg.replyTo.sender === "user" ? "Bạn" : activeChar.name}:
                        </span>
                        <p className="truncate italic font-serif opacity-80">
                          "{msg.replyTo.text}"
                        </p>
                      </div>
                    )}

                    {/* Sticker Display */}
                    {msg.stickerUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.3, rotate: -8, y: 15 }}
                        animate={{
                          opacity: 1,
                          scale: [0.3, 1.2, 0.92, 1.05, 1],
                          rotate: [-8, 7, -5, 2, 0],
                          y: 0,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        whileTap={{ scale: 0.93 }}
                        className={`relative cursor-pointer group rounded-2xl overflow-hidden p-1.5 border max-w-[160px] sm:max-w-[180px] shadow-md transition-shadow hover:shadow-lg ${
                          msg.sender === "user"
                            ? "self-end bg-rose-50/90 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800"
                            : "self-start bg-white border-stone-200 dark:bg-stone-900 dark:border-stone-800"
                        }`}
                        onClick={() => setZoomedSticker({ url: msg.stickerUrl!, alt: msg.stickerAlt })}
                      >
                        <motion.img
                          src={msg.stickerUrl}
                          alt={msg.stickerAlt || "Sticker"}
                          className="w-full h-32 sm:h-36 object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono font-bold rounded-2xl backdrop-blur-[1px]">
                          <ZoomIn className="w-4 h-4 mr-1" /> Phóng to 🔍
                        </div>
                      </motion.div>
                    )}

                    {/* Text Bubble (if text exists) */}
                    {msg.text && (
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs font-sans ${
                          msg.sender === "user"
                            ? isDarkMode
                              ? "bg-rose-900/80 text-rose-100 rounded-br-none border border-rose-800"
                              : "bg-rose-100 text-stone-900 border border-rose-200 rounded-br-none"
                            : isDarkMode
                            ? "bg-stone-900 text-stone-200 rounded-bl-none border border-stone-800"
                            : "bg-white text-stone-800 rounded-bl-none border border-[#eadbca]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`text-[9px] mt-1 font-mono text-right ${
                            msg.sender === "user"
                              ? "opacity-70"
                              : isDarkMode
                              ? "text-stone-500"
                              : "text-stone-400"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Reactions Pills */}
              {reactionEntries.length > 0 && (
                <div
                  className={`flex flex-wrap gap-1 mt-1 z-10 ${
                    msg.sender === "user" ? "justify-end pr-1" : "justify-start pl-9"
                  }`}
                >
                  {reactionEntries.map(([emoji, rawSenders]) => {
                    const senders = (rawSenders || []) as ("user" | "character")[];
                    return (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 shadow-2xs cursor-pointer ${
                          senders.includes("user")
                            ? "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/60 dark:border-rose-700 dark:text-rose-200"
                            : "bg-stone-100 border-stone-200 text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{senders.length}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border overflow-hidden shrink-0">
              {isImageUrl(activeChar.avatar) ? (
                <img
                  src={formatImageUrl(activeChar.avatar)}
                  alt={activeChar.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-100 text-xs">
                  {activeChar.avatar}
                </div>
              )}
            </div>
            <div
              className={`px-4 py-2.5 rounded-2xl border text-xs flex items-center gap-1.5 ${
                isDarkMode ? "bg-stone-900 border-stone-800 text-stone-400" : "bg-white border-[#eadbca] text-stone-500"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              <span>{activeChar.name} đang gõ trả lời...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticker Picker Drawer */}
      <AnimatePresence>
        {showStickerPicker && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            className={`mt-2 p-3 sm:p-4 rounded-2xl border shadow-xl z-30 transition-colors ${
              isDarkMode
                ? "bg-stone-900 border-stone-800 text-stone-100"
                : "bg-white border-[#eadbca] text-stone-800"
            }`}
          >
            {/* Header & Category Filters */}
            <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-200/10">
              <div>
                <div className="flex items-center gap-1.5 font-serif font-bold text-xs sm:text-sm text-rose-500">
                  <Smile className="w-4 h-4" />
                  <span>Kho Nhãn Dán Biểu Cảm Cực Cute 💕</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Chọn nhãn dán để gửi cùng tin nhắn hoặc gửi riêng nhé!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStickerPicker(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stickers Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-52 overflow-y-auto p-1">
              {filteredStickers.map((stk) => (
                <motion.button
                  key={stk.id}
                  type="button"
                  whileHover={{ scale: 1.15, rotate: 2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleSelectSticker(stk)}
                  className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center justify-center aspect-square ${
                    isDarkMode
                      ? "bg-stone-800/80 border-stone-700 hover:border-rose-500/50 hover:bg-rose-950/40"
                      : "bg-stone-50 border-stone-200 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <img
                    src={stk.url}
                    alt="Sticker"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Sticker Attachment Preview */}
      <AnimatePresence>
        {selectedSticker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={`mt-2 p-2 sm:p-2.5 rounded-2xl border flex items-center justify-between shadow-xs transition-colors ${
              isDarkMode
                ? "bg-rose-950/80 border-rose-800 text-rose-200"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={selectedSticker.url}
                alt={selectedSticker.name}
                className="w-10 h-10 object-contain rounded-xl bg-white/40 dark:bg-black/20 p-1 border border-rose-300/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs truncate font-sans">
                <p className="font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3" /> Đã chọn nhãn dán:
                </p>
                <p className="italic opacity-80 truncate text-[11px]">
                  "{selectedSticker.name}" (sẽ gửi kèm với tin nhắn)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSticker(null)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer shrink-0"
              title="Bỏ chọn nhãn dán"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quoted Message Active Banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={`mt-2 p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between shadow-xs transition-colors ${
              isDarkMode
                ? "bg-rose-950/80 border-rose-800 text-rose-200"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <CornerUpLeft className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="text-xs truncate font-sans">
                <span className="font-bold mr-1">
                  Đang trả lời {replyingTo.sender === "user" ? "chính bạn" : activeChar.name}:
                </span>
                <span className="italic opacity-80 font-serif">
                  "{replyingTo.text || replyingTo.moneyNote || "Nhãn dán biểu cảm"}"
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer shrink-0"
              title="Hủy trả lời"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`mt-3 p-2.5 sm:p-3 rounded-2xl border flex items-center gap-2 shadow-sm transition-colors ${
          isDarkMode
            ? "bg-stone-900 border-stone-800"
            : "bg-white border-[#eadbca]"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setShowStickerPicker((prev) => !prev);
            playMeowSound();
          }}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
            showStickerPicker || selectedSticker
              ? isDarkMode
                ? "bg-rose-950 border-rose-800 text-rose-300"
                : "bg-rose-100 border-rose-300 text-rose-700"
              : isDarkMode
              ? "bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200"
              : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200"
          }`}
          title="Chọn nhãn dán biểu cảm siêu đáng yêu 🐱🌸"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowMoneyModal(true);
            playMeowSound();
          }}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
            isDarkMode
              ? "bg-amber-950/50 border-amber-800 text-amber-400 hover:bg-amber-900"
              : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
          }`}
          title="Tặng quà ngọt ngào cho bé cưng 🍬💖"
        >
          <DollarSign className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Thì thầm lời ngọt ngào với ${activeChar.name} ở đây nha... 💕🌸`}
          className={`flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none ${
            isDarkMode ? "text-stone-100 placeholder-stone-500" : "text-stone-800 placeholder-stone-400"
          }`}
        />

        <button
          type="submit"
          disabled={(!inputText.trim() && !selectedSticker) || isTyping}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
            (inputText.trim() || selectedSticker) && !isTyping
              ? isDarkMode
                ? "bg-rose-950 border-rose-800 text-rose-300 hover:bg-rose-900"
                : "bg-rose-100 border-rose-200 text-stone-900 hover:bg-rose-200"
              : "opacity-40 cursor-not-allowed border-transparent"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Money Transfer Modal */}
      <AnimatePresence>
        {showMoneyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoneyModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative z-10 w-full max-w-md p-6 rounded-3xl border shadow-2xl flex flex-col gap-4 ${
                isDarkMode
                  ? "bg-stone-900 border-stone-800 text-stone-100"
                  : "bg-white border-[#eadbca] text-stone-800"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-stone-200/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    💝
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm">Gửi Quà Ngọt Ngào Cho {activeChar.name}</h3>
                    <p className={`text-[11px] ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                      Món quà siêu đáng yêu của bạn sẽ được trao tận tay bé cưng tức thì nha~ 💖
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMoneyModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Preset Amounts Grid */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 mb-2 block">
                  Chọn gói quà yêu thương:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_MONEY_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setCustomAmount(preset.value);
                        playMeowSound();
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        customAmount === preset.value
                          ? isDarkMode
                            ? "bg-amber-950/80 border-amber-600 text-amber-300 shadow-md scale-105"
                            : "bg-amber-100 border-amber-300 text-amber-900 shadow-md scale-105"
                          : isDarkMode
                          ? "bg-stone-800/60 border-stone-700 hover:bg-stone-800 text-stone-300"
                          : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[9px] opacity-60 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-1 block">
                  Nhập số tiền mua quà tùy thích (VNĐ):
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono focus:outline-none ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-700 text-amber-300 focus:border-amber-500"
                      : "bg-stone-50 border-stone-200 text-amber-700 focus:border-amber-400"
                  }`}
                />
              </div>

              {/* Money Note / Message */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-1 block">
                  Lời nhắn đính kèm ngọt ngào: 💌
                </label>
                <input
                  type="text"
                  value={moneyNote}
                  onChange={(e) => setMoneyNote(e.target.value)}
                  placeholder="Thì thầm lời nhắn nhủ dịu dàng nhất ở đây... 💕"
                  className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-rose-500"
                      : "bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400 focus:border-rose-300"
                  }`}
                />
              </div>

              {/* Submit Transfer Button */}
              <button
                type="button"
                onClick={handleSendMoneyTransfer}
                disabled={customAmount <= 0}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                  customAmount > 0
                    ? isDarkMode
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 hover:from-amber-500 hover:to-amber-400"
                      : "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-900 hover:from-amber-600 hover:to-amber-500"
                    : "opacity-40 cursor-not-allowed bg-stone-300 text-stone-500"
                }`}
              >
                <DollarSign className="w-4 h-4 animate-bounce" />
                <span>Gửi Gắm Yêu Thương {customAmount.toLocaleString("vi-VN")} VNĐ 🎉</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Zoomed Sticker Lightbox Modal */}
      <AnimatePresence>
        {zoomedSticker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedSticker(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-10 p-4 max-w-sm w-full bg-white dark:bg-stone-900 rounded-3xl border shadow-2xl flex flex-col items-center text-center"
            >
              <button
                onClick={() => setZoomedSticker(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:scale-110 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={zoomedSticker.url}
                alt={zoomedSticker.alt || "Sticker"}
                className="w-56 h-56 object-contain rounded-2xl my-2"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs font-serif font-bold text-stone-700 dark:text-stone-200 mt-2">
                {zoomedSticker.alt || "Nhãn dán biểu cảm cute"}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
