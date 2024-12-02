// Authentication Middleware for users

import {auth} from "../config/firebase"
import { Request, Response, NextFunction } from "express";
import { hashUid } from "../controllers/usersController"; 

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // verify firebase auth token
        const decodedToken = await auth.verifyIdToken(token);
        const hashedUid = hashUid(decodedToken.uid);

        req.user = {
            uid: decodedToken.uid,
            hashedUid: hashUid(decodedToken.uid),
          };

        next();
    } catch (err) {
        console.error("Auth failed: ", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
