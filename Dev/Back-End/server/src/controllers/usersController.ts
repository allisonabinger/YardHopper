// Server actions for user management
import { NextFunction, Request, Response } from "express";
import { createHash } from "crypto";
import { getUserProfile, makeUserProfile, updateUserProfile } from "../services/userService";
import { User } from "../models/userModel";

export const hashUid = (uid: string): string => {
  return createHash("sha256").update(uid).digest("hex");
};

// export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const 
//     }
// }

export const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid
        // console.log(`fetchUserProfile - hashuid: ${hashUid}`)
        const userProfile = await getUserProfile(hashUid);

        // console.log(`fetchUserProfile - userProfile: ${userProfile}`)
        if (!userProfile) {
            return next({ status: 404, message: "User profile not found" });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.log(`Error occured in fetchUserProfile: ${err}`)
        next(err)
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const {userDetails} = req.body
    try {
        if (!userDetails || typeof userDetails !== "object") {
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
        console.log(`Error occured in createUserProfile: ${err}`)

        next(err)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const updatedFields = { ...req.body };
    try {
        console.log("Request body received:", req.body);
        if (!updatedFields || typeof updatedFields !== "object") {
            return res.status(400).json({ error: "Invalid or missing user details in the request body" });
        }
        const restrictedFields = ["email", "createdAt"];
        restrictedFields.forEach(field => delete updatedFields[field]);
        
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
        console.log(`Error occured in createUserProfile: ${err}`)

        next(err)
    }
}
// export const getUserId = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { uid } = req.body;
//     if (!uid) {
//       res.status(400).json({ error: "Missing required field: uid" });
//       return;
//     }

//     const hashedUserId = hashUid(uid);
//     res.status(200).json({ userId: hashedUserId });
//   } catch (error) {
//     console.error("Error hashing UID:", error);
//     res.status(500).json({ error: "Failed to generate hashed userId" });
//   }
// };
