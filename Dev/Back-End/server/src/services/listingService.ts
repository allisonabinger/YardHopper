// Service layer for Firestore (listing)
import { Query } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { GeoFirestore } from "geofirestore";
import * as admin from "firebase-admin";
import { Listing } from "../models/listingModel";
import { error } from "console";
import { removeFolderInFirebase } from "./imageService";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../middlewares/errors";
// import { generateCoordinates, generateGeo } from "./geolocateService";

const geoFirestore = new GeoFirestore(db);

export const getListings = async ({
    lat,
    long,
    radius,
    categories,
}: {
    lat: number;
    long: number;
    radius: number;
    categories?: string[];
}) => {
    try {

        if (typeof lat !== "number" || typeof long !== "number" || typeof radius !== "number") {
            throw new BadRequestError("Latitude, longitude, and radius must be valid numbers.");
        }
        
        if (radius <= 0) {
            throw new BadRequestError("Radius must be greater than zero.");
        }

        const geoCollection = geoFirestore.collection("listings");

        // geofirestore uses km
        const radiusInKm = radius * 1.60934;
        let query = geoCollection.near({
            center: new admin.firestore.GeoPoint(lat, long),
            radius: radiusInKm,
        });
        // only get active and upcoming sales
        query = query.where("status", "in", ["active", "upcoming"]);

        // updated for flattened categories
        if (categories && categories.length > 0) {
            query = query.where("categories", "array-contains-any", categories);
        }
        // access database
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new NotFoundError("No listings found matching the criteria.");
        }


        // only get public fields
        const listings = snapshot.docs.map((doc) => {
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
                subcategories: data.subcategories,
                status: data.status,
                g: data.g,
                postId: data.postId,
            };
        });
        return listings;
    } catch (err) {
        if (!(err instanceof BadRequestError || err instanceof NotFoundError)) {
            throw new InternalServerError("An unexpected error occurred while fetching listings.");
        }
        throw err;
    }
};

export const getListing = async (postId: string, hashUid: string) => {
    try {
        if (!postId) {
            throw new NotFoundError("No postId provided.");
        }
        const listingRef = db.collection("listings").doc(postId);
        const listingDoc = await listingRef.get();

        if (!listingDoc.exists) {
            throw new NotFoundError(`Listing with postId "${postId}" not found.`);
        }

        const data = listingDoc.data();

        if (!data) {
            throw new InternalServerError(`Listing with postId "${postId}" could not be retrieved.`);
        }

        if (data.status !== "active" && data.status !== "upcoming") {
            if (data.userId !== hashUid) {
                throw new NotFoundError("Listing is no longer available.");
            }
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
    } catch (err) {
        if (!(err instanceof NotFoundError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while fetching the listing.");
        }
        throw err;
    }
};

export const postListing = async (
    listingData: Omit<Listing, "images" | "postId">
) => {
    try {
        if (!listingData.title || !listingData.description || !listingData.address) {
            throw new BadRequestError("Missing required fields: title, description, or address.");
        }
        if (!listingData.userId) {
            throw new BadRequestError("User ID is required to create a listing.");
        }

        const preparedListingData = {
            ...listingData,
            images: null,
        };

        const listingRef = await db
            .collection("listings")
            .add(preparedListingData);

        const postId = listingRef.id;

        await listingRef.update({
            postId,
        });
        return { postId };

        // console.log(
        //       `Listing ${listingData.title} posted with ID: ${postId}`
        // );
    } catch (err) {
        if (!(err instanceof BadRequestError || err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while posting the listing.");
        }
        throw err;
    }
};

export const updateListingInDB = async (
    postId: string,
    hashUid: string,
    updatedFields: Record<string, any>
) => {
    try {
        if (Object.keys(updatedFields).length === 0) {
            throw new BadRequestError("No fields to update.");
        }
        const listingRef = db.collection("listings").doc(postId);
        // console.log("Updating firestore doc: ", listingRef.path);

        const existingDoc = await listingRef.get();
        if (!existingDoc.exists) {
            throw new NotFoundError("Listing not found.");
        }

        const listingData = existingDoc.data();
        if (!listingData) {
            throw new InternalServerError("Listing data could not be retrieved.");
        }

        if (listingData.userId !== hashUid) {
            throw new UnauthorizedError("User not permitted to change this listing");
        }

        await listingRef.update(updatedFields);

        const updatedDoc = await listingRef.get();
        const updatedData = updatedDoc.data();

        if (!updatedData) {
            throw new InternalServerError(`Failed to confirm update for listing ID "${postId}".`);
        }
        return {
            title: updatedData.title,
            description: updatedData.description,
            address: updatedData.address,
            dates: updatedData.dates,
            startTime: updatedData.startTime,
            endTime: updatedData.endTime,
            images: updatedData.images,
            categories: updatedData.categories,
            status: updatedData.status,
            g: updatedData.g,
            postId: updatedData.postId,
        };
    } catch (err) {
        if (!(err instanceof BadRequestError || err instanceof InternalServerError || err instanceof NotFoundError || err instanceof UnauthorizedError)) {
            throw new InternalServerError("An unexpected error occurred while updating the listing.");
        }
        throw err;
    }
};

export const addImageToListing = async (
    postId: string,
    hashUid: string,
    imageURI: string,
    caption: string
): Promise<any> => {
    try {
        // console.log("Adding image to listing", { postId, imageURI, caption });

        const listingRef = db.collection("listings").doc(postId);

        const existingDoc = await listingRef.get();
        if (!existingDoc.exists) {
            throw new NotFoundError(`Listing with ID "${postId}" not found.`);
        }

        const listingData = existingDoc.data();
        if (!listingData) {
            throw new InternalServerError(`Failed to retrieve data for listing ID "${postId}".`);
        }
        if (listingData.userId !== hashUid) {
            throw new UnauthorizedError("User not permitted to update this listing.");
        }

        // console.log("Existing listing data:", listingDoc);
        const currentImages = listingData?.images || [];

        const updatedImages = [
            ...currentImages,
            { uri: imageURI, caption: caption || "" },
        ];
        // console.log("Updated images array:", updatedImages);
        await listingRef.update({ images: updatedImages });

        const updatedDoc = await listingRef.get();
        const updatedData = updatedDoc.data();

        if (!updatedData) {
            throw new InternalServerError(
                `Failed to confirm image update for listing ID "${postId}".`
            );
        }
        return {
            title: updatedData.title,
            description: updatedData.description,
            address: updatedData.address,
            dates: updatedData.dates,
            startTime: updatedData.startTime,
            endTime: updatedData.endTime,
            images: updatedData.images,
            categories: updatedData.categories,
            status: updatedData.status,
            g: updatedData.g,
            postId: updatedData.postId,
        };
    } catch (err) {
        if (!(err instanceof InternalServerError || err instanceof NotFoundError || err instanceof UnauthorizedError)) {
            throw new InternalServerError("An unexpected error occurred while posting the listing.");
        }
        throw err;
    }
};

export const removeListingInDB = async (postId: string, hashUid: string) => {
    try {
        const listingRef = db.collection("listings").doc(postId);
        // console.log("Updating firestore doc: ", listingRef.path);

        const existingDoc = await listingRef.get();
        if (!existingDoc.exists) {
            throw new NotFoundError(`Listing with ID "${postId}" not found.`);
        }

        const listingData = existingDoc.data();
        if (!listingData) {
            throw new InternalServerError(`Failed to retrieve data for listing ID "${postId}".`);
        }


        if (listingData.userId !== hashUid) {
            throw new UnauthorizedError("User not permitted to delete this listing.");
        }

        const storagePath = `listings/${postId}`;
        await removeFolderInFirebase(storagePath);

        // Delete the document
        await listingRef.delete();
        return {
            title: listingData.title,
            postId: listingData.postId,
        };
        // console.log(`Listing with ID ${postId} deleted.`);
        // return listingData;
    } catch (err) {
        if (!(err instanceof InternalServerError || err instanceof NotFoundError || err instanceof UnauthorizedError)) {
            throw new InternalServerError("An unexpected error occurred while deleting the listing.");
        }
        throw err;
    }
};

export const removeImageInDB = async (
    postId: string,
    hashUid: string,
    uri: string
) => {
    try {
        // console.log(`Uri: ${uri}`)
        const listingRef = db.collection("listings").doc(postId);

        const existingDoc = await listingRef.get();
        if (!existingDoc.exists) {
            throw new NotFoundError(`Listing with ID "${postId}" not found.`);
        }

        const listingData = existingDoc.data();
        if (!listingData) {
            throw new InternalServerError(`Failed to retrieve data for listing ID "${postId}".`);
        }

        if (listingData.userId !== hashUid) {
            throw new UnauthorizedError("User not permitted to update this listing.");
        }

        if (!Array.isArray(listingData.images)) {
            throw new NotFoundError(`No images found for listing ID "${postId}".`);
        }

        const currentImages = listingData.images;
        const updatedImages = currentImages.filter(
            (image: { uri: string }) =>
                decodeURIComponent(image.uri.trim()) !== decodeURIComponent(uri.trim())
        );

        if (currentImages.length === updatedImages.length) {
            throw new NotFoundError(`Image URI "${uri}" not found in listing ID "${postId}".`);
        }

        //   console.log("Updated images:", JSON.stringify(updatedImages, null, 2));

        const uriExists = updatedImages.some(
            (image: { uri: string }) =>
                decodeURIComponent(image.uri.trim()) ===
                decodeURIComponent(uri.trim())
        );
        await listingRef.update({ images: updatedImages });

        const updatedDoc = await listingRef.get();
        const updatedData = updatedDoc.data();

        if (!updatedData) {
            throw new InternalServerError(
                `Failed to confirm image removal for listing ID "${postId}".`
            );
        }
        return {
            title: updatedData.title,
            description: updatedData.description,
            address: updatedData.address,
            dates: updatedData.dates,
            startTime: updatedData.startTime,
            endTime: updatedData.endTime,
            images: updatedData.images,
            categories: updatedData.categories,
            status: updatedData.status,
            g: updatedData.g,
            postId: updatedData.postId,
        };
    } catch (err) {
        if (!(err instanceof InternalServerError || err instanceof NotFoundError || err instanceof UnauthorizedError)) {
            throw new InternalServerError("An unexpected error occurred while posting the listing.");
        }
        throw err;
    }
};

export const changeCaptionInDB = async (
    postId: string,
    hashUid: string,
    uri: string,
    caption: string
): Promise<any> => {
    try {
        const listingRef = db.collection("listings").doc(postId);

        const existingDoc = await listingRef.get();
        if (!existingDoc.exists) {
            throw new NotFoundError(`Listing with ID "${postId}" not found.`);
        }

        const listingData = existingDoc.data();
        if (!listingData) {
            throw new InternalServerError(`Failed to retrieve data for listing ID "${postId}".`);
        }

        if (listingData.userId !== hashUid) {
            throw new UnauthorizedError("User not permitted to update this listing.");
        }

        if (!Array.isArray(listingData.images)) {
            throw new NotFoundError(`No images found for listing ID "${postId}".`);
        }

        const currentImages = listingData.images;
        const updatedImages = currentImages.map(
            (image: { uri: string; caption: string }) => {
                if (
                    decodeURIComponent(image.uri.trim()) ===
                    decodeURIComponent(uri.trim())
                ) {
                    return { ...image, caption };
                }
                return image;
            }
        );

        const uriExists = updatedImages.some(
            (image: { uri: string; caption: string }) =>
                decodeURIComponent(image.uri.trim()) ===
                decodeURIComponent(uri.trim())
        );

        if (!uriExists) {
            throw new NotFoundError(`Image URI "${uri}" not found in listing ID "${postId}".`);
        }

        await listingRef.update({ images: updatedImages });


        const updatedDoc = await listingRef.get();
        const updatedData = updatedDoc.data();

        if (!updatedData) {
            throw new InternalServerError(
                `Failed to confirm image removal for listing ID "${postId}".`
            );
        }
        return {
            title: updatedData.title,
            description: updatedData.description,
            address: updatedData.address,
            dates: updatedData.dates,
            startTime: updatedData.startTime,
            endTime: updatedData.endTime,
            images: updatedData.images,
            categories: updatedData.categories,
            status: updatedData.status,
            g: updatedData.g,
            postId: updatedData.postId,
        };
    } catch (err) {
        if (!(err instanceof InternalServerError || err instanceof NotFoundError || err instanceof UnauthorizedError)) {
            throw new InternalServerError("An unexpected error occurred while posting the listing.");
        }
        throw err;
    }
};
