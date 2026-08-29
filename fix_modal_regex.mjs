import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

const regex = /  \);\s*}\s*$/;
if (regex.test(code)) {
    code = code.replace(regex, '  );\n\n  return createPortal(modalContent, document.body);\n}');
    fs.writeFileSync('src/components/EditProfileModal.tsx', code);
    console.log("Success regex");
} else {
    console.log("Regex not matched");
}
