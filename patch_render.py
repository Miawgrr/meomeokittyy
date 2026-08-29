with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''          posts.map((post) => {
            const isUser = post.characterId === "user";
            const char = isUser ? null : getCharacter(post.characterId);
            if (!isUser && !char) return null;
            
            const theme = isUser ? { bg: "bg-blue-100", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkBorder: "dark:border-blue-800", text: "text-blue-700", darkText: "dark:text-blue-300" } : getThemeClasses(char!.themeColor);

            const displayName = isUser ? (post.authorName || "Người dùng") : char!.name;
            const displayRole = isUser ? "Bạn" : char!.role;
            const displayAvatar = isUser ? (post.authorAvatar || "") : char!.avatar;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={post.id}
                className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 ${
                  isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border overflow-hidden ${theme.bg} ${theme.border} ${theme.darkBg} ${theme.darkBorder}`}>
                      {displayAvatar.startsWith('http') || isUser ? (
                        <img src={displayAvatar || `https://ui-avatars.com/api/?name=${displayName}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{displayAvatar}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                        {displayName}
                        {displayRole && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${theme.bg} ${theme.text} ${theme.darkBg} ${theme.darkText}`}>
                            {displayRole}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {new Date(post.timestamp).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>'''

content = content.replace('''          posts.map((post) => {
            const char = getCharacter(post.characterId);
            if (!char) return null;
            
            const theme = getThemeClasses(char.themeColor);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={post.id}
                className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 ${
                  isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border ${theme.bg} ${theme.border} ${theme.darkBg} ${theme.darkBorder}`}>
                      {char.avatar.startsWith('http') ? (
                        <img src={char.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{char.avatar}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                        {char.name}
                        {char.role && (
                          <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md ${theme.bg} ${theme.text} ${theme.darkBg} ${theme.darkText}`}>
                            {char.role}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {new Date(post.timestamp).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>''', replacement)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

