// Service layer for Firestore (listing)
import { db } from "../config/firebase"

export const getListings = async ({ lat, lng, radius, categories }: any) => {
    const listingsRef = db.collection("listings");
    // only get listings that are active or upcoming
    let activeQuery = listingsRef.where("status", "==", "active");
    let upcomingQuery = listingsRef.where("status", "==", "upcoming");

    const [activeSnap, upcomingSnap] = await Promise.all([
        activeQuery.get(),
        upcomingQuery.get(),
    ])

    let listings = [...activeSnap.docs, ...upcomingQuery.docs].map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // put location filtering logic here
    return listings;
}
