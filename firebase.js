import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOAabU9BXBenyyDuuq-yUgCdisLErSN9M",
  authDomain: "gymora-6a284.firebaseapp.com",
  projectId: "gymora-6a284",
  storageBucket: "gymora-6a284.firebasestorage.app",
  messagingSenderId: "165228263514",
  appId: "1:165228263514:web:9f93bcc170c902ddc90063",
  measurementId: "G-SKEYVJFTQJ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
