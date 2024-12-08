// Server actions for user management
import { NextFunction, Request, Response } from "express";
import {
    getSavedListings,
    getUserListings,
    getUserProfile,
    makeUserProfile,
    removeUser,
    saveListingToUser,
    unsaveListingToUser,
    updateUserProfile,
} from "../services/userService";

export const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;
        // console.log(`fetchUserProfile - hashuid: ${hashUid}`)
        const userProfile = await getUserProfile(hashUid);

        // console.log(`fetchUserProfile - userProfile: ${userProfile}`)
        if (!userProfile) {
            return next({ status: 404, message: "User profile not found" });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.log(`Error occured in fetchUserProfile: ${err}`);
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userDetails = { ...req.body };
    try {
        if (!userDetails) {
            return res.status(400).json({ error: "Invalid or missing user details in the request body" });
        }
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }
        const newUserProfile = await makeUserProfile(user.hashUid, user.uid, userDetails);

        res.status(201).json({
            message: "User profile created successfully",
            data: newUserProfile,
        });
    } catch (err) {
        console.log(`Error occured in createUserProfile: ${err}`);

        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }
        await removeUser(user.hashUid, user.uid);

        res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
        console.log(`Error occured in deleteUser: ${err}`);
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const updatedFields = { ...req.body };
    try {
        console.log("Request body received:", req.body);
        if (!updatedFields || typeof updatedFields !== "object") {
            return res.status(400).json({ error: "Invalid or missing user details in the request body" });
        }
        const restrictedFields = ["email", "createdAt"];
        restrictedFields.forEach((field) => delete updatedFields[field]);

        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }
        const updatedUserDetails = await updateUserProfile(user.hashUid, user.uid, updatedFields);

        res.status(201).json({
            message: "User profile updated successfully",
            data: updatedUserDetails,
        });
    } catch (err) {
        console.log(`Error occured in createUserProfile: ${err}`);

        next(err);
    }
};

export const fetchUserListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;
        // console.log(`fetchUserProfile - hashuid: ${hashUid}`)
        const userListings = await getUserListings(hashUid);

        // console.log(`fetchUserProfile - userProfile: ${userProfile}`)
        if (!userListings) {
            return next({ status: 404, message: "User has not made any listings" });
        }
        res.status(200).json(userListings);
    } catch (err) {
        console.log(`Error occured in fetchUserProfile: ${err}`);
        next(err);
    }
};

export const fetchSavedListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;

        if (!user || !user.hashUid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }

        const savedListings = await getSavedListings(user.hashUid);

        if (!savedListings.length) {
            return res.status(200).json({
                message: "No saved listings yet!",
                listings: [],
            });
        }

        res.status(200).json({ savedListings });
    } catch (error) {
        console.error("Error in getSavedListingsController:", error);
        next(error);
    }
};

export const saveListing = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.body;
    try {
        if (!postId) {
            return res.status(400).json({ error: "Missing postId in the request body" });
        }
        const user = res.locals.user;
        if (!user || !user.hashUid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }
        const savedListings = await saveListingToUser(user.hashUid, postId);

        res.status(201).json({ message: `Listing ${postId} added to user's saved listings`, savedListings: savedListings });
    } catch (err) {
        next(err);
    }
};

export const unsaveListing = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.body;
    try {
        if (!postId) {
            return res.status(400).json({ error: "Missing postId in the request body" });
        }
        const user = res.locals.user;
        if (!user || !user.hashUid) {
            return res.status(403).json({
                error: "Unauthorized request. User details not found.",
            });
        }
        const savedListings = await unsaveListingToUser(user.hashUid, postId);

        res.status(201).json({ message: `Listing ${postId} removed from user's saved listings`, savedListings: savedListings });
    } catch (err) {
        next(err);
    }
};
