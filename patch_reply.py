import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update interface SocialComment
content = content.replace('  timestamp: string;\n}', '  timestamp: string;\n  replies?: SocialComment[];\n}')

# 2. Add replyingTo state
states = '''  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{postId: string, commentId: string, author: string} | null>(null);'''
content = content.replace('  const [commentText, setCommentText] = useState("");', states)

# 3. Update handleAddComment
handle_add_comment = '''  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    playMeowSound();
    
    const newComment: SocialComment = {
      id: "cmt_" + Date.now(),
      author: user ? (user.displayName || "Bạn") : "Người dùng ẩn danh",
      content: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    setCommentText("");
    const currentReply = replyingTo;
    
    // If not replying to someone, close the comment box if you want, or just leave it.
    // For now, if it's a top level comment, we don't close. If it's a reply, we close the reply mode.
    if (currentReply && currentReply.postId === postId) {
      setReplyingTo(null);
    }

    try {
      if (currentReply && currentReply.postId === postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
          const updatedComments = post.comments.map(c => {
            if (c.id === currentReply.commentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment]
              };
            }
            return c;
          });
          await updateDoc(doc(db, "character_social_posts", postId), {
            comments: updatedComments
          });
        }
      } else {
        await updateDoc(doc(db, "character_social_posts", postId), {
          comments: arrayUnion(newComment)
        });
      }
    } catch (e) {
      console.error("Error adding comment: ", e);
    }
  };'''

content = re.sub(r'  const handleAddComment = async \(postId: string\) => \{.*?    \} catch \(e\) \{\n      console\.error\("Error adding comment: ", e\);\n    \}\n  \};\n', handle_add_comment + '\n', content, flags=re.DOTALL)

# 4. Update comment list UI
comment_list = '''                        post.comments.map(cmt => (
                          <div key={cmt.id} className="flex flex-col gap-0.5">
                            <span className={`text-xs font-bold ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                              {cmt.author}
                            </span>
                            <p className={`text-xs ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{cmt.content}</p>
                            <button 
                              onClick={() => setReplyingTo({postId: post.id, commentId: cmt.id, author: cmt.author})}
                              className={`text-[10px] w-fit font-semibold hover:underline ${isDarkMode ? "text-stone-500 hover:text-stone-300" : "text-stone-400 hover:text-stone-600"}`}
                            >
                              Trả lời
                            </button>
                            
                            {/* Replies */}
                            {cmt.replies && cmt.replies.length > 0 && (
                              <div className={`mt-1 pl-3 border-l-2 flex flex-col gap-1.5 ${isDarkMode ? "border-stone-700" : "border-stone-200"}`}>
                                {cmt.replies.map(reply => (
                                  <div key={reply.id} className="flex flex-col gap-0.5">
                                    <span className={`text-[11px] font-bold ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                                      {reply.author}
                                    </span>
                                    <p className={`text-[11px] ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))'''

content = re.sub(r'                        post\.comments\.map\(cmt => \(.*?                          </div>\n                        \)\)', comment_list, content, flags=re.DOTALL)


# 5. Update comment input UI
comment_input = '''                    <div className="flex flex-col gap-1 mt-1">
                      {replyingTo && replyingTo.postId === post.id && (
                        <div className="flex items-center justify-between px-2">
                          <span className={`text-[10px] ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                            Đang trả lời <strong>{replyingTo.author}</strong>
                          </span>
                          <button 
                            onClick={() => setReplyingTo(null)}
                            className={`text-[10px] hover:underline ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}
                          >Hủy</button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                          placeholder={replyingTo?.postId === post.id ? `Trả lời ${replyingTo.author}...` : "Viết bình luận..."}
                          className={`flex-1 text-xs px-3 py-2 rounded-full outline-none border ${
                            isDarkMode ? "bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500" : "bg-white border-stone-200 text-stone-800 placeholder-stone-400"
                          }`}
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentText.trim()}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>'''

content = re.sub(r'                    <div className="flex items-center gap-2 mt-1">.*?                    </div>', comment_input, content, flags=re.DOTALL)


with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

