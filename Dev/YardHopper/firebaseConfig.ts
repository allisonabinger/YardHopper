// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-IOZP3TF5ImTYM9hYSFIP-q4pWBv_4lY",
  authDomain: "yardhopper-7aeb4.firebaseapp.com",
  projectId: "yardhopper-7aeb4",
  storageBucket: "yardhopper-7aeb4.firebasestorage.app",
  messagingSenderId: "188647393247",
  appId: "1:188647393247:web:39d9f45ac13e30dd34e66a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth
export const auth = initializeAuth(app);
