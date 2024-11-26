// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDADvXde015eCsJ-SFDpM2OyCNjnOfSYNU",
  authDomain: "busybuyi.firebaseapp.com",
  projectId: "busybuyi",
  storageBucket: "busybuyi.appspot.com",
  messagingSenderId: "534074924942",
  appId: "1:534074924942:web:5d04930392f9a84219cedf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
