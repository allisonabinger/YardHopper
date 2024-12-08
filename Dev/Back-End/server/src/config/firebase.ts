// Initializes Firebase app, Firestore, and Firestore Storage

// Sets up Firebase Admin SDK for firestore and storage access

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import {getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { ENV } from "./environment";
import { getAuth } from "firebase-admin/auth";
// import * as dotenv from "dotenv"
// import path from "path"

// // dotenv.config({ path: path.resolve(__dirname, ".env") });
// dotenv.config();

const serviceAccount: ServiceAccount = {
    projectId: ENV.FIREBASE_PROJECT_ID,
    privateKey: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
}

// console.log("Service Account Configuration:", serviceAccount);

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  throw new Error("Missing Firebase configuration. Check your environment variables.");
}

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `gs://${ENV.FIREBASE_STORAGE_BUCKET}`,
})

export const db = getFirestore(app);
export const storage = getStorage(app)
export const auth = getAuth(app);
