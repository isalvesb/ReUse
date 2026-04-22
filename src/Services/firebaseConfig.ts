// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMv0DkvVNwoiSr7FWq9-ctAvF65UxT7qo",
  authDomain: "reuse-5630.firebaseapp.com",
  projectId: "reuse-5630",
  storageBucket: "reuse-5630.firebasestorage.app",
  messagingSenderId: "214549799877",
  appId: "1:214549799877:web:291ca3596c16a2af36a1ac",
  measurementId: "G-W83HS2EGDX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;
