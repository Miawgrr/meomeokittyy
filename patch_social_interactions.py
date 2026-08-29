import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports
content = content.replace('Share2, Bell, Zap } from "lucide-react";', 'Share2, Bell, Zap, RefreshCw } from "lucide-react";')

# 2. Update firestore imports
content = content.replace('import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";', 'import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, arrayUnion, getDocs, getDoc } from "firebase/firestore";')

# 3. Add simulateInteractions and handleReset
functions = '''  const simulateInteractions = (postId: string) => {
    if (characters.length === 0) return;
    
    // Simulate likes and shares
    setTimeout(async () => {
      try {
        const postRef = doc(db, "character_social_posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          const likesToAdd = Math.floor(Math.random() * 15) + 1;
          const sharesToAdd = Math.floor(Math.random() * 5);
          
          await updateDoc(postRef, {
            likes: (data.likes || 0) + likesToAdd,
            shares: (data.shares || 0) + sharesToAdd
          });
        }
      } catch (e) {
        console.error("Error simulating likes: ", e);
      }
    }, 2000 + Math.random() * 3000);

    // Simulate a comment
    setTimeout(async () => {
      try {
        const postRef = doc(db, "character_social_posts", postId);
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const comments = [
          "Hay quá!",
          "Tuyệt vời! 😍",
          "Thật không thể tin được!",
          "Haha, chuẩn luôn!",
          "Cho mình ké với!",
          "Meo meo~",
          "Hmm, thú vị đấy.",
          "Thả tim ❤️",
          "Đồng ý hai tay hai chân!",
          "Quá là sến súa luôn á 😂"
        ];
        const randomCommentText = comments[Math.floor(Math.random() * comments.length)];
        
        const newComment: SocialComment = {
          id: "cmt_" + Date.now(),
          author: randomChar.name,
          content: randomCommentText,
          timestamp: new Date().toISOString()
        };

        await updateDoc(postRef, {
          comments: arrayUnion(newComment)
        });
      } catch (e) {
        console.error("Error simulating comment: ", e);
      }
    }, 4000 + Math.random() * 4000);
  };

  const handleReset = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa TẤT CẢ bài viết?")) {
      playMeowSound();
      try {
        const snapshot = await getDocs(collection(db, "character_social_posts"));
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
      } catch (e) {
        console.error("Error resetting posts: ", e);
      }
    }
  };
'''

content = content.replace('  const handleCreatePost = async () => {', functions + '\n  const handleCreatePost = async () => {')

# 4. Call simulateInteractions in handleCreatePost
content = content.replace('''    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
    } catch (e) {
      console.error("Error adding post: ", e);
    }''', '''    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
      simulateInteractions(newPost.id);
    } catch (e) {
      console.error("Error adding post: ", e);
    }''')

# 5. Call simulateInteractions in handleSimulatePost
content = content.replace('''    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
    } catch (e) {
      console.error("Error simulating post: ", e);
    }''', '''    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
      simulateInteractions(newPost.id);
    } catch (e) {
      console.error("Error simulating post: ", e);
    }''')

# 6. Add Reset button in the header
header_btn = '''        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-red-900/30 text-red-400" : "hover:bg-red-50 text-red-500"}`}
            title="Xóa tất cả bài viết"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button'''

content = content.replace('''        <div className="flex items-center gap-2">
          <button''', header_btn, 1) # Only replace the first occurrence which is in the header

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

