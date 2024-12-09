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
import { BadRequestError, UnauthorizedError } from "../middlewares/errors";

export const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid;
        if (!user || !hashUid) {
            throw new UnauthorizedError("User not authorized.");
        }

        const userProfile = await getUserProfile(hashUid);
        res.status(200).json(userProfile);
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDetails = { ...req.body };
        if (!userDetails || typeof userDetails !== "object") {
            throw new BadRequestError("Missing or invalid user profile details.");
        }
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }
        const newUserProfile = await makeUserProfile(user.hashUid, user.uid, userDetails);

        res.status(201).json({
            message: "User profile created successfully",
            user: newUserProfile,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }
        await removeUser(user.hashUid, user.uid);

        res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const updatedFields = { ...req.body };
    try {
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }

        if (!updatedFields || typeof updatedFields !== "object") {
            throw new BadRequestError("Missing or invalid user profile details.");
        }

        const restrictedFields = ["email", "createdAt"];
        restrictedFields.forEach((field) => delete updatedFields[field]);


        const updatedUserDetails = await updateUserProfile(user.hashUid, user.uid, updatedFields);

        res.status(201).json({
            message: "User profile updated successfully",
            user: updatedUserDetails,
        });
    } catch (err) {
        next(err);
    }
};

export const fetchUserListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }

        const userListings = await getUserListings(user.hashUid);

        res.status(200).json(userListings);
    } catch (err) {
        next(err);
    }
};

export const fetchSavedListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }

        const savedListings = await getSavedListings(user.hashUid);

        res.status(200).json({ savedListings });
    } catch (error) {
        next(error);
    }
};

export const saveListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.body;
        if (!postId|| typeof postId !== "string") {
            throw new BadRequestError("Missing or invalid postId.");
        }
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }
        const savedListings = await saveListingToUser(user.hashUid, postId);

        res.status(201).json({
            message: `Listing ${postId} added to user's saved listings`,
            savedListings: savedListings,
        });
    } catch (err) {
        next(err);
    }
};

export const unsaveListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.body;
        if (!postId|| typeof postId !== "string") {
            throw new BadRequestError("Missing or invalid postId.");
        }
        const user = res.locals.user;
        if (!user || !user.hashUid || !user.uid) {
            throw new UnauthorizedError("User not authorized.");
        }
        const savedListings = await unsaveListingToUser(user.hashUid, postId);

        res.status(201).json({
            message: `Listing ${postId} removed from user's saved listings`,
            savedListings: savedListings,
        });
    } catch (err) {
        next(err);
    }
};
