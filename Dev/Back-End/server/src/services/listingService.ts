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
                        postId: data.postId
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

export const getListing = async (
    postId: string,
) => {
    try {
          const listingRef = db.collection("listings").doc(postId);
          const listingDoc = await listingRef.get();

          if (!listingDoc.exists) {
            // console.log("listing not found: ", postId);
            throw new Error("Listing not found.");
      }

          const data = listingDoc.data();

          if (!data) {
            throw new Error('listing not found')
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
            postId: data.postId
      };

    } catch (err) {
          console.error("Error finding listing in Firestore: ", err);
          throw error;
    }
};

export const postListing = async (
      listingData: Omit<Listing, "images" | "postId">
) => {
      try {
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
            const data = updatedDoc.data();

            if (!data) {
              throw new Error('listing not found');
              return null;
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
              postId: data.postId
        };
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
        // console.log("Adding image to listing", { postId, imageURI, caption });

            const listingRef = db.collection("listings").doc(postId);

            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                  console.log("listing not found: ", postId);
                  throw new Error("Listing not found.");
            }
            // console.log("Existing listing data:", listingDoc);
            const listingData = listingDoc.data();
            const currentImages = listingData?.images || [];

            const updatedImages = [
                  ...currentImages,
                  { uri: imageURI, caption: caption || "" },
            ];
            // console.log("Updated images array:", updatedImages);
            await listingRef.update({ images: updatedImages });

            const updatedDoc = await listingRef.get();
            const data = updatedDoc.data();

            if (!data) {
              throw new Error('listing not found');
              return null;
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
              postId: data.postId
        };
      } catch (err) {
            console.error("Error updating listing in firestore with new image");
            throw new Error("Failed to add image to listing");
      }
};

export const removeListingInDB = async (
      postId: string
) => {
      try {
            const listingRef = db.collection("listings").doc(postId);

            // Get the listing to verify it exists
            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                // console.log(`Listing with ID ${postId} does not exist.`);
                return null;
            }
            const listingData = listingDoc.data() as Listing;

            const storagePath = `listings/${postId}`;
            await removeFolderInFirebase(storagePath);

            // Delete the document
            await listingRef.delete();
            return {
                title: listingData.title,
                postId: listingData.postId
          };
            // console.log(`Listing with ID ${postId} deleted.`);
            // return listingData;
      } catch (err) {
            console.error("Error occurred during removeListingInDB: ", err);
            throw new Error("Error deleting listing from database");
      }
};

// removes image reference in Firestore (uri and caption)
export const removeImageInDB = async (
      postId: string,
      uri: string,
): Promise<void> => {
      try {
        // console.log(`Uri: ${uri}`)
            const listingRef = db.collection("listings").doc(postId);

            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                  throw new Error(`Cannot find listing with ID: ${postId}`);
            }

            const listingData = listingDoc.data();
            // console.log("Listing Data:", JSON.stringify(listingData, null, 2));

            if (!listingData) {
                  throw new Error(`Cannot find listing: ${postId}`);
            }
            if (!Array.isArray(listingData.images)) {
                throw new Error(`Listing with ID ${postId} has no images`);
          }
          const currentImages = listingData?.images
        //   console.log("Current images:", JSON.stringify(currentImages, null, 2));

          const updatedImages = currentImages.filter((image: { uri: string }) => {
            const decodedImageURI = decodeURIComponent(image.uri.trim());
            const decodedTargetURI = decodeURIComponent(uri.trim());
            // console.log(`Comparing: "${decodedImageURI}" === "${decodedTargetURI}"`);
            return decodedImageURI !== decodedTargetURI;
        });

        //   console.log("Updated images:", JSON.stringify(updatedImages, null, 2));

          const uriExists = updatedImages.some(
            (image: { uri: string }) =>
                decodeURIComponent(image.uri.trim()) === decodeURIComponent(uri.trim())
        );

        if (uriExists) {
            console.error("URI was not removed from images.");
            throw new Error(`Failed to remove URI: ${uri}`);
        }

            await listingRef.update({ images: updatedImages });
            // console.log("Firestore update completed successfully: ", listingData);
      } catch (err) {
            console.error(
                  `Error removing image ${uri} reference from database.`,
                  err
            );
            throw new Error(
                  `Error removing image ${uri} reference from database.`
            );
      }
};

export const changeCaptionInDB = async (
    postId: string,
    uri: string,
    caption: string
): Promise<any> => {
    try {
        const listingRef = db.collection("listings").doc(postId);
        const listingDoc = await listingRef.get();

        if (!listingDoc.exists) {
            throw new Error(`Cannot find listing with ID: ${postId}`);
        }

        const listingData = listingDoc.data();
        if (!listingData) {
            throw new Error(`Cannot retrieve data for listing: ${postId}`);
        }

        if (!Array.isArray(listingData.images)) {
            throw new Error(`Listing with ID ${postId} has no images`);
        }

        const currentImages = listingData.images;
        const updatedImages = currentImages.map((image: { uri: string; caption: string }) => {
            if (decodeURIComponent(image.uri.trim()) === decodeURIComponent(uri.trim())) {
                // console.log(`Updating caption for URI: ${image.uri}`);
                return { ...image, caption: caption };
            }
            return image;
        });

        const uriExists = updatedImages.some(
            (image: { uri: string; caption: string }) =>
                decodeURIComponent(image.uri.trim()) === decodeURIComponent(uri.trim())
        );

        if (!uriExists) {
            throw new Error(`Image URI not found in listing: ${postId}`);
        }

        await listingRef.update({ images: updatedImages });

        const updatedDoc = await listingRef.get();
        const data = updatedDoc.data();

        if (!data) {
          throw new Error('listing not found');
          return null;
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
          postId: data.postId
    };
    } catch (err) {
        console.error(`Error updating caption for image ${uri} in listing ${postId}.`, err);
        throw new Error(`Error updating caption for image ${uri} in listing ${postId}.`);
    }
}

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
