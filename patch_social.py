import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
import_auth = 'import { auth } from "../lib/firebase";\nimport { User } from "firebase/auth";\n'
content = content.replace('import { db } from "../lib/firebase";', 'import { db, auth } from "../lib/firebase";\nimport { User } from "firebase/auth";')

# 2. Add user state
state_block = '''  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);'''
content = content.replace('  const [commentText, setCommentText] = useState("");', state_block)

# 3. Update character selection in composer
select_block = '''                <select
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                  className={`flex-1 p-2 rounded-lg text-sm font-semibold outline-none ${
                    isDarkMode ? "bg-stone-900 border-stone-700 text-stone-200" : "bg-white border-stone-200 text-stone-700"
                  } border`}
                >
                  <option value="user">Đăng dưới tên: {user ? user.displayName || "Bạn" : "Người dùng (Chưa đăng nhập)"}</option>
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>Đăng dưới tên: {c.name}</option>
                  ))}
                </select>'''
content = re.sub(r'<select.*?<\/select>', select_block, content, flags=re.DOTALL)

# 4. Make selectedCharacterId default to "user"
content = content.replace('const [selectedCharacterId, setSelectedCharacterId] = useState<string>(characters[0]?.id || "");', 'const [selectedCharacterId, setSelectedCharacterId] = useState<string>("user");')

# 5. Handle post author logic
# We need to change the post object structure to support user author
# Let's add `authorName`, `authorAvatar` to `SocialPost` if `characterId` is "user"

interface_replacement = '''interface SocialPost {
  id: string;
  characterId: string;
  authorName?: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: SocialComment[];
}'''
content = content.replace('interface SocialPost {\n  id: string;\n  characterId: string;\n  content: string;\n  image?: string;\n  timestamp: string;\n  likes: number;\n  comments: SocialComment[];\n}', interface_replacement)

# Post creation
handleCreatePost_replacement = '''    const newPost: SocialPost = {
      id: "post_" + Date.now(),
      characterId: selectedCharacterId,
      authorName: selectedCharacterId === "user" ? (user?.displayName || "Người dùng ẩn danh") : undefined,
      authorAvatar: selectedCharacterId === "user" ? (user?.photoURL || "") : undefined,
      content: newPostContent.trim(),
      image: newPostImage,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };'''
content = content.replace('''    const newPost: SocialPost = {
      id: "post_" + Date.now(),
      characterId: selectedCharacterId,
      content: newPostContent.trim(),
      image: newPostImage,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };''', handleCreatePost_replacement)

# Comment creation
handleAddComment_replacement = '''    const newComment: SocialComment = {
      id: "cmt_" + Date.now(),
      author: user ? (user.displayName || "Bạn") : "Người dùng ẩn danh",
      content: commentText.trim(),
      timestamp: new Date().toISOString()
    };'''
content = content.replace('''    const newComment: SocialComment = {
      id: "cmt_" + Date.now(),
      author: "Người dùng ẩn danh",
      content: commentText.trim(),
      timestamp: new Date().toISOString()
    };''', handleAddComment_replacement)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

