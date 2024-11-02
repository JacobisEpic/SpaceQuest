// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3skh5Wf_HQEv1YG4WIZ3TbQBYu3BXPRE",
  authDomain: "spacequest-51bcb.firebaseapp.com",
  projectId: "spacequest-51bcb",
  storageBucket: "spacequest-51bcb.firebasestorage.app",
  messagingSenderId: "878113482228",
  appId: "1:878113482228:web:ae05c189dedcaeefac45a1",
  measurementId: "G-D1JL9ZB6J4"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
