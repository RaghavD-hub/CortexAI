// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-ecfc6.firebaseapp.com",
  projectId: "cortexai-ecfc6",
  storageBucket: "cortexai-ecfc6.firebasestorage.app",
  messagingSenderId: "82080766170",
  appId: "1:82080766170:web:12784353b66e94e8db2de3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();