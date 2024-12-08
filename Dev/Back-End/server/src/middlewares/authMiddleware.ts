// Authentication Middleware for users
// Validates request, Extracts uid and email from decoded token, and generates hashUid to attach to req.user

import { auth } from "../config/firebase";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { createHash } from "crypto";
import { ForbiddenError, UnauthorizedError } from "./errors";

export const hashUid = (uid: string): string => {
    return createHash("sha256").update(uid).digest("hex");
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Unauthorized: Missing token."));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const hashedUid = hashUid(uid);
        const user = { hashUid: hashedUid, uid: uid };

        res.locals.user = user;
        next();
    } catch (error) {
        //   console.error("Authentication error:", error);
        return next(new ForbiddenError("Invalid or expired token."));
    }
};
