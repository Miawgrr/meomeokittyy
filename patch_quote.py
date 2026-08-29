import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports
content = content.replace('Share2, Bell, Zap, RefreshCw } from "lucide-react";', 'Share2, Bell, Zap, RefreshCw, Quote } from "lucide-react";')

# 2. Update SocialPost interface
quoted_post_interface = '''interface QuotedPostData {
  id: string;
  characterId: string;
  authorName?: string;
  authorAvatar?: string;
  content: string;
}

interface SocialPost {'''

content = content.replace('interface SocialPost {', quoted_post_interface)
content = content.replace('  comments: SocialComment[];\n}', '  comments: SocialComment[];\n  quotedPost?: QuotedPostData;\n}')

# 3. Add quotedPost state
states = '''  const [commentText, setCommentText] = useState("");
  const [quotedPostData, setQuotedPostData] = useState<SocialPost | null>(null);
  const [user, setUser] = useState<User | null>(null);'''
content = content.replace('''  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<User | null>(null);''', states)

# 4. Update handleCreatePost
handle_create_post_replacement = '''    const newPost: SocialPost = {
      id: "post_" + Date.now(),
      characterId: selectedCharacterId,
      authorName: selectedCharacterId === "user" ? (user?.displayName || "Người dùng ẩn danh") : undefined,
      authorAvatar: selectedCharacterId === "user" ? (user?.photoURL || "") : undefined,
      content: newPostContent.trim(),
      image: newPostImage,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      quotedPost: quotedPostData ? {
        id: quotedPostData.id,
        characterId: quotedPostData.characterId,
        authorName: quotedPostData.authorName,
        authorAvatar: quotedPostData.authorAvatar,
        content: quotedPostData.content
      } : undefined
    };

    setIsPosting(false);
    setNewPostContent("");
    setNewPostImage("");
    setQuotedPostData(null);'''

content = re.sub(r'    const newPost: SocialPost = \{.*?    setNewPostImage\(""\);', handle_create_post_replacement, content, flags=re.DOTALL)

# 5. Handle Quote Action
handle_quote = '''  const handleQuote = (post: SocialPost) => {
    setQuotedPostData(post);
    setIsPosting(true);
    // Scroll to top or composer (basic approach)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare ='''
content = content.replace('  const handleShare =', handle_quote)

# 6. Composer UI update
composer_ui = '''              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className={`w-full p-4 rounded-xl border resize-none h-32 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                  isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                }`}
              />
              
              {quotedPostData && (
                <div className={`mt-2 p-3 rounded-xl border flex flex-col gap-2 ${isDarkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>Đang trích dẫn:</span>
                    <button onClick={() => setQuotedPostData(null)} className="text-stone-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className={`text-sm italic border-l-2 pl-2 ${isDarkMode ? "border-stone-700 text-stone-400" : "border-stone-300 text-stone-500"}`}>
                    {quotedPostData.content.substring(0, 100)}{quotedPostData.content.length > 100 ? '...' : ''}
                  </div>
                </div>
              )}'''

content = content.replace('''              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className={`w-full p-4 rounded-xl border resize-none h-32 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                  isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                }`}
              />''', composer_ui)

# 7. Render Post Content + Quoted
post_content = '''                {/* Post Content */}
                {post.content && (
                  <p className={`text-sm whitespace-pre-wrap ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                    {post.content}
                  </p>
                )}

                {/* Quoted Post */}
                {post.quotedPost && (
                  <div className={`p-3 rounded-xl border mt-1 ${isDarkMode ? "bg-stone-950/50 border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Quote className="w-3.5 h-3.5 text-stone-400" />
                      <span className={`text-xs font-bold ${isDarkMode ? "text-stone-300" : "text-stone-600"}`}>
                        {post.quotedPost.characterId === "user" ? (post.quotedPost.authorName || "Người dùng") : (getCharacter(post.quotedPost.characterId)?.name || "Ẩn danh")}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                      {post.quotedPost.content}
                    </p>
                  </div>
                )}'''

content = content.replace('''                {/* Post Content */}
                {post.content && (
                  <p className={`text-sm whitespace-pre-wrap ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                    {post.content}
                  </p>
                )}''', post_content)

# 8. Add Quote Action button
actions = '''                  <button 
                    onClick={() => handleShare(post.id, post.shares || 0)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-blue-500 dark:text-stone-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ</span>
                  </button>
                  <button 
                    onClick={() => handleQuote(post)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-purple-500 dark:text-stone-400 dark:hover:text-purple-400 transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                    <span>Trích dẫn</span>
                  </button>'''

content = content.replace('''                  <button 
                    onClick={() => handleShare(post.id, post.shares || 0)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-blue-500 dark:text-stone-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ</span>
                  </button>''', actions)

# Also fix cancel posting button clearing quotedPost
content = content.replace('''                onClick={() => {
                  setIsPosting(false);
                  setNewPostContent("");
                  setNewPostImage("");
                }}''', '''                onClick={() => {
                  setIsPosting(false);
                  setNewPostContent("");
                  setNewPostImage("");
                  setQuotedPostData(null);
                }}''')
                
content = content.replace('''          <button
            onClick={() => {
              playMeowSound();
              setIsPosting(!isPosting);
            }}''', '''          <button
            onClick={() => {
              playMeowSound();
              if (isPosting) setQuotedPostData(null);
              setIsPosting(!isPosting);
            }}''')

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

