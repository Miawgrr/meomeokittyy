import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''  const handleSimulatePost = async () => {
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
      simulateInteractions(newPost.id);
    } catch (e) {
      console.error("Error simulating post: ", e);
    }
  };

  const simulateInteractions'''

content = content.replace('''  const handleSimulatePost = async () => {
    if (characters.length === 0) return;
    playMeowSound();
    
    // Pick random character
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    // Pick random content
    const randomContent = SAMPLE_POSTS[Math.floor(Math.random() * SAMPLE_POSTS.length)];
    
  const simulateInteractions''', replacement)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

