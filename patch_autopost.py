import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports to include Zap
content = content.replace('Share2, Bell } from "lucide-react";', 'Share2, Bell, Zap } from "lucide-react";')

# 2. Add sample text for auto post
if 'const SAMPLE_POSTS' not in content:
    sample_posts = '''
const SAMPLE_POSTS = [
  "Hôm nay trời đẹp quá, đi chơi không mọi người? ✨",
  "Vừa ăn xong một món siêu ngon! 🍜",
  "Đang tìm nhạc mới để nghe, có ai gợi ý gì không? 🎧",
  "Nhớ mọi người quá nè... 🥺",
  "Lại một ngày bận rộn nữa bắt đầu! 💪",
  "Meo meo meo meo meo~ 🐾",
  "Có ai đang thức không ta? 👀",
  "Cuộc sống là những niềm vui nhỏ bé 🌸"
];
'''
    content = content.replace('export default function CharacterSocialNetwork', sample_posts + '\nexport default function CharacterSocialNetwork')

# 3. Add auto-post function
handle_auto_post = '''  const handleSimulatePost = async () => {
    if (characters.length === 0) return;
    playMeowSound();
    
    // Pick random character
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    // Pick random content
    const randomContent = SAMPLE_POSTS[Math.floor(Math.random() * SAMPLE_POSTS.length)];
    
    const newPost: SocialPost = {
      id: "post_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      characterId: randomChar.id,
      content: randomContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
    } catch (e) {
      console.error("Error simulating post: ", e);
    }
  };
'''
content = content.replace('  const handleCreatePost = async () => {', handle_auto_post + '\n  const handleCreatePost = async () => {')

# 4. Add the button to the header
header_btn = '''        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePost}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-stone-800 text-amber-400" : "hover:bg-amber-50 text-amber-500"}`}
            title="Nhân vật tự động đăng bài"
          >
            <Zap className="w-5 h-5" />
          </button>
          
          <div className="relative">'''
content = content.replace('''        <div className="flex items-center gap-2">
          <div className="relative">''', header_btn)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

