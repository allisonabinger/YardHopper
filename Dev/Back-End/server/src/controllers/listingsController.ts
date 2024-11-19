// Server actions for listing management
import { Request, Response } from "express";
import { getListings } from "../services/listingService";

// fetchListings
// createListing
// updateListing
// removeListing
// addListingImage

export const fetchListings = async(req: Request, res: Response) => {
    const { lat, lng, radius, categories } = req.query;

    try {
        // call query function in services with formatted filters
        const listings = await getListings({
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
            radius: parseInt(radius as string),
            categories: JSON.parse(categories as string)
        });

        res.status(200).json({ listings })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
