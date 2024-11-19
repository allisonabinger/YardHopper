import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration object (replace this with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyCO8IaOrOukob8FuKiUmCx8XmjN9x8VhPA",
    authDomain: "yardhopper-37d13.firebaseapp.com",
    projectId: "yardhopper-37d13",
    storageBucket: "yardhopper-37d13.firebasestorage.app",
    messagingSenderId: "550166057071",
    appId: "1:550166057071:web:148908b2baaf8fecb6bd9a",
    measurementId: "G-6CFPHMSBQT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
export const db = getFirestore(app);
// Initialize Auth
export const auth = initializeAuth(app);
