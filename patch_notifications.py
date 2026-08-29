import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports
content = content.replace('Share2 } from "lucide-react";', 'Share2, Bell } from "lucide-react";')

# 2. Update SocialPost interface
content = content.replace('likes: number;\n  comments: SocialComment[];', 'likes: number;\n  shares?: number;\n  comments: SocialComment[];')

# 3. Add Notification interface
if 'interface SocialNotification' not in content:
    notif_interface = '''interface SocialNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

'''
    content = content.replace('interface SocialComment', notif_interface + 'interface SocialComment')

# 4. Add states
states = '''  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const prevPostsRef = useRef<SocialPost[]>([]);'''

content = content.replace('''  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<User | null>(null);''', states)

# 5. Update useEffect
use_effect = '''  useEffect(() => {
    const unsub = onSnapshot(collection(db, "character_social_posts"), (snapshot) => {
      const loadedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SocialPost)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (prevPostsRef.current.length > 0 && user) {
        const newNotifications: SocialNotification[] = [];
        loadedPosts.forEach(post => {
          if (post.characterId === "user" && post.authorName === user.displayName) {
            const prevPost = prevPostsRef.current.find(p => p.id === post.id);
            if (prevPost) {
              if (post.likes > prevPost.likes) {
                newNotifications.push({ id: Date.now() + Math.random().toString(), message: `Ai đó đã thích bài viết của bạn: "${post.content.substring(0, 20)}..."`, timestamp: new Date().toISOString(), read: false });
              }
              if ((post.shares || 0) > (prevPost.shares || 0)) {
                newNotifications.push({ id: Date.now() + Math.random().toString(), message: `Ai đó đã chia sẻ bài viết của bạn: "${post.content.substring(0, 20)}..."`, timestamp: new Date().toISOString(), read: false });
              }
              if (post.comments.length > prevPost.comments.length) {
                newNotifications.push({ id: Date.now() + Math.random().toString(), message: `Ai đó đã bình luận về bài viết của bạn: "${post.content.substring(0, 20)}..."`, timestamp: new Date().toISOString(), read: false });
              }
            }
          }
        });
        
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
        }
      }
      
      prevPostsRef.current = loadedPosts;
      setPosts(loadedPosts);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);'''

content = re.sub(r'  useEffect\(\(\) => \{\n    const unsub = onSnapshot\(collection\(db, "character_social_posts"\).*?\}, \[\]\);', use_effect, content, flags=re.DOTALL)

# 6. Update handleShare
handle_share = '''  const handleShare = async (postId: string, currentShares: number) => {
    playMeowSound();
    const url = window.location.origin + window.location.pathname;
    
    try {
      await updateDoc(doc(db, "character_social_posts", postId), {
        shares: (currentShares || 0) + 1
      });
    } catch (e) {
      console.error("Error sharing post: ", e);
    }

    if (navigator.share) {
      navigator.share({
        title: 'Mạng xã hội Meo Meo',
        text: 'Xem bài viết này trên mạng xã hội các nhân vật!',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã sao chép đường dẫn!");
    }
  };'''

content = re.sub(r'  const handleShare = \(postId: string\) => \{.*?  \};', handle_share, content, flags=re.DOTALL)

# 7. Add Bell icon in header
header_btn = '''        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  setNotifications(prev => prev.map(n => ({...n, read: true})));
                }
              }}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-stone-800 text-stone-300" : "hover:bg-stone-100 text-stone-600"}`}
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-xl overflow-hidden z-50 ${isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"}`}
                >
                  <div className={`p-3 border-b font-bold text-sm ${isDarkMode ? "border-stone-800 text-stone-200" : "border-stone-100 text-stone-800"}`}>
                    Thông báo
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-500">Chưa có thông báo nào</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 border-b last:border-b-0 text-xs flex flex-col gap-1 ${isDarkMode ? "border-stone-800/50 hover:bg-stone-800/50" : "border-stone-50 hover:bg-stone-50"} transition-colors`}>
                          <span className={isDarkMode ? "text-stone-300" : "text-stone-700"}>{notif.message}</span>
                          <span className="text-[10px] text-stone-500">{new Date(notif.timestamp).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => {
              playMeowSound();
              setIsPosting(!isPosting);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md transition-all active:scale-95"
          >
            {isPosting ? "Hủy" : "+ Đăng bài"}
          </button>
        </div>'''

content = re.sub(r'        <button\n          onClick=\{\(\) => \{\n            playMeowSound\(\);\n            setIsPosting\(!isPosting\);\n          \}\}.*?</button>', header_btn, content, flags=re.DOTALL)

# 8. Update onClick handleShare
content = content.replace('onClick={() => handleShare(post.id)}', 'onClick={() => handleShare(post.id, post.shares || 0)}')

# Write
with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

