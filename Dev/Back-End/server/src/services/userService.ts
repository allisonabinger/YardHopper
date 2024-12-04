// Service layer for user management
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../config/firebase";
import { hashUid } from "../controllers/usersController";
import { User } from "../models/userModel";
// import { generateCoordinates, generateGeo } from "./geolocateService";

export const getUserProfile = async (
    hashUid: string,
) => {
    try {
          const userRef = db.collection("users").doc(hashUid);
          const userDoc = await userRef.get();

          if (!userDoc.exists) {
            return null;
      }

          const data = userDoc.data();

          if (!data) {
            return null;
          }
          return {
            first: data.first,
            last: data.last,
            email: data.email,
            street: data.street ?? undefined,
            city: data.city ?? undefined,
            state: data.state ?? undefined,
            zipcode: data.zipcode,
            createdAt: data.createdAt,
          };

    } catch (err) {
          console.error("Error finding listing in Firestore: ", err);
          throw err;
    }
};

export const makeUserProfile = async (hashUid: string, uid: string, userDetails: Partial<User>) => {
    try {
        const {first, last, zipcode} = userDetails;
        if (!userDetails) {
            throw new Error("Missing user details.")
        }
        if (!first || !last || !zipcode) {
            const missingFields = [];
            if (!first) missingFields.push("first");
            if (!last) missingFields.push("last");
            if (!zipcode) missingFields.push("zipcode");
            throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }

        const firebaseUser = await auth.getUser(uid);
        if (!firebaseUser) {
            throw new Error("Cannot make user profile unless account is created.")
        }

        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (userDoc.exists) {
            throw new Error("User profile already exists");
        }

        const newUserProfile: User = {
            hashUid,
            first,
            last,
            email: firebaseUser.email || "",
            zipcode: userDetails.zipcode!,
            street: userDetails.street ?? null,
            city: userDetails.city ?? null,
            state: userDetails.state ?? null,
            savedListings: [],
            userListings: [],
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        }

        const userdoc = await userRef.set(newUserProfile)

        const createdUserDoc = await userRef.get();
        const createdData = createdUserDoc.data();

        if (!createdData) {
            throw new Error("Failed to retrieve the newly created user profile");
          }

          return {
            hashUid: createdData.hashUid,
            first: createdData.first,
            last: createdData.last,
            email: createdData.email,
            street: createdData.street ?? undefined,
            city: createdData.city ?? undefined,
            state: createdData.state ?? undefined,
            zipcode: createdData.zipcode,
            savedListings: createdData.savedListings || [],
            userListings: createdData.userListings || [],
            createdAt: createdData.createdAt,
          };

    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
}
