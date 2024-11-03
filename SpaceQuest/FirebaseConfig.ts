// // FirebaseConfig.ts

// // Import the functions you need from the Firebase SDKs
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth"; // If using Firebase Authentication
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCJgc6hRZ8KB05hc_R1zP7E6clpX1hK9OM",
//   authDomain: "spacequest-9a55d.firebaseapp.com",
//   projectId: "spacequest-9a55d",
//   storageBucket: "spacequest-9a55d.firebasestorage.app",
//   messagingSenderId: "357401255778",
//   appId: "1:357401255778:web:aa1043af706c202d80563b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // Initialize Firebase Authentication
// const database = getDatabase(app); // Initialize Firebase Realtime Database

// export { app, auth, database };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyCJgc6hRZ8KB05hc_R1zP7E6clpX1hK9OM",
    authDomain: "spacequest-9a55d.firebaseapp.com",
    projectId: "spacequest-9a55d",
    storageBucket: "spacequest-9a55d.firebasestorage.app",
    messagingSenderId: "357401255778",
    appId: "1:357401255778:web:aa1043af706c202d80563b"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app); // Or getFirestore(app) for the lite version

export { app, auth, database, db };
