// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAb_xoPph_lxJXKh7SiXQ7v8V3krNKIHIQ",
  authDomain: "notes-app-454fc.firebaseapp.com",
  projectId: "notes-app-454fc",
  storageBucket: "notes-app-454fc.firebasestorage.app",
  messagingSenderId: "123075042560",
  appId: "1:123075042560:web:307f9b1841af431fd967e5",
  measurementId: "G-KP1KJS3PZN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
