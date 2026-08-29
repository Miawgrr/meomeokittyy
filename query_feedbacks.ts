import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import config from "./firebase-applet-config.json" assert { type: "json" };

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.feedbacks && data.feedbacks.length > 0) {
      console.log(`Character ${data.name} has ${data.feedbacks.length} feedbacks:`, data.feedbacks);
    }
  });
}
run();
