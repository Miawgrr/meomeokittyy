import { initializeApp } from "firebase/app";
import { initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import appletConfig from "../../firebase-applet-config.json";

// Use the official platform-provisioned config
const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyApncbocIEnfp5d8yvAuyZuNgzTaR6BH_M",
  authDomain: appletConfig.authDomain || "meomeokitty-1c5c4.firebaseapp.com",
  projectId: appletConfig.projectId || "meomeokitty-1c5c4",
  storageBucket: appletConfig.storageBucket || "meomeokitty-1c5c4.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "121066861023",
  appId: appletConfig.appId || "1:121066861023:web:c2a2e693c396428dc9946a",
};

const app = initializeApp(firebaseConfig);

// Enable long-polling to prevent gRPC/WebSocket connection failures in proxied sandbox environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, appletConfig.firestoreDatabaseId || undefined);

// Enable offline IndexedDB persistence for flawless offline capability and caching
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Firestore offline persistence failed-precondition (multiple tabs open). Working in default cache mode.");
  } else if (err.code === "unimplemented") {
    console.warn("Firestore offline persistence unimplemented by current browser.");
  } else {
    console.warn("Firestore offline persistence failed to enable:", err.message);
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
