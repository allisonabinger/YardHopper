// Server actions for listing management
import { Request, Response } from "express";
import {
    addImageToListing,
    changeCaptionInDB,
    getListing,
    getListings,
    postListing,
    removeImageInDB,
    removeListingInDB,
    updateListingInDB,
} from "../services/listingService";
import { Listing, Status } from "../models/listingModel";
import {
    generateCoordinatesByAddress,
    generateCoordinatesByZipcode,
    generateGeo,
} from "../services/geolocateService";
import {
    getFilePathFromURI,
    removeImageInFirebase,
    uploadImageToFirebase,
} from "../services/imageService";
import { hashUid } from "./usersController";

export const fetchListings = async (req: Request, res: Response) => {
    const { lat, long, radius, categories, zipcode } = req.query;
    //   console.log("fetchListings called");

    try {
        // added auth
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            return res.status(400).json({ error: "User not authorized." });
        }

        let latitude: number | undefined;
        let longitude: number | undefined;

        if (!lat && !long) {
            // if no lat or long provided in request, try to use zipcode instead
            if (!zipcode) {
                // if not lat, long, or zipcode provided, listings cannot be fetched
                // console.error("No location provided");
                return res.status(400).json({ error: "No location provided." });
            }

            // convert zipcode to an integer
            const zip = parseInt(zipcode as string);
            // get lat and long from geoapify using zipcode
            const coordinates = await generateCoordinatesByZipcode(zip);
            if (coordinates) {
                ({ latitude, longitude } = coordinates);
            } else {
                // console.error("Failed to generate coordinates form zipcode");
                return res
                    .status(500)
                    .json({ error: "Invalid zipcode or location" });
            }
        } else {
            // if lat and long provided, convert them to integers and use them
            latitude = parseFloat(lat as string);
            longitude = parseFloat(long as string);
        }
        // declare search radius
        const searchRadius = radius ? parseInt(radius as string) : 10;

        // handle categories as json structure or as string
        let parsedCategories: string[] = [];
        if (categories) {
            try {
                parsedCategories = (categories as string)
                    .split(",")
                    .map((cat) => cat.trim());
            } catch (error) {
                return res
                    .status(400)
                    .json({ error: "Invalid categories format" });
            }
        }

        // call query function in services with formatted filters
        const listings = await getListings({
            lat: latitude,
            long: longitude,
            radius: searchRadius,
            categories: parsedCategories,
        });
        if (!listings) {
            console.log("No listings from fetchListings");
        }
        // console.log(listings)

        res.status(200).json({ listings });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const fetchSingleListing = async (req: Request, res: Response) => {
    const { postId } = req.params;
    //   console.log("fetchListings called");

    const user = res.locals.user;
    const hashUid = user.hashUid;

    if (!user || !hashUid) {
        return res.status(400).json({ error: "User not authorized." });
    }
    try {
        if (!postId) {
            return res.status(400).json({ message: "No postId provided." });
        }
        // call query function in services with formatted filters
        const listing = await getListing(postId);
        if (!listing) {
            console.log("No listing with postId: ", postId);
            res.status(500).json({
                message: "No listing found with that id.",
            });
        }
        // console.log(listings)

        res.status(200).json({ listing });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

export const createListing = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            return res.status(400).json({ error: "User not authorized." });
        }
        const {
            title,
            description,
            address,
            dates,
            startTime,
            endTime,
            categories,
            subcategories,
        } = req.body;
        
        const requiredFields = {
            title,
            description,
            address,
            dates,
            startTime,
            endTime,
            categories,
        };
        
        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value) // Check for missing fields
            .map(([key]) => key); // Collect field names
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(", ")}.`,
            });
        }

        // generate timestamp for generatedAt (format = YYYY-MM-DDTHH:mm:ss.sssZ )
        const now = new Date();
        const generatedAt = now.toISOString();

        // generate status based on the current date, sale date, and start time.
        let status: Status;

        const today = new Date().toISOString().split("T")[0];
        if (dates.some((date: string) => date === today)) {
            status = "active"; // Sale is today
        } else if (
            dates.some((date: string) => new Date(date) > new Date(today))
        ) {
            status = "upcoming"; // Sale is in the future
        } else {
            status = "archived"; // Sale is in the past
        }
        // call api to get coordinates from address (geoapify)
        const coordinates = await generateCoordinatesByAddress(address);
        if (!coordinates) {
            throw new Error("Could not retrieve coodinates");
        }
        const { latitude, longitude } = coordinates;

        // call func to get geohash and geopoint from coordinates
        const geolocation = await generateGeo(latitude, longitude);
        if (!geolocation) {
            return res.status(500).json({
                message: "Unable to generate geolocation data.",
            });
        }

        // insert authentication here to attach userId
        // call user auth and attach userId to listingData below:
        const listingData: Omit<Listing, "images" | "postId"> = {
            title,
            description,
            address,
            dates,
            startTime,
            endTime,
            categories,
            subcategories,
            generatedAt: generatedAt,
            status: status,
            g: geolocation,
            userId: hashUid,
        };

        const newListing = await postListing(listingData);
        return res.status(201).json({
            "Listing created with new postId": newListing.postId,
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Failed to create listing. Internal Server Error",
        });
    }
};

export const updateListing = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            return res.status(400).json({ error: "User not authorized." });
        }
        // console.log(req.file)
        const { postId } = req.params;
        const updatedFields = { ...req.body };

        // if (req.file) {
        //     const {file, body: {caption}} = req;
        //     const imageURI = await uploadImageToFirebase(file, postId)

        //     // console.log(imageURI)
        //     updatedFields.images = updatedFields.images || [];
        //     updatedFields.images.push({uri: imageURI, caption})
        //     // console.log("Updated Fields: ", updatedFields)
        // }

        if (!updatedFields) {
            return res
                .status(400)
                .json({ error: "No fields provided to update" });
        }

        const updatedListing = await updateListingInDB(postId, hashUid, updatedFields);

        return res.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing,
        });
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "User not permitted to change this listing") {
                return res.status(403).json({ error: err.message });
            }
            if (err.message === "Listing not found." || err.message === "Listing data could not be retrieved.") {
                return res.status(404).json({ error: err.message });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // console.error("Error updating listing: ", err);
        return res.status(500).json({ message: "Failed to update listing." });
    }
};

export const addImage = async (req: Request, res: Response) => {
    // needs auth
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        const { file } = req;

        const user = res.locals.user;
        const hashUid = user.hashUid

        if (!file) {
            return res.status(400).json({ message: "No image file provided." });
        }

        const imageURI = await uploadImageToFirebase(file, postId);

        const updatedListing = await addImageToListing(
            postId,
            hashUid,
            imageURI,
            caption
        );

        return res.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing,
        });
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "User not permitted to change this listing") {
                return res.status(403).json({ error: err.message });
            }
            if (err.message === "Listing not found." || err.message === "Listing data could not be retrieved.") {
                return res.status(404).json({ error: err.message });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // console.error("Error updating listing: ", err);
        return res.status(500).json({ message: "Failed to update listing." });
    }
};

export const removeImage = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { uri } = req.query;

        const user = res.locals.user;
        const hashUid = user.hashUid

        if (!postId) {
            return res.status(400).json({ message: "No postId provided." });
        }

        if (!uri || typeof uri !== "string") {
            return res
                .status(400)
                .json({ message: "No valid image URI provided." });
        }

        const filePath = getFilePathFromURI(uri);
        await removeImageInFirebase(filePath);
        const updatedListing = await removeImageInDB(postId, hashUid, uri);
        res.status(200).json({
            message: "Image removed successfully.",
            updatedListing: updatedListing,
        });

        // removes image in firestore
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "User not permitted to change this listing") {
                return res.status(403).json({ error: err.message });
            }
            if (err.message === "Listing not found." || err.message === "Listing data could not be retrieved.") {
                return res.status(404).json({ error: err.message });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // console.error("Error updating listing: ", err);
        return res.status(500).json({ message: "Failed to update listing." });
    }
};

export const changeCaption = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { uri, caption } = req.body;

        const user = res.locals.user;
        const hashUid = user.hashUid

        // console.log(`Caption: ${caption}`)
        if (!postId) {
            return res.status(400).json({ message: "No postId provided." });
        }

        if (!uri || typeof uri !== "string") {
            return res
                .status(400)
                .json({ message: "No valid image URI provided." });
        }

        if (!caption || typeof caption !== "string") {
            return res
                .status(400)
                .json({ message: "No valid new caption provided." });
        }

        const updatedListing = await changeCaptionInDB(postId, hashUid, uri, caption);
        if (!updatedListing) {
            return res.status(404).json({
                message: "Listing not found or image URI does not exist.",
            });
        }

        res.status(200).json({
            message: "Caption updated successfully.",
            listing: updatedListing,
        });
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "User not permitted to change this listing") {
                return res.status(403).json({ error: err.message });
            }
            if (err.message === "Listing not found." || err.message === "Listing data could not be retrieved.") {
                return res.status(404).json({ error: err.message });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // console.error("Error updating listing: ", err);
        return res.status(500).json({ message: "Failed to update listing." });
    }
};

export const deleteListing = async (req: Request, res: Response) => {
    // needs auth
    try {
        const { postId } = req.params;

        const user = res.locals.user;
        const hashUid = user.hashUid

        if (!postId) {
            return res.status(400).json({ error: "Missing postId parameter" });
        }

        const deletedListing = await removeListingInDB(postId, hashUid);

        if (!deletedListing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        return res.status(200).json({
            message: "Listing deleted successfully",
            listing: deletedListing,
        });
    } catch (err) {
        console.error("Error deleting listing: ", err);
        return res.status(500).json({ error: "Failed to delete listing" });
    }
};
