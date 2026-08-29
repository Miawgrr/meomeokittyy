import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

const newFunc = `
  const handleLinkBlur = async () => {
    if (!photoURL.trim()) return;
    try {
      // Check if it looks like a page link (Pinterest, Facebook)
      if (photoURL.includes("pin.it") || photoURL.includes("pinterest.com") || photoURL.includes("facebook.com") || photoURL.includes("fb.watch")) {
        const res = await fetch(\`/api/extract-image?url=\${encodeURIComponent(photoURL)}\`);
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            setPhotoURL(data.imageUrl);
          }
        }
      }
    } catch (e) {
      console.error("Failed to extract image:", e);
    }
  };
`;

const searchInput = `onChange={(e) => setPhotoURL(e.target.value)}
                className={\`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors \${`;

const replaceInput = `onChange={(e) => setPhotoURL(e.target.value)}
                onBlur={handleLinkBlur}
                className={\`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-colors \${`;

if (code.includes(searchInput) && !code.includes('handleLinkBlur')) {
    // Insert newFunc right before handleSave
    code = code.replace('  const handleSave = async () => {', newFunc + '\n  const handleSave = async () => {');
    code = code.replace(searchInput, replaceInput);
    fs.writeFileSync('src/components/EditProfileModal.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to insert");
}
