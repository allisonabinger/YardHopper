// Service layer for user management
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../config/firebase";
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
