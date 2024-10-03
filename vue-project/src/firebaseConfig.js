// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCe3enV59xIfp7yhtVpAOwZsfTk9eHSTys",
  authDomain: "smart-academy-786d9.firebaseapp.com",
  projectId: "smart-academy-786d9",
  storageBucket: "smart-academy-786d9.appspot.com",
  messagingSenderId: "951424802228",
  appId: "1:951424802228:web:5274e7175d73223f8fa6e1",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
// const db = getFirestore(app);

// Export the auth and db objects so they can be used elsewhere in your app
// export { auth, db };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

export { db, auth }; // Exp