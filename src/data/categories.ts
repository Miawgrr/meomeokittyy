import { Character } from "../types";

export const CHARACTER_CATEGORIES = [
  "Tất cả",
  "Ngược Luyến 💔",
  "Ngọt Sủng / Healing 🌸",
  "Thanh Xuân Vườn Trường 🎒",
  "Cấm Kỵ / NTR 🔞",
  "Oan Gia / Hài Hước 🍭"
];

export const CHARACTER_CATEGORIZATION_MAP: Record<string, { category: string; tags: string[] }> = {
  "tuong-tu-mac": {
    category: "Ngược Luyến 💔",
    tags: ["Maybe Ngược?", "Ngọt", "Lụy Tình"]
  },
  "chu-thoi-duyet": {
    category: "Oan Gia / Hài Hước 🍭",
    tags: ["Mất Trí Nhớ", "Kẻ Thù", "Cấp Trên x Cấp Dưới", "Oan Gia", "Ngọt", "Hiện Đại"]
  },
  "Cố Hứa Niệm": {
    category: "Ngọt Sủng / Healing 🌸",
    tags: ["Cún Con", "Lụy Tình", "Ngọt", "Hiện Đại"]
  },
  "kaiza-tachibana": {
    category: "Oan Gia / Hài Hước 🍭",
    tags: ["Hài Hước", "Ngọt", "Hiện Đại"]
  },
  "kaven-nyx": {
    category: "Ngược Luyến 💔",
    tags: ["Cún con", "Lụy Tình", "Hồng Hài Nhi", "Hiện Đại"]
  },
  "tham-da": {
    category: "Cấm Kỵ / NTR 🔞",
    tags: ["Hồng Hài Nhi", "NTR"]
  },
  "ta-hoai-nien": {
    category: "Thanh Xuân Vườn Trường 🎒",
    tags: ["Lớp Trưởng", "Học Bá", "Thanh Xuân Vườn Trường", "Ngọt", "Hiện Đại"]
  },
  "hua-tri-le": {
    category: "Thanh Xuân Vườn Trường 🎒",
    tags: ["Thanh Xuân Vườn Trường", "Học Bá", "Ngọt", "Healing", "Hiện Đại"]
  },
  "hua-nguy-chau": {
    category: "Oan Gia / Hài Hước 🍭",
    tags: ["Oan Gia", "Kẻ Thù", "Phản Diện", "Slow-burn"]
  },
  "chu-hoai-an": {
    category: "Ngược Luyến 💔",
    tags: ["Maybe Ngược?", "Lụy Tình", "Hiện Đại"]
  },
  "duong-minh-hien": {
    category: "Thanh Xuân Vườn Trường 🎒",
    tags: ["Cún Con Bám Người", "Ngọt", "Game Thủ Lẫn Học Bá", "Hồng Hài Nhi", "Việt Nam"]
  },
  "nguyen-phuoc-an": {
    category: "Ngọt Sủng / Healing 🌸",
    tags: ["Việt Nam Xưa", "Ngọt", "Healing", "Cún Con Bám Người"]
  },
  "to-nhuoc-vu": {
    category: "Cấm Kỵ / NTR 🔞",
    tags: ["Hồng Hài Nhi", "Thao Túng"]
  }
};

export function enrichCharacter(char: Character): Character {
  if (!char) return char;
  
  // If the character is predefined in our map, force these tags and categories
  const mapping = CHARACTER_CATEGORIZATION_MAP[char.id];
  if (mapping) {
    return {
      ...char,
      category: mapping.category,
      tags: mapping.tags
    };
  }

  // Fallback for custom or unmapped characters
  let tags = char.tags || [];
  let category = char.category || "Ngọt Sủng / Healing 🌸";

  if (tags.length === 0) {
    if (char.plot) {
      // Parse tags from plot description (splitting by commas or semicolons)
      const delimiter = char.plot.includes(";") ? ";" : ",";
      tags = char.plot.split(delimiter).map(t => t.trim()).filter(Boolean);
    } else {
      tags = ["Tự Tạo", "Khám Phá"];
    }
  }

  // Guess category based on tags/plot text
  if (!char.category && char.plot) {
    const plotLower = char.plot.toLowerCase();
    if (plotLower.includes("ngược") || plotLower.includes("lụy") || plotLower.includes("mất")) {
      category = "Ngược Luyến 💔";
    } else if (plotLower.includes("phản diện") || plotLower.includes("thao túng")) {
      category = "Cấm Kỵ / NTR 🔞";
    } else if (plotLower.includes("học đường") || plotLower.includes("trường") || plotLower.includes("thanh xuân") || plotLower.includes("học bá") || plotLower.includes("hot boy")) {
      category = "Thanh Xuân Vườn Trường 🎒";
    } else if (plotLower.includes("ntr") || plotLower.includes("cấm kỵ") || plotLower.includes("ngoại tình")) {
      category = "Cấm Kỵ / NTR 🔞";
    } else if (plotLower.includes("oan gia") || plotLower.includes("hài") || plotLower.includes("trộm")) {
      category = "Oan Gia / Hài Hước 🍭";
    }
  }

  return {
    ...char,
    category,
    tags
  };
}
