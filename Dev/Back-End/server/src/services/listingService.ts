// Service layer for Firestore (listing)
import { Query } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { GeoFirestore } from "geofirestore";
import * as admin from "firebase-admin";
import { Listing } from "../models/listingModel";
import { error } from "console";
import { removeFolderInFirebase } from "./imageService";
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
                  query = query.where(
                        "categories",
                        "array-contains-any",
                        categories
                  );
            }
            // access database
            const snapshot = await query.get();

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
                        status: data.status,
                        g: data.g,
                  };
            });

            if (!listings) {
                  console.log("No listings from getListings");
            }
            return listings;
      } catch (err) {
            console.error("Error occurred during getListings: ", err);
      }
};

export const postListing = async (
      listingData: Omit<Listing, "images" | "postId" | "userId">
) => {
      try {
            const preparedListingData = {
                  ...listingData,
                  images: null,
                  userId: null,
            };

            const listingRef = await db
                  .collection("listings")
                  .add(preparedListingData);

            const postId = listingRef.id;

            await listingRef.update({
                  postId,
            });

            console.log(
                  `Listing ${listingData.title} posted with ID: ${postId}`
            );
      } catch (err) {
            console.log("Error: ", err);
            throw new Error("Error posting listing to DB");
      }
};

export const updateListingInDB = async (
      postId: string,
      updatedFields: Record<string, any>
) => {
      try {
            if (Object.keys(updatedFields).length === 0) {
                  throw new Error("No fields to update.");
            }
            const listingRef = db.collection("listings").doc(postId);
            console.log("Updating firestore doc: ", listingRef.path);

            await listingRef.update(updatedFields);

            const updatedDoc = await listingRef.get();
            return updatedDoc.exists ? updatedDoc.data() : null;
      } catch (err) {
            console.error("Error updating listing in Firestore: ", err);
            throw error;
      }
};

export const addImageToListing = async (
      postId: string,
      imageURI: string,
      caption: string
): Promise<any> => {
      try {
            const listingRef = db.collection("listings").doc(postId);

            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                  console.log("listing not found: ", postId);
                  throw new Error("Listing not found.");
            }
            const listingData = listingDoc.data();
            const currentImages = listingData?.images || [];

            const updatedImages = [
                  ...currentImages,
                  { uri: imageURI, caption: caption },
            ];

            await listingRef.update({ images: updatedImages });

            const updatedDoc = await listingRef.get();
            return updatedDoc.exists ? updatedDoc.data() : null;
      } catch (err) {
            console.error("Error updating listing in firestore with new image");
            throw new Error("Failed to add image to listing");
      }
};

export const removeListingInDB = async (
      postId: string
): Promise<Listing | null> => {
      try {
            const listingRef = db.collection("listings").doc(postId);

            // Get the listing to verify it exists
            const listingDoc = await listingRef.get();

            const storagePath = `listings/${postId}`;

            await removeFolderInFirebase(storagePath);

            if (!listingDoc.exists) {
                  console.log(`Listing with ID ${postId} does not exist.`);
                  return null;
            }

            // Retrieve the data for the deleted listing (optional, for returning)
            const listingData = listingDoc.data() as Listing;

            // Delete the document
            await listingRef.delete();

            console.log(`Listing with ID ${postId} deleted.`);
            return listingData;
      } catch (err) {
            console.error("Error occurred during removeListingInDB: ", err);
            throw new Error("Error deleting listing from database");
      }
};

// removes image reference in Firestore (uri and caption)
export const removeImageInDB = async (
      postId: string,
      imageDetails: { uri: string; caption: string }
): Promise<void> => {
      try {
            const listingRef = db.collection("listings").doc(postId);

            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                  throw new Error(`Cannot find listing with ID: ${postId}`);
            }

            const listingData = listingDoc.data();

            if (!listingData || !Array.isArray(listingData.images)) {
                  throw new Error(`Listing with ID ${postId} has no images`);
            }

            const updatedImages = listingData.images.filter((image: { uri: string; caption: string }) => {
                console.log("Comparing:", { image, imageDetails });
                return image.uri !== imageDetails.uri || image.caption !== imageDetails.caption;
            });

            console.log("Updated images:", updatedImages);

            await listingRef.update({ images: updatedImages });
            console.log("Firestore update completed successfully.");
      } catch (err) {
            console.error(
                  `Error remove image ${imageDetails.uri} reference from database.`,
                  err
            );
            throw new Error(
                  `Error remove image ${imageDetails.uri} reference from database.`
            );
      }
};

// Function to calculate the distance between to points using coordinates!
// const haversineDistance = (lat1: number, long1: number, lat2: number, long2: number): number => {
//     const R = 6371; // earth's radius in km!
//     const rad = Math.PI / 180
//     const dLat = (lat2 - lat1) * rad;
//     const dLong = (long2 - long1) * rad;
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
//         Math.sin(dLong / 2) * Math.sin(dLong / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     const distance = R * c;
//     return distance;
// }
