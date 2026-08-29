import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the main return wrapper
old_return = '''  return (
    <div className={`w-full max-w-2xl mx-auto rounded-2xl border shadow-xl flex flex-col h-[85vh] ${
      isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
    }`}>'''

new_return = '''  // Randomize suggest friends once, or just pick first 5
  const suggestFriends = characters.slice(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 h-[85vh]">
      {/* Main Feed Container */}
      <div className={`flex-1 rounded-2xl border shadow-xl flex flex-col overflow-hidden ${
        isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
      }`}>'''

content = content.replace(old_return, new_return)

# Now we need to append the sidebar right before the final closing tag.
# We look for the end of the return statement.
# The component ends with:
#         )}
#       </div>
#     </div>
#   );
# }

old_end = '''        )}
      </div>
    </div>
  );
}'''

new_end = '''        )}
      </div>
    </div>

      {/* Sidebar (Friend Suggestions) */}
      <div className={`hidden lg:flex w-80 flex-col gap-4 p-5 rounded-2xl border shadow-xl overflow-y-auto ${
        isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
      }`}>
        <h3 className={`font-bold text-base ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>Gợi ý kết bạn</h3>
        <p className={`text-xs mb-2 ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>Dựa trên sở thích của bạn</p>
        
        <div className="flex flex-col gap-4">
          {suggestFriends.map(char => {
            const theme = getThemeClasses(char.themeColor);
            return (
              <div key={char.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-xl shadow-inner border overflow-hidden ${theme.bg} ${theme.border} ${theme.darkBg} ${theme.darkBorder}`}>
                    {char.avatar.startsWith('http') ? (
                      <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{char.avatar}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${isDarkMode ? "text-stone-200 group-hover:text-rose-400" : "text-stone-700 group-hover:text-rose-500"} transition-colors`}>{char.name}</span>
                    <span className={`text-[10px] truncate ${isDarkMode ? "text-stone-500" : "text-stone-500"}`}>{char.role}</span>
                  </div>
                </div>
                <button 
                  onClick={() => playMeowSound()}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 border ${
                  isDarkMode 
                    ? "bg-stone-800 border-stone-700 text-stone-300 hover:bg-rose-950/50 hover:text-rose-400 hover:border-rose-900" 
                    : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                }`}>
                  Theo dõi
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}'''

content = content.replace(old_end, new_end)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

