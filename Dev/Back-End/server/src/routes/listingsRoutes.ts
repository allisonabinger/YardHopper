// routes for listing management
import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import {
    addImage,
      changeCaption,
      createListing,
      deleteListing,
      fetchListings,
      removeImage,
      updateListing,
} from "../controllers/listingsController";
// import { authenticate } from "../middlewares/authMiddleware"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /:
 *   get:
 *     summary: Fetch all listings
 *     tags:
 *       - Listings
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Latitude of the area to search for listings
 *       - name: lng
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Longitude of the area to search for listings
 *       - name: zipcode
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Zip code to search for listings
 *     responses:
 *       200:
 *         description: A list of listings matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
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


router.get("/", (req: Request, res: Response) => {
      fetchListings(req, res);
});

router.post("/", (req: Request, res: Response) => {
      createListing(req, res);
});

// put request for text fields (title, description, etc)
router.put("/:postId", (req: Request, res: Response) => { updateListing(req, res);});

// put request for uploading images
router.post("/:postId/images", upload.single("image"), (req: Request, res: Response) => { addImage(req, res);});

// update caption for a specific image
router.put("/:postId/images", (req: Request, res: Response) => { changeCaption(req, res);});

// deletes an image from a listing
router.delete("/:postId/images", (req: Request, res: Response) => { removeImage(req, res);});

router.delete("/:postId", (req: Request, res: Response) => { deleteListing(req, res);});

export default router;
