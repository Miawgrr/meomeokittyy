const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf-8');
const badMarker = 'className="w-5 h-5 sm:w-6 sm:      {dropdownOpen && (';
if (code.includes(badMarker)) {
  const parts = code.split(badMarker);
  const correctEnd = `className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
      </button>
      {dropdownOpen && (
        <div className={\`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border overflow-hidden transition-all duration-200 origin-top-right z-50 \${
          isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200 shadow-black/50" : "bg-white border-stone-200 text-stone-800 shadow-stone-200/50"
        }\`}>
          {user ? (
            <div className="flex flex-col">
              <div className={\`px-4 py-3 border-b \${isDarkMode ? "border-stone-800" : "border-stone-100"}\`}>
                <div className="font-medium truncate text-sm">{user.displayName || "Người dùng ẩn danh"}</div>
                <div className={\`text-xs truncate \${isDarkMode ? "text-stone-400" : "text-stone-500"}\`}>{user.email}</div>
              </div>
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  setIsEditModalOpen(true);
                }}
                className={\`flex items-center w-full px-4 py-3 text-sm text-left transition-colors border-b \${
                  isDarkMode ? "hover:bg-stone-800 border-stone-800 text-stone-200" : "hover:bg-stone-50 border-stone-100 text-stone-700"
                }\`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Chỉnh sửa hồ sơ
              </button>
              <button 
                onClick={handleSignOut}
                className={\`flex items-center w-full px-4 py-3 text-sm text-left transition-colors \${
                  isDarkMode ? "hover:bg-stone-800 text-red-400" : "hover:bg-red-50 text-red-600"
                }\`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex flex-col p-2 space-y-1">
              <div className={\`px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider \${isDarkMode ? "text-stone-500" : "text-stone-400"}\`}>
                Đăng nhập bằng
              </div>
              <button 
                onClick={handleSignInGoogle}
                className={\`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-colors \${
                  isDarkMode ? "hover:bg-stone-800" : "hover:bg-stone-100"
                }\`}
              >
                <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
            </div>
          )}
        </div>
      )}
      {isEditModalOpen && user && (
        <EditProfileModal 
          user={user}
          isDarkMode={isDarkMode}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={() => {
            setUser({ ...user } as User); 
          }}
        />
      )}
    </div>
  );
}
`;
  fs.writeFileSync('src/components/UserProfile.tsx', parts[0] + correctEnd);
}
