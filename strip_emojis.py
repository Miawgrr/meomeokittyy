import re

def remove_emojis(text):
    # Regex pattern to match most common emojis
    return re.sub(r'[\U00010000-\U0010ffff]', '', text)

with open('src/components/PetMiniGame.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Only strip in dialogues block
start_idx = content.find('const CHARACTER_PET_DIALOGUES')
end_idx = content.find('};', start_idx) + 2

dialogues = content[start_idx:end_idx]
dialogues = remove_emojis(dialogues)

new_content = content[:start_idx] + dialogues + content[end_idx:]

# Additionally, replace types to not have emojis
new_content = new_content.replace('Mèo nhỏ 🐱', 'Mèo nhỏ')
new_content = new_content.replace('Cá ngừ tươi 🐟', 'Cá ngừ tươi')
new_content = new_content.replace('Thỏ con 🐰', 'Thỏ con')
new_content = new_content.replace('Củ cà rốt giòn 🥕', 'Củ cà rốt giòn')
new_content = new_content.replace('Sói nhỏ 🐺', 'Sói nhỏ')
new_content = new_content.replace('Thịt nướng thơm 🍖', 'Thịt nướng thơm')
new_content = new_content.replace('Gấu nhỏ 🐻', 'Gấu nhỏ')
new_content = new_content.replace('Mật ong ngọt 🍯', 'Mật ong ngọt')

with open('src/components/PetMiniGame.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
