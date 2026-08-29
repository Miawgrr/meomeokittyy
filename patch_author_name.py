import re

with open('src/components/CharacterSocialNetwork.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleCreatePost authorName
content = content.replace(
    'newPost.authorName = user?.displayName || "Người dùng ẩn danh";',
    'newPost.authorName = user?.displayName || (user?.email ? user.email.split("@")[0] : "Người dùng");'
)

# Replace comment author name
content = content.replace(
    'author: user ? (user.displayName || "Bạn") : "Người dùng ẩn danh",',
    'author: user ? (user.displayName || (user.email ? user.email.split("@")[0] : "Bạn")) : "Người dùng ẩn danh",'
)

# Replace select option
old_option = '<option value="user">Đăng dưới tên: {user ? user.displayName || "Bạn" : "Người dùng (Chưa đăng nhập)"}</option>'
new_option = '<option value="user">Đăng dưới tên: {user ? (user.displayName || (user.email ? user.email.split("@")[0] : "Bạn")) : "Người dùng (Chưa đăng nhập)"}</option>'
content = content.replace(old_option, new_option)

with open('src/components/CharacterSocialNetwork.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

