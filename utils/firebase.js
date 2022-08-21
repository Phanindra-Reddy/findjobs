import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyBRuSvIpSTHKu_v8yCWKPbXCLQIljcW7JU",
  authDomain: "nextjs-job-portal.firebaseapp.com",
  projectId: "nextjs-job-portal",
  storageBucket: "nextjs-job-portal.appspot.com",
  messagingSenderId: "191231679167",
  appId: "1:191231679167:web:6ae9c256ab9289c1fa040a",
  measurementId: "G-7Q6NLP2YN8",
});

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);



export { auth, firestore, storage };
