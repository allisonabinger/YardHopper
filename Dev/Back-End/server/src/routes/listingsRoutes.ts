// routes for listing management
import express from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import {
    addImage,
    changeCaption,
    createListing,
    deleteListing,
    fetchListings,
    fetchSingleListing,
    removeImage,
    updateListing,
} from "../controllers/listingsController";
import { authenticateUser } from "../middlewares/authMiddleware";
// import { authenticate } from "../middlewares/authMiddleware"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   - name: Listings
 *     description: Endpoints for managing listings.
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: Fetch all active and upcoming listings
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Latitude of the client's area to search for listings.
 *       - name: lng
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Longitude of the client's area to search for listings.
 *       - name: zipcode
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Zip code to search for listings
 *     responses:
 *       200:
 *         description: An array of listings matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/publicListing'
 *       400:
 *         description: Bad Request: No location provided. Missing or invalid input in request.
 *       401:
 *         description: Unauthorized: User not authorized
 */

/**
 * @swagger
 * /api/listings/{postId}:
 *   get:
 *     summary: Fetch a single listing by postId. If listing is archived, will not retrieve unless user is owner of listing.
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing.
 *     responses:
 *       200:
 *         description: Listing retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listing:
 *                   $ref: '#/components/schemas/publicListing'
 *       404:
 *         description: Listing not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new listing
 *     tags:
 *       - Listings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - address
 *               - dates
 *               - startTime
 *               - endTime
 *               - categories
 *               - subcategories
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the listing
 *               description:
 *                 type: string
 *                 description: Description of the listing
 *               address:
 *                 $ref: '#/components/schemas/Listing/properties/address'
 *               dates:
 *                 type: array
 *                 description: Dates for the event
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *                 description: Start time of the event
 *               endTime:
 *                 type: string
 *                 description: End time of the event
 *               categories:
 *                 type: array
 *                 description: Categories of the listing
 *                 items:
 *                   type: string
 *               subcategories:
 *                 $ref: '#/components/schemas/Listing/properties/subcategories'
 *     responses:
 *       201:
 *         description: Listing created successfully
 */

/**
 * @swagger
 * /{postId}:
 *   put:
 *     summary: Update a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               description: Fields to update in the listing
 *               type: string
 *     responses:
 *       200:
 *         description: Listing updated successfully
 */

/**
 * @swagger
 * /{postId}/images:
 *   put:
 *     summary: Upload an image for a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               caption:
 *                 type: string
 *                 description: Optional caption for the image
 *     responses:
 *       200:
 *         description: Image added successfully
 *    delete:
 *     summary: Removes an image from a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageURI:
 *                 type: string
 *                 format: binary
 *                 description: Image path file to upload
 *               caption:
 *                 type: string
 *                 description: Caption for the image
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */

// gets all listings within a radius
router.get("/", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchListings(req, res, next);
});

// gets a single listing
router.get("/:postId", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchSingleListing(req, res, next);
});

// creates a new listing
router.post("/", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    createListing(req, res, next);
});

// put request for text fields (title, description, etc)
router.put("/:postId", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    updateListing(req, res, next);
});

// deletes the listing and any images attached to it
router.delete("/:postId", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    deleteListing(req, res, next);
});

// put request for uploading images
router.post(
    "/:postId/images",
    authenticateUser,
    upload.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        addImage(req, res, next);
    }
);

// update caption for a specific image
router.put("/:postId/images", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    changeCaption(req, res, next);
});

// deletes an image from a listing
router.delete("/:postId/images", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    removeImage(req, res, next);
});

export default router;
