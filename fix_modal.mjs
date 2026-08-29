import fs from 'fs';
let code = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf-8');

// 1. Add createPortal import
if (!code.includes('createPortal')) {
    code = code.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport { createPortal } from "react-dom";');
}

// 2. Replace handleImageUpload to compress image
const oldUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Kích thước ảnh tối đa là 1MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };`;

const newUpload = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh tối đa là 5MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/webp", 0.7);
          setPhotoURL(compressedBase64);
        } else {
          setPhotoURL(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };`;

code = code.replace(oldUpload, newUpload);
code = code.replace("Nhấn để chọn ảnh (Tối đa 1MB)", "Nhấn để chọn ảnh (Tối đa 5MB)");

// 3. Wrap return in createPortal
const returnRegex = /return \(\s*<div className="fixed inset-0 z-\[100\].*?\s*<\/div>\s*\);\s*}/s;
const match = code.match(returnRegex);
if (match) {
    const replacement = match[0].replace('return (', 'const modalContent = (').replace('  );\n}', '  );\n\n  return createPortal(modalContent, document.body);\n}');
    code = code.replace(match[0], replacement);
}

fs.writeFileSync('src/components/EditProfileModal.tsx', code);
