import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

if (code.endsWith('  );\n}')) {
    code = code.substring(0, code.length - 1) + '\n  return createPortal(modalContent, document.body);\n}';
    fs.writeFileSync('src/components/EditProfileModal.tsx', code);
    console.log("Success");
} else {
    console.log("Could not find the exact end pattern");
}
