// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQrJuYztvJqEDrdFsrkLUOD5dh0t_wTOU",
  authDomain: "eureka-b1da9.firebaseapp.com",
  projectId: "eureka-b1da9",
  storageBucket: "eureka-b1da9.appspot.com",
  messagingSenderId: "236426079755",
  appId: "1:236426079755:web:da5e084d4d16a0f19fe10e",
  measurementId: "G-TCLZHQRRXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

