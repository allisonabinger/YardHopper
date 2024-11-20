// Service layer for Firestore (listing)
import { Query } from "firebase-admin/firestore";
import { db } from "../config/firebase"
import { GeoFirestore } from "geofirestore";
import * as admin from "firebase-admin"

const geoFirestore = new GeoFirestore(db)

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

export const getListings = async ({ lat, long, radius = 15, categories }: any) => {
    console.log("getListings called");
    const geoCollection = geoFirestore.collection("listings")
    // const listingsRef = db.collection("listings");
    // only get listings that are active or upcoming
    // const snapshot = await listingsRef.where("status", "in", ["active", "upcoming"]).get()

    // geofirestore uses km
    const radiusInKm = radius * 1.60934 
    let query = geoCollection.near({
        center: new admin.firestore.GeoPoint(lat, long),
        radius: radiusInKm
    });

    query = query.where("status", "in", ["active", "upcoming"]);

    if (categories && categories.length > 0) {
        query = query.where("categories", "array-contains-any", categories);
    }
    console.log(query)

    const snapshot = await query.get()

    const listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));

    if (!listings) {
        console.log("No listings from getListings")
    }
    return listings;
}
