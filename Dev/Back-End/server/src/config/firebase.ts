// Initializes Firebase app, Firestore, and Firestore Storage

// Sets up Firebase Admin SDK for firestore and storage access

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import {getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as dotenv from "dotenv"

dotenv.config();

const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

const app = initializeApp({
    credential: cert(serviceAccount),
})

export const db = getFirestore(app);
export const storage = getStorage(app)
