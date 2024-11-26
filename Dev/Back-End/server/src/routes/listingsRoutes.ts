// routes for listing management
import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import {
    addImage,
      createListing,
      fetchListings,
      updateListing,
} from "../controllers/listingsController";
// import { authenticate } from "../middlewares/authMiddleware"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req: Request, res: Response) => {
      fetchListings(req, res);
});

router.post("/", (req: Request, res: Response) => {
      createListing(req, res);
});

// put request for text fields (title, description, etc)
router.put("/:postId", (req: Request, res: Response) => { updateListing(req, res);});

// put request for uploading images
router.put("/:postId/images", upload.single("image"), (req: Request, res: Response) => { addImage(req, res);});

// router.delete("/listing/:listingId", removeListing);

export default router;
