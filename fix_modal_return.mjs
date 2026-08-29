import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

const modalContentIndex = code.indexOf('const modalContent = (');
if (modalContentIndex !== -1) {
    let newCode = code.substring(0, modalContentIndex);
    let rest = code.substring(modalContentIndex);
    
    // find the last '  );\n}' in the file
    let lastParenIndex = rest.lastIndexOf('  );\n}');
    if (lastParenIndex !== -1) {
        rest = rest.substring(0, lastParenIndex) + '  );\n\n  return createPortal(modalContent, document.body);\n}';
        fs.writeFileSync('src/components/EditProfileModal.tsx', newCode + rest);
        console.log("Success");
    } else {
        console.log("Could not find end of modal content");
    }
}
