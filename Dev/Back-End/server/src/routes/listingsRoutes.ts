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

// Swagger documentation: -------> Start Listings Endpoints

// Swagger documentation: Get all active and upcoming listings: GET /api/listings
/**
 * @swagger
 * /:
 *   get:
 *     summary: Fetch all active and upcoming listings
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOi..."
 *           description: Bearer token for authentication
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
 *         description: No location provided.
 *       400:
 *         description: Invalid zipcode or location.
 *       400:
 *         description: Latitude, longitude, and radius must be valid numbers.
 *       400:
 *         description: Radius must be greater than zero.
 *       404:
 *         description: No listings found matching the criteria."
 *       401:
 *         description: User not authorized.
 *       500:
 *         description: An unexpected error occurred while fetching listings.
 */

// Swagger documentation: Get one listing by postId: GET /api/listings/:postId
/**
 * @swagger
 * /api/listings/{postId}:
 *   get:
 *     summary: Fetch a single listing by postId. If listing is archived, will not retrieve unless user is owner of listing.
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
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
 *       400:
 *         description: Bad Request: No postId provided
 *       400:
 *         description: Listing no longer available.
 *       404:
 *         description: Listing with ID "[postId]" not found.
 *       401:
 *         description: User not authorized.
 *       500:
 *         description: An unexpected error occurred while fetching the listing.
 *       500:
 *         description: Listing with postId "[postId]" could not be retrieved.
 */

// Swagger documentation: Create a listing: POST /api/listings
/**
 * @swagger
 * /api/listings
 *   post:
 *     summary: Create a new listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Listing created successfully"
 *                 postId:
 *                   type: string
 *                   example: "asdfnj24n52..."
 *       400:
 *         description: Missing required fields: [Missing fields]
 *       401:
 *         description: User not authorized.
 *       500:
 *         description: An unexpected error occurred while posting the listing.
 *       500:
 *         description: Failed to confirm creation of listing with ID "${postId}".
 */

// Swagger documentation: Update an existing listing: PUT /api/listings/:postId
/**
 * @swagger
 * /api/listings/{postId}:
 *   put:
 *     summary: Update a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Listing updated successfully"
 *                 listing:
 *                   $ref: '#/components/schemas/publicListing'
 *       400:
 *         description: No postId provided.
 *       400:
 *         description: No fields provided to update.
 *       404:
 *         description: Listing with ID "[postId]" not found.
 *       401:
 *         description: User not authorized.
 *       401:
 *         description: User not permitted to change this listing.
 *       500:
 *         description: An unexpected error occurred while updating the listing.
 *       500:
 *         description: Failed to confirm update for listing ID "[postId]".
 *       500:
 *         description: Failed to retrieve data for listing ID "[postId]".
 */

// Swagger documentation: Delete a listing: DEL /api/listings/:postId
/**
 * @swagger
 * /api/listings/{postId}:
 *   delete:
 *     summary: Delete a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing
 *     responses:
 *       200:
 *         description: Listing removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Listing deleted successfully"
 *                 listing:
 *                   type: object
 *                   properties:
 *                     title: string
 *                       type: string
 *                       example: "Estate Sale"
 *                     postId: string
 *                       type: string
 *                       example: "as44n53js..."
 *       400:
 *         description: No postId provided.
 *       400:
 *         description: No fields provided to update.
 *       404:
 *         description: Listing not found.
 *       401:
 *         description: User not authorized.
 *       401:
 *         description: User not permitted to update this listing.
 *       500:
 *         description: An unexpected error occurred while deleting the listing.
 *       500:
 *         description: Failed to confirm update for listing ID "[postId]".
 *       500:
 *         description: Listing data could not be retrieved.
 */

// Swagger documentation: Add an image to an existing listing: POST /api/listings/:postId/images
/**
 * @swagger
 * /api/listings/{postId}/images:
 *   post:
 *     summary: Upload an image for an existing listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
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
 *         description: Listing updated successfully with new image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Listing updated successfully"
 *                 listing:
 *                   $ref: '#/components/schemas/publicListing'
 *       400:
 *         description: No image file provided.
 *       404:
 *         description: Listing with ID "[postId]" not found.
 *       401:
 *         description: User not authorized.
 *       401:
 *         description: User not permitted to update this listing.
 *       500:
 *         description: An unexpected error occurred while adding an image to the listing.
 *       500:
 *         description: Failed to confirm image update for listing ID "[postId]".
 *       500:
 *         description: Failed to retrieve data for listing ID "[postId]".
 */

// Swagger documentation: Update a caption to an existing listing: PUT /api/listings/:postId/images
/**
 * @swagger
 * /api/listings/{postId}/images:
 *    put:
 *     summary: Updates an image caption
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
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
 *             properties:
 *               uri:
 *                 type: string
 *                 description: uri of the image uploaded
 *               caption:
 *                 type: string
 *                 description: new caption for the image
 *     responses:
 *       200:
 *         description: Image removed from listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Caption updated successfully"
 *                 listing:
 *                   $ref: '#/components/schemas/publicListing'
 *       400:
 *         description: No vaild image URI provided.
 *       400:
 *         description: No postId provided.
 *       400:
 *         description: No valid new caption provided.
 *       404:
 *         description: Listing with ID [postId] not found.
 *       404:
 *         description: No images found for listing ID "[postId]"
 *       404:
 *         description: Image URI "[uri]" not found in listing ID "[postId]"
 *       401:
 *         description: User not authorized.
 *       401:
 *         description: User not permitted to update this listing.
 *       500:
 *         description: An unexpected error occurred while updating the caption for the listing.
 *       500:
 *         description: Failed to confirm caption update for listing ID "[postId]".
 *       500:
 *         description: Failed to retrieve data for listing ID "[postId]".
 */

// Swagger documentation: Delete an image of an existing listing: DEL /api/listings/:postId/images
/**
 * @swagger
 * /api/listings/{postId}/images:
 *    delete:
 *     summary: Removes an image from a listing
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOi..."
 *         description: Bearer token for authentication
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the listing
 *       - name: uri
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Public URI of the image to delete
 *     responses:
 *       200:
 *         description: Image removed from listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Image removed successfully"
 *                 listing:
 *                   $ref: '#/components/schemas/publicListing'
 *       400:
 *         description: No vaild image URI provided.
 *       400:
 *         description: No postId provided.
 *       404:
 *         description: Listing with ID [postId] not found.
 *       404:
 *         description: No images found for listing ID "[postId]"
 *       404:
 *         description: Image URI "[uri]" not found in listing ID "[postId]"
 *       401:
 *         description: User not authorized.
 *       401:
 *         description: User not permitted to update this listing.
 *       500:
 *         description: An unexpected error occurred while deleting the image for the listing.
 *       500:
 *         description: Failed to confirm image removal for listing ID "[postId]".
 *       500:
 *         description: Failed to retrieve data for listing ID "[postId]".
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
