// Service layer for user management
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../config/firebase";
import { hashUid } from "../controllers/usersController";
import { User } from "../models/userModel";
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from "../middlewares/errors";
// import { generateCoordinates, generateGeo } from "./geolocateService";

export const getUserProfile = async (hashUid: string) => {
    try {
        const userRef = db.collection("users").doc(hashUid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new NotFoundError(`No user found with ID: ${hashUid}`);
        }

        const data = userDoc.data();

        if (!data) {
            throw new InternalServerError(`Could not retrieve data for user with ID "${hashUid}"`);
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
        if (!(err instanceof NotFoundError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while fetching user profile data.");
        }
        throw err;
    }
};

export const makeUserProfile = async (hashUid: string, uid: string, userDetails: Partial<User>) => {
    try {
        const { first, last, zipcode } = userDetails;

        if (!first || !last || !zipcode) {
            const missingFields = [];
            if (!first) missingFields.push("first");
            if (!last) missingFields.push("last");
            if (!zipcode) missingFields.push("zipcode");
            throw new BadRequestError(`Missing required fields: ${missingFields.join(", ")}`);
        }

        const firebaseUser = await auth.getUser(uid);

        if (!firebaseUser) {
            throw new InternalServerError(
                "Could not find user account. User account must exist before creating profile."
            );
        }

        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (userDoc.exists) {
            throw new BadRequestError("User profile already exists");
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
        };

        const userdoc = await userRef.set(newUserProfile);

        const createdUserDoc = await userRef.get();
        const createdData = createdUserDoc.data();

        if (!createdData) {
            throw new InternalServerError("Failed to retrieve the newly created user profile");
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
    } catch (err) {
        if (!(err instanceof BadRequestError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while creating the user profile.");
        }
        throw err;
    }
};

export const updateUserProfile = async (hashUid: string, uid: string, updatedDetails: Partial<User>) => {
    try {
        if (Object.keys(updatedDetails).length === 0) {
            throw new BadRequestError("No information provided to update user profile.");
        }

        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new NotFoundError(`No user profile found with ID: ${hashUid}`);
        }

        await userRef.update(updatedDetails);

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
            throw new InternalServerError(`Failed to confirm update for user with ID "${hashUid}".`);
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
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError || err instanceof BadRequestError)) {
            throw new InternalServerError("An unexpected error occurred while updating user profile.");
        }
        throw err;
    }
};

export const removeUser = async (hashUid: string, uid: string) => {
    try {
        try {
            await auth.deleteUser(uid);
        } catch (err) {
            throw new InternalServerError("Error occured when deleting user account from Firebase.");
        }
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new NotFoundError(`No user found with ID: ${hashUid}`);
        }

        await userRef.delete();

        try {
            const userListingsSnapshot = await db.collection("listings").where("userId", "==", hashUid).get();
            if (!userListingsSnapshot.empty) {
                const deletePromises = userListingsSnapshot.docs.map((doc) => doc.ref.delete());
                await Promise.all(deletePromises);
            }
        } catch (err) {
            throw new InternalServerError("Error occured while searching for user's listings.");
        }
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while deleting the user's account and profile.");
        }
        throw err;
    }
};

export const getUserListings = async (hashUid: string) => {
    try {
        const listingsSnapshot = await db.collection("listings").where("userId", "==", hashUid).get();

        if (listingsSnapshot.empty) {
            throw new NotFoundError(`No listings found from user with ID: ${hashUid}`);
        }

        const listings = listingsSnapshot.docs.map((doc) => {
            const data = doc.data();
            if (!data) {
                throw new InternalServerError(`Could not retrieve listings data from user with ID: ${hashUid}`);
            }
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
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while fetching the user's listings.");
        }
        throw err;
    }
};

export const getSavedListings = async (hashUid: string) => {
    try {
        const userRef = db.collection("users").doc(hashUid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new NotFoundError(`No user found with ID: ${hashUid}`);
        }

        const userData = userDoc.data();
        if (!userData) {
            throw new InternalServerError(`Could not retrieve data for user with ID "${hashUid}"`);
        }

        const savedListings: string[] = userData.savedListings || [];
        if (savedListings.length === 0) {
            throw new NotFoundError(`No saved listings found from user with ID: ${hashUid}`);
        }
        const listingsQuery = db.collection("listings").where("postId", "in", savedListings);

        const querySnapshot = await listingsQuery.get();
        

        const validListings = querySnapshot.docs.filter((doc) => {
            const data = doc.data();
            if (!data) {
                throw new InternalServerError(`Could not retrieve saved listings data for user with ID "${hashUid}"`);
            }
            return ["active", "upcoming"].includes(data.status);
        });

        const listings = validListings.map((doc) => {
            const data = doc.data();
            if (!data) {
                throw new InternalServerError(`Could not retrieve saved listings data for user with ID "${hashUid}"`);
            }
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

        const validPostIds = validListings.map((doc) => doc.data().postId);
        const updatedSavedListings = savedListings.filter((postId) => validPostIds.includes(postId));

        if (updatedSavedListings.length !== savedListings.length) {
            try {
                await userRef.update({
                    savedListings: updatedSavedListings,
                });
            } catch (err) {
                throw new InternalServerError(`Error updating saved listings with valid listings for user with ID "${hashUid}"`);
            }
        }
        if (!listings) {
            throw new NotFoundError(`No saved listings found from user with ID: ${hashUid}`);
        }
        return listings;
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while fetching the user's saved listings.");
        }
        throw err;
    }
};

export const saveListingToUser = async (hashUid: string, postId: string) => {
    try {
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new NotFoundError(`No user found with ID: ${hashUid}`);
        }

        const userData = userDoc.data();
        if (!userData) {
            throw new NotFoundError(`No user profile found with ID: ${hashUid}`);
        }

        const savedListings: string[] = userData.savedListings || [];
        if (savedListings.includes(postId)) {
            throw new BadRequestError(`Listing with ID "${postId} is already saved for user.`);
        }

        try {
            savedListings.push(postId);
            await userRef.update({ savedListings });
        } catch (err) {
            throw new InternalServerError(`Error occured while saving listing to user with ID: ${hashUid}`);
        }

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
            throw new InternalServerError(`Failed to confirm listing with ID "${postId}" was saved to user with ID: ${hashUid}`);
        }

        if (updatedData.savedListings.includes(postId)) {
            return updatedData.savedListings;
        } else {
            throw new InternalServerError(`Failed to confirm listing with ID "${postId}" was saved to user with ID: ${hashUid}`);
        }
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError || err instanceof BadRequestError)) {
            throw new InternalServerError("An unexpected error occurred while saving listing for user.");
        }
        throw err;
    }
};

export const unsaveListingToUser = async (hashUid: string, postId: string) => {
    try {
        const userRef = db.collection("users").doc(hashUid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new NotFoundError(`No user found with ID: ${hashUid}`);
        }

        const userData = userDoc.data();
        if (!userData) {
            throw new NotFoundError(`No user profile found with ID: ${hashUid}`);
        }

        const savedListings: string[] = userData.savedListings || [];
        if (!savedListings.includes(postId)) {
            throw new BadRequestError(`Listing with ID "${postId} is not saved for user.`);
        }

        try {
            const updatedSavedListings = savedListings.filter((id) => id !== postId);
            await userRef.update({ savedListings: updatedSavedListings });
        } catch (err) {
            throw new InternalServerError(`Error occured while unsaving listing from user with ID: ${hashUid}`);
        }

        const updatedUserDoc = await userRef.get();
        const updatedData = updatedUserDoc.data();

        if (!updatedData) {
            throw new Error("Unable to confirm listing added to user's saved listings");
        }

        if (updatedData.savedListings.includes(postId)) {
            throw new InternalServerError("Unable to confirm listing added to user's saved listings");
        }
        return updatedData.savedListings;
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError || err instanceof BadRequestError)) {
            throw new InternalServerError("An unexpected error occurred while saving listing for user.");
        }
        throw err;
    }
};
