import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !newPostImage) return;
    playMeowSound();
    
    const newPost: any = {
      id: "post_" + Date.now(),
      characterId: selectedCharacterId,
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    if (selectedCharacterId === "user") {
      newPost.authorName = user?.displayName || "Người dùng ẩn danh";
      newPost.authorAvatar = user?.photoURL || "";
    }

    if (newPostImage) {
      newPost.image = newPostImage;
    }

    if (quotedPostData) {
      newPost.quotedPost = {
        id: quotedPostData.id,
        characterId: quotedPostData.characterId,
        content: quotedPostData.content
      };
      if (quotedPostData.authorName) newPost.quotedPost.authorName = quotedPostData.authorName;
      if (quotedPostData.authorAvatar) newPost.quotedPost.authorAvatar = quotedPostData.authorAvatar;
    }

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
  };'''

content = re.sub(r'  const handleCreatePost = async \(\) => \{.*?    \} catch \(e\) \{\n      console\.error\("Error adding post: ", e\);\n    \}\n  \};\n', replacement + '\n', content, flags=re.DOTALL)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

