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
import { generateCoordinatesByAddress, generateCoordinatesByZipcode, generateGeo } from "../services/geolocateService";
import { getFilePathFromURI, removeImageInFirebase, uploadImageToFirebase } from "../services/imageService";
import { BadRequestError, InternalServerError, UnauthorizedError } from "../middlewares/errors";
// import { hashUid } from "./usersController";

export const fetchListings = async (req: Request, res: Response, next: NextFunction) => {
    const { lat, long, radius, categories, zipcode } = req.query;
    //   console.log("fetchListings called");

    try {
        // added auth
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        let latitude: number | undefined;
        let longitude: number | undefined;

        if (!lat && !long) {
            // if no lat or long provided in request, try to use zipcode instead
            if (!zipcode) {
                throw new BadRequestError("No location provided.");
            }

            // convert zipcode to an integer
            const zip = parseInt(zipcode as string);
            // get lat and long from geoapify using zipcode
            const coordinates = await generateCoordinatesByZipcode(zip);
            if (coordinates) {
                ({ latitude, longitude } = coordinates);
            } else {
                throw new BadRequestError("Invalid zipcode or location.");
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
                parsedCategories = (categories as string).split(",").map((cat) => cat.trim());
            } catch (error) {
                throw new BadRequestError("Invalid categories format.");
            }
        }

        // call query function in services with formatted filters
        const listings = await getListings({
            lat: latitude,
            long: longitude,
            radius: searchRadius,
            categories: parsedCategories,
        });
        return res.status(200).json({ listings });
    } catch (err) {
        next(err);
    }
};

export const fetchSingleListing = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    //   console.log("fetchListings called");

    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!postId) {
            throw new BadRequestError("No postId provided.");
        }
        // call query function in services with formatted filters
        const listing = await getListing(postId);

        return res.status(200).json({ listing });
    } catch (err) {
        next(err);
    }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }
        const { title, description, address, dates, startTime, endTime, categories, subcategories } = req.body;

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
            throw new BadRequestError(`Missing required fields: ${missingFields.join(", ")}.`);
        }

        // generate timestamp for generatedAt (format = YYYY-MM-DDTHH:mm:ss.sssZ )
        const now = new Date();
        const generatedAt = now.toISOString();

        // generate status based on the current date, sale date, and start time.
        let status: Status;

        const today = new Date().toISOString().split("T")[0];
        if (dates.some((date: string) => date === today)) {
            status = "active"; // Sale is today
        } else if (dates.some((date: string) => new Date(date) > new Date(today))) {
            status = "upcoming"; // Sale is in the future
        } else {
            status = "archived"; // Sale is in the past
        }

        // call api to get coordinates from address (geoapify)
        const coordinates = await generateCoordinatesByAddress(address);
        if (!coordinates) {
            throw new InternalServerError("Geolocation data by address could not be retrieved.");
        }
        const { latitude, longitude } = coordinates;

        // call func to get geohash and geopoint from coordinates
        const geolocation = await generateGeo(latitude, longitude);
        if (!geolocation) {
            throw new InternalServerError("Geolocation data could not be retrieved.");
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
        next(err);
    }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }
        // console.log(req.file)
        const { postId } = req.params;
        const updatedFields = { ...req.body };

        if (!postId) {
            throw new BadRequestError("No postId provided.");
        }

        if (Object.keys(updatedFields).length === 0) {
            throw new BadRequestError("No fields provided to update.");
        }

        const updatedListing = await updateListingInDB(postId, hashUid, updatedFields);

        return res.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing,
        });
    } catch (err) {
        next(err);
    }
};

export const addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        const { file } = req;

        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!file) {
            throw new BadRequestError("No image file provided.");
        }

        const imageURI = await uploadImageToFirebase(file, postId);

        const updatedListing = await addImageToListing(postId, hashUid, imageURI, caption);

        return res.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing,
        });
    } catch (err) {
        next(err);
    }
};

export const removeImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const { uri } = req.query;

        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!postId) {
            throw new BadRequestError("No postId provided.");
        }

        if (!uri || typeof uri !== "string") {
            throw new BadRequestError("No valid image URI provided.");
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
        next(err);
    }
};

export const changeCaption = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const { uri, caption } = req.body;

        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!postId) {
            throw new BadRequestError("No postId provided.");
        }

        if (!uri || typeof uri !== "string") {
            throw new BadRequestError("No valid image URI provided.");
        }

        if (!caption || typeof caption !== "string") {
            throw new BadRequestError("No valid new caption provided.");
        }

        const updatedListing = await changeCaptionInDB(postId, hashUid, uri, caption);

        res.status(200).json({
            message: "Caption updated successfully.",
            listing: updatedListing,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
    // needs auth
    try {
        const { postId } = req.params;

        const user = res.locals.user;
        const hashUid = user.hashUid;

        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!postId) {
            throw new BadRequestError("Missing postId parameter.");
        }

        const deletedListing = await removeListingInDB(postId, hashUid);

        return res.status(200).json({
            message: "Listing deleted successfully",
            listing: deletedListing,
        });
    } catch (err) {
        next(err);
    }
};
