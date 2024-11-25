// Service layer for Firestore (listing)
import { Query } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { GeoFirestore } from "geofirestore";
import * as admin from "firebase-admin";
import { Listing } from "../models/listingModel";
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
        query = query.where("categories", "array-contains-any", categories);
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

export const postListing = async(listingData: Omit<Listing, "images"| "postId" | "userId"> ) => {
    try {
        const preparedListingData = {
            ...listingData,
            images: null,
            userId: null,
        };

        const listingRef = await db.collection("listings").add(preparedListingData);

        const postId = listingRef.id;

        await listingRef.update({
            postId,
        })

        console.log(`Listing ${listingData.title} posted with ID: ${postId}`);

    } catch (err) {
        console.log("Error: ", err)
        throw new Error("Error posting listing to DB")
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
