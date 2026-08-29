import re

with open('src/components/EditProfileModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
states = '''  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [bio, setBio] = useState("");
  const [customUid, setCustomUid] = useState("");
  const [socialLink, setSocialLink] = useState("");'''
content = content.replace('  const [displayName, setDisplayName] = useState(user.displayName || "");\n  const [photoURL, setPhotoURL] = useState(user.photoURL || "");\n  const [bio, setBio] = useState("");', states)

# Add fetch
fetch = '''        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.bio) setBio(data.bio);
          if (data.customUid) setCustomUid(data.customUid);
          if (data.socialLink) setSocialLink(data.socialLink);
          if (data.photoURL && !user.photoURL) setPhotoURL(data.photoURL);
        }'''
content = content.replace('''        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.bio) setBio(data.bio);
          if (data.photoURL && !user.photoURL) setPhotoURL(data.photoURL);
        }''', fetch)

# Add save
save_data = '''          {
            displayName: trimmedDisplayName,
            photoURL: trimmedPhotoURL,
            bio: trimmedBio,
            customUid: customUid.trim(),
            socialLink: socialLink.trim(),
            updatedAt: new Date().toISOString(),
          },'''
content = content.replace('''          {
            displayName: trimmedDisplayName,
            photoURL: trimmedPhotoURL,
            bio: trimmedBio,
            updatedAt: new Date().toISOString(),
          },''', save_data)

# Add inputs
bio_field = '''          {/* Custom UID */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
              ID Người dùng (UID)
            </label>
            <input
              type="text"
              value={customUid}
              onChange={(e) => setCustomUid(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-stone-50 border-stone-200 text-stone-800"
              }`}
              placeholder="Ví dụ: @meomeokitty"
            />
          </div>

          {/* Social Link */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
              Liên kết (Tiktok, Facebook,...)
            </label>
            <input
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-stone-50 border-stone-200 text-stone-800"
              }`}
              placeholder="https://..."
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
              Tiểu sử (Tuỳ chọn)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-stone-50 border-stone-200 text-stone-800"
              }`}
              placeholder="Vài dòng giới thiệu về bản thân..."
              rows={2}
            />
          </div>'''
content = content.replace('''          {/* Bio Field */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
              Tiểu sử (Tuỳ chọn)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-stone-50 border-stone-200 text-stone-800"
              }`}
              placeholder="Vài dòng giới thiệu về bản thân..."
              rows={2}
            />
          </div>''', bio_field)

with open('src/components/EditProfileModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

