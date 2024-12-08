// usersRouters - routes for user management
import {
    createUser,
    deleteUser,
    fetchSavedListings,
    fetchUser,
    fetchUserListings,
    saveListing,
    unsaveListing,
    updateUser,
} from "../controllers/usersController";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints for managing users.
 */

// Swagger documentation: -------> Start User Endpoints

// Swagger documentation: Get a user's profile: GET /api/users/me
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Fetch the authenticated user's profile
 *     tags:
 *       - Users
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first:
 *                   type: string
 *                   example: "John"
 *                 last:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "test@test.com"
 *                 street:
 *                   type: string
 *                   example: "15 N Cheyenne Ave"
 *                 city:
 *                   type: string
 *                   example: "Tulsa"
 *                 state:
 *                   type: string
 *                   example: "OK"
 *                 zipcode:
 *                   type: integer
 *                   example: 74103
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-03T16:17:33Z"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       404:
 *         description: User profile not found.
 *       500:
 *         description: Internal server error. Unable to retrieve user profile.
 */

// Swagger documentation: Create a new user profile: POST /api/users/create


// Swagger documentation: Delete a user's account and profile: DEL /api/users/me


// Swagger documentation: Update details of an existing user profile: PUT /api/users/update


// Swagger documentation: Get all listings a user has made: GET /api/users/listings


// Swagger documentation: Get all listings a user has saved: GET /api/users/savedListings


// Swagger documentation: Add a listing to a user's saved listings: POST /api/users/savedListings


// Swagger documentation: Remove a listing from a user's saved listings: DELETE /api/users/savedListings


router.get("/me", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchUser(req, res, next);
});

router.post("/create", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    createUser(req, res, next);
});

router.delete("/me", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    deleteUser(req, res, next);
});

router.put("/update", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    updateUser(req, res, next);
});

router.get("/listings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchUserListings(req, res, next);
});

router.get("/savedListings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchSavedListings(req, res, next);
});

router.post("/savedListings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    saveListing(req, res, next);
});

router.delete("/savedListings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    unsaveListing(req, res, next);
});

export default router;
