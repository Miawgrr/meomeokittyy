import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import config from "./firebase-applet-config.json" assert { type: "json" };

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const d = await getDoc(doc(db, "posts", "kaven-nyx"));
    if (d.exists()) {
      console.log("Kaven Nyx exists:", d.data());
      await updateDoc(doc(db, "posts", "kaven-nyx"), { views: (d.data().views || 0) + 1 });
      console.log("Updated views");
    } else {
      console.log("Kaven Nyx DOES NOT EXIST");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
