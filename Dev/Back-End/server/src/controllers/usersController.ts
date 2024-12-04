// Server actions for user management
import { NextFunction, Request, Response } from "express";
import { createHash } from "crypto";
import { getUserProfile } from "../services/userService";

export const hashUid = (uid: string): string => {
  return createHash("sha256").update(uid).digest("hex");
};

// export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const 
//     }
// }

export const fetchUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const hashUid = user.hashUid
        console.log(`fetchUserProfile - hashuid: ${hashUid}`)
        const userProfile = await getUserProfile(hashUid);

        console.log(`fetchUserProfile - userProfile: ${userProfile}`)
        if (!userProfile) {
            return next({ status: 404, message: "User profile not found" });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.log(`Error occured in fetchUserProfile: ${err}`)
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
