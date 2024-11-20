// Server actions for listing management
import { Request, Response } from "express";
import { getListings } from "../services/listingService";

// fetchListings
// createListing
// updateListing
// removeListing
// addListingImage

export const fetchListings = async(req: Request, res: Response) => {
    const { lat, long, radius, categories } = req.query;
    console.log("fetchListings called");

    try {
        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(long as string);
        const searchRadius = radius ? parseInt(radius as string) : 15;
        const parsedCategories = categories ? JSON.parse(categories as string) : [];


        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Radius:", searchRadius);
        console.log("Categories:", parsedCategories);
        // call query function in services with formatted filters
        const listings = await getListings({
            lat: latitude,
            long: longitude,
            radius: searchRadius,
            categories: parsedCategories,
        });
        if (!listings) {
            console.log("No listings from fetchListings")
        }
        console.log(listings)

        res.status(200).json({ listings })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}
