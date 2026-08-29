import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any lingering simple dark: classes in static strings, if any.
# Actually, the user specifically mentioned:
# "Khi người dùng trả lời bình luận của nhân vật chỉnh lại màu phông chữ phù hợp với nền light mode và dark mode"
# (When the user replies to the character's comment, adjust the font color to match the light mode and dark mode background)

# I have already fixed the comment text.
# Let's check if the input placeholder text color is wrong.
# In Tailwind, placeholder color can be set via placeholder-stone-400.
# The input is:
# className={`flex-1 text-xs px-3 py-2 rounded-full outline-none border ${
#   isDarkMode ? "bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500" : "bg-white border-stone-200 text-stone-800 placeholder-stone-400"
# }`}

content = content.replace(
    'isDarkMode ? "bg-stone-800 border-stone-700 text-stone-200" : "bg-white border-stone-200 text-stone-800"',
    'isDarkMode ? "bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500" : "bg-white border-stone-200 text-stone-800 placeholder-stone-400"'
)

# And the "Chưa có bình luận nào." text:
content = content.replace(
    '<p className="text-[11px] text-stone-400 italic text-center py-2">Chưa có bình luận nào.</p>',
    '<p className={`text-[11px] italic text-center py-2 ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>Chưa có bình luận nào.</p>'
)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
