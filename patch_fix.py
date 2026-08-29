import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add handleCreatePost, simulateInteractions, and handleReset.
# Actually let me just insert them before handleLike
functions = '''  const simulateInteractions = (postId: string) => {
    if (characters.length === 0) return;
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

    setTimeout(async () => {
      try {
        const postRef = doc(db, "character_social_posts", postId);
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const comments = [
          "Hay quá!", "Tuyệt vời! 😍", "Thật không thể tin được!", "Haha, chuẩn luôn!", 
          "Cho mình ké với!", "Meo meo~", "Hmm, thú vị đấy.", "Thả tim ❤️", 
          "Đồng ý hai tay hai chân!", "Quá là sến súa luôn á 😂"
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

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !newPostImage) return;
    playMeowSound();
    
    const newPost: SocialPost = {
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
    setQuotedPostData(null);

    try {
      await setDoc(doc(db, "character_social_posts", newPost.id), newPost);
      simulateInteractions(newPost.id);
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  };
'''

content = re.sub(r'    const newPost: SocialPost = \{.*?    \} catch \(e\) \{\n      console\.error\("Error adding post: ", e\);\n    \}\n  \};\n', functions, content, flags=re.DOTALL)
with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
