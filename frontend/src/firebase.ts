// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-marketplace-7a5f8.firebaseapp.com",
  projectId: "mern-marketplace-7a5f8",
  storageBucket: "mern-marketplace-7a5f8.firebasestorage.app",
  messagingSenderId: "920657638687",
  appId: "1:920657638687:web:514bed5553f7c598a9ac2a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);