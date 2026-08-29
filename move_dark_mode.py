import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the button from the header
old_button = '''          {/* Light/Dark Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 border rounded-full transition-all duration-300 cursor-pointer ${
              isDarkMode 
                ? "border-stone-700 bg-stone-900 text-amber-400 hover:bg-stone-800" 
                : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-800"
            }`}
            title={isDarkMode ? "Chuyển sang nền sáng ☀️" : "Chuyển sang nền tối 🌙"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>'''

content = content.replace(old_button, "")

# Append a fixed floating button at the end, right before Scroll to Top or somewhere like that
floating_button = '''
      {/* Floating Light/Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-6 left-6 z-[90] p-3 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
          isDarkMode 
            ? "bg-stone-900 border-stone-700 text-amber-400 hover:bg-stone-800 shadow-stone-900/50" 
            : "bg-white border-[#eadbca] text-stone-500 hover:bg-stone-50 hover:text-stone-800 shadow-stone-200/50"
        }`}
        title={isDarkMode ? "Chuyển sang nền sáng ☀️" : "Chuyển sang nền tối 🌙"}
      >
        {isDarkMode ? <Sun className="w-6 h-6 animate-pulse" /> : <Moon className="w-6 h-6 animate-pulse" />}
      </button>'''

# Let's find a good place to insert it. Below `<AnimatePresence>` for the scroll top.
scroll_top = '''          </motion.button>
        )}
      </AnimatePresence>'''

content = content.replace(scroll_top, scroll_top + floating_button)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
