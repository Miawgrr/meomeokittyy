import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

// replace <img \n                 src={photoURL ||... \n                 alt="Preview" \n                 className={...} \n              />
// with same but added referrerPolicy="no-referrer"

const searchImg = 'alt="Preview"';
const replaceImg = 'alt="Preview"\n                referrerPolicy="no-referrer"';
if (code.includes(searchImg) && !code.includes('referrerPolicy="no-referrer"')) {
    code = code.replace(searchImg, replaceImg);
    fs.writeFileSync('src/components/EditProfileModal.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to replace or already has it");
}
