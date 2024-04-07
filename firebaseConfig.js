// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNNk8lEMZI5-rQVKl1E2XDMHLnImQ2HIw",
  authDomain: "week08project-80b3d.firebaseapp.com",
  projectId: "week08project-80b3d",
  storageBucket: "week08project-80b3d.appspot.com",
  messagingSenderId: "721265287235",
  appId: "1:721265287235:web:c5bb426984223dbc10b4f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
