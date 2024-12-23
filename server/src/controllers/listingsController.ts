// Server actions for listing management
import { NextFunction, Request, Response } from "express";
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

        if (!lat && !long && !zipcode) {
            throw new BadRequestError("No location provided. Please provide either lat/long or a zipcode.");
        }

        if ((lat && !long) || (!lat && long)) {
            throw new BadRequestError("Both latitude and longitude must be provided together.");
        }

        if (lat && long) {
            latitude = parseFloat(lat as string);
            longitude = parseFloat(long as string);
        } else if (zipcode) {
            const zip = parseInt(zipcode as string);
            if (typeof zip !== "number") {
                throw new BadRequestError("Zipcode must be a number.");
            }
            const coordinates = await generateCoordinatesByZipcode(zip);

            if (coordinates) {
                ({ latitude, longitude } = coordinates);
            } else {
                throw new BadRequestError("Invalid zipcode or location.");
            }
        } else {
            throw new BadRequestError("No location provided.");
        }

        let searchRadius = 10;

        if (radius) {
            const parsedRadius = parseInt(radius as string, 10);
            if (isNaN(parsedRadius) || parsedRadius <= 0 || parsedRadius > 100) {
                throw new BadRequestError("Radius must be a valid number between 0 and 100.");
            }
            searchRadius = parsedRadius;
        }

        let parsedCategories: string[] = [];
        if (categories) {
            try {
                const rawCategories = (categories as string).split(",").map((cat) => cat.trim());
                parsedCategories = rawCategories.filter((cat) => {
                    const isNonNumeric = isNaN(Number(cat));
                    const isNonEmptyString = typeof cat === "string" && cat.length > 0;
                    return isNonNumeric && isNonEmptyString;
                });

                if (parsedCategories.length !== rawCategories.length) {
                    throw new BadRequestError("All categories must be valid, non-numeric strings.");
                }
            } catch (error) {
                throw new BadRequestError("Invalid categories format. Categories must be a string.");
            }
        }

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
        const listing = await getListing(postId, hashUid);

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
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            throw new BadRequestError(`Missing required fields: ${missingFields.join(", ")}.`);
        }
        const allFields = {
            title,
            description,
            address,
            dates,
            startTime,
            endTime,
            categories,
            subcategories,
        };

        const expectedTypes: Record<string, string> = {
            title: "string",
            description: "string",
            address: "object",
            dates: "array",
            startTime: "string",
            endTime: "string",
            categories: "array",
            subcategories: "object",
        };

        const errors: string[] = [];
        Object.entries(allFields).forEach(([key, value]) => {
            const expectedType = expectedTypes[key];

            if (expectedType === "array" && !Array.isArray(value)) {
                errors.push(`Field [${key}] must be an array.`);
            } else if (expectedType === "object" && (typeof value !== "object" || Array.isArray(value))) {
                errors.push(`Field [${key}] must be an object.`);
            } else if (expectedType !== "array" && expectedType !== "object" && typeof value !== expectedType) {
                errors.push(`Field [${key}] must be of type [${expectedType}].`);
            }
        });
        
        const { street, city, state, zip } = address || {};
        if (!street || typeof street !== "string") errors.push(`Street address is required and must be a string.`);
        if (!city || typeof city !== "string") errors.push(`City is required and must be a string.`);
        if (!state || typeof state !== "string") errors.push(`State is required and must be a string.`);
        if (!zip || typeof zip !== "number") errors.push(`Zip code is required and must be a number.`);

        if (errors.length > 0) {
            throw new BadRequestError(errors.join(", "));
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
            message: "Listing created successfully",
            postId: newListing.postId,
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
        const allowedFields: Record<string, string> = {
            title: "string",
            description: "string",
            address: "object",
            dates: "array",
            startTime: "string",
            endTime: "string",
            categories: "array",
            subcategories: "object",
            status: "string",
        };
        const filteredFields: Record<string, any> = {};
        for (const [key, value] of Object.entries(updatedFields)) {
            if (!(key in allowedFields)) {
                throw new BadRequestError(`Field [${key}] is not a valid field, or it cannot be updated.`);
            }
            const expectedType = allowedFields[key];
            if (expectedType === "array" && !Array.isArray(value)) {
                throw new BadRequestError(`Field [${key}] must be an array.`);
            } else if (expectedType === "object" && (typeof value !== "object" || Array.isArray(value))) {
                throw new BadRequestError(`Field [${key}] must be an object.`);
            } else if (expectedType !== "array" && expectedType !== "object" && typeof value !== expectedType) {
                throw new BadRequestError(`Field [${key}] must be of type [${expectedType}].`);
            }

            filteredFields[key] = value;
        }

        if (Object.keys(filteredFields).length === 0) {
            throw new BadRequestError("No valid fields provided for update.");
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
            listing: updatedListing,
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
