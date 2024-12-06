// Authentication Middleware for users
// Validates request, Extracts uid and email from decoded token, and generates hashUid to attach to req.user

import {auth} from "../config/firebase"
import { Request, Response, NextFunction, RequestHandler } from "express";
import { hashUid } from "../controllers/usersController"; 

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next({ status: 401, message: "Unauthorized: Missing token" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid
      const hashedUid = hashUid(uid)
      const user = { hashUid: hashedUid, uid: uid }

      res.locals.user = user;
      next();
    } catch (error) {
    //   console.error("Authentication error:", error);
      return next({ status: 403, message: "Invalid or expired token" });
    }
  };

// export const authenticateUser: RequestHandler = async (req, res, next): Promise<void> => {
//     const authHeader = req.headers.authorization;
  
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return;
//     }
  
//     const idToken = authHeader.split("Bearer ")[1];
  
//     try {
//       const decodedToken = await auth.verifyIdToken(idToken);
//       req.user = {
//         uid: decodedToken.uid,
//         email: decodedToken.email || "",
//         hashUid: hashUid(decodedToken.uid),
//       };
//       next();
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       return res.status(403).json({ error: "Unauthorized: Invalid token" });
//     }
//   };
