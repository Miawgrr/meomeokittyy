import re

with open('src/components/UserProfile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add getDoc import
content = content.replace('import { User, signInWithPopup, signOut } from "firebase/auth";', 'import { User, signInWithPopup, signOut } from "firebase/auth";\nimport { doc, getDoc } from "firebase/firestore";')
content = content.replace('import { auth, googleProvider } from "../lib/firebase";', 'import { auth, googleProvider, db } from "../lib/firebase";')

# Add custom profile state
states = '''  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customProfile, setCustomProfile] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      const fetchCustom = async () => {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            setCustomProfile(snap.data());
          }
        } catch (e) { }
      };
      fetchCustom();
    } else {
      setCustomProfile(null);
    }
  }, [user]);'''

content = content.replace('  const [dropdownOpen, setDropdownOpen] = useState(false);', states)

# Update the display name & email part (block variant)
block_content = '''              <div className="text-left">
                <div className={`font-medium text-sm ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>{customProfile?.displayName || user.displayName || "Người dùng"}</div>
                <div className={`text-xs ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{customProfile?.customUid ? customProfile.customUid : user.email}</div>
              </div>'''
content = content.replace('''              <div className="text-left">
                <div className={`font-medium text-sm ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>{user.displayName || "Người dùng"}</div>
                <div className={`text-xs ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{user.email}</div>
              </div>''', block_content)

# Update the display name & email part (dropdown variant)
dropdown_content = '''              <div className={`px-4 py-3 border-b ${isDarkMode ? "border-stone-800" : "border-stone-100"}`}>
                <div className="font-medium truncate text-sm">{customProfile?.displayName || user.displayName || "Người dùng ẩn danh"}</div>
                <div className={`text-xs truncate ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{customProfile?.customUid ? customProfile.customUid : user.email}</div>
              </div>'''
content = content.replace('''              <div className={`px-4 py-3 border-b ${isDarkMode ? "border-stone-800" : "border-stone-100"}`}>
                <div className="font-medium truncate text-sm">{user.displayName || "Người dùng ẩn danh"}</div>
                <div className={`text-xs truncate ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>{user.email}</div>
              </div>''', dropdown_content)

with open('src/components/UserProfile.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

