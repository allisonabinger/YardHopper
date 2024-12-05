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
            userId: data.hash,
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

        const newUserProfile = {
            userId: hashUid,
            first,
            last,
            email: firebaseUser.email || "",
            zipcode: userDetails.zipcode!,
            street: userDetails.street ?? null,
            city: userDetails.city ?? null,
            state: userDetails.state ?? null,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        }

        const userdoc = await userRef.set(newUserProfile)

        const createdUserDoc = await userRef.get();
        const createdData = createdUserDoc.data();

        if (!createdData) {
            throw new Error("Failed to retrieve the newly created user profile");
          }

          return {
            userId: createdData.userId,
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

export const updateUserProfile = async (hashUid: string, uid: string, updatedDetails: Partial<User>) => {
    try {
        if (Object.keys(updatedDetails).length === 0) {
            throw new Error("No fields to update.");
        }
        
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User profile does not exist");
        }

        await userRef.update(updatedDetails);

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
          throw new Error('listing not found');
        }
        return {
            first: updatedData.first,
            last: updatedData.last,
            email: updatedData.email,
            street: updatedData.street ?? undefined,
            city: updatedData.city ?? undefined,
            state: updatedData.state ?? undefined,
            zipcode: updatedData.zipcode,
    };

    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
}

export const removeUser = async (hashUid: string, uid: string) => {
    try {
        await auth.deleteUser(uid);
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User profile does not exist");
        }

        await userRef.delete();

        try {
            await auth.getUser(uid);
            throw new Error("Failed to delete user from Firebase Authentication.");
          } catch (error: any) {
            if (error.code !== "auth/user-not-found") {
              throw error; // Rethrow unexpected errors
            }
          }

    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
}

export const getUserListings = async (
    hashUid: string
) => {
    try {
        const listingsSnapshot = await db.collection("listings").where("userId", "==", hashUid).get();

        if (listingsSnapshot.empty) {
            throw new Error("User has no listings");
        }

        const listings = listingsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                  title: data.title,
                  description: data.description,
                  address: data.address,
                  dates: data.dates,
                  startTime: data.startTime,
                  endTime: data.endTime,
                  images: data.images,
                  categories: data.categories,
                  status: data.status,
                  g: data.g,
                  postId: data.postId,
            };
      });
      return listings;

    } catch (error) {
          console.error("Error finding user listing in Firestore: ", error);
          throw error;
    }
};

export const getSavedListings = async (
    hashUid: string
) => {
    try {
        const userRef = db.collection("users").doc(hashUid);
        const userDoc = await userRef.get();
    
        if (!userDoc.exists) {
          throw new Error("User not found");
        }
    
        const userData = userDoc.data();
        if (!userData) {
          throw new Error("User data is empty");
        }
    
        const savedListings: string[] = userData.savedListings || [];
        if (savedListings.length === 0) {
          return [];
        }
        const listingsQuery = db
        .collection("listings")
        .where("postId", "in", savedListings)
        .where("status", "in", ["active", "upcoming"])

        const querySnapshot = await listingsQuery.get();

        const listings = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                  title: data.title,
                  description: data.description,
                  address: data.address,
                  dates: data.dates,
                  startTime: data.startTime,
                  endTime: data.endTime,
                  images: data.images,
                  categories: data.categories,
                  status: data.status,
                  g: data.g,
                  postId: data.postId,
            };
      });
      return listings;

    } catch (error) {
          console.error("Error finding user listing in Firestore: ", error);
          throw error;
    }
};

export const saveListingToUser = async (hashUid: string, postId: string) => {
    try {
        
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User profile does not exist");
        }

        const userData = userDoc.data();
        if (!userData) {
          throw new Error("User data is empty");
        }

        const savedListings: string[] = userData.savedListings || [];
        if (savedListings.includes(postId)) {
          return { message: "Listing is already saved" };
        }
        savedListings.push(postId);

        await userRef.update({ savedListings });

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
            throw new Error("Unable to confirm listing added to user's saved listings");
        }

        if(updatedData.savedListings.includes(postId)) {
            return { message: "Listing saved successfully"}
        } else {
            throw new Error("Unable to confirm listing added to user's saved listings");
        }

    } catch (error) {
        console.error("Error saving listing: ", error);
        throw error;
      }
}

export const unsaveListingToUser = async (hashUid: string, postId: string) => {
    try {
        
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User profile does not exist");
        }

        const userData = userDoc.data();
        if (!userData) {
          throw new Error("User data is empty");
        }

        const savedListings: string[] = userData.savedListings || [];
        if (!savedListings.includes(postId)) {
          return { message: "Listing is not saved" };
        }
        const updatedSavedListings = savedListings.filter(id => id !== postId);

        await userRef.update({ savedListings: updatedSavedListings });

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
            throw new Error("Unable to confirm listing added to user's saved listings");
        }

        if(updatedData.savedListings.includes(postId)) {
            throw new Error("Unable to confirm listing added to user's saved listings");    
        }
        return { message: "Listing removed successfully"}
    } catch (error) {
        console.error("Error saving listing: ", error);
        throw error;
      }
}
