import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiYOgJy264qACFAVzof8fEmqRPbKXrex0",
  authDomain: "lovematch-d29d4.firebaseapp.com",
  projectId: "lovematch-d29d4",
  storageBucket: "lovematch-d29d4.firebasestorage.app",
  messagingSenderId: "49352133365",
  appId: "1:49352133365:web:8942db96713b56d73993bc",
  measurementId: "G-XNRV6E46ZG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc };
