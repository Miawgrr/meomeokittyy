sed -i '1,20s/import { initializeApp } from "firebase\/app";/import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, increment } from "firebase\/firestore";\nimport { db } from ".\/lib\/firebase";/' src/App.tsx
sed -i '3,15d' src/App.tsx
