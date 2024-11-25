// routes for listing management
import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import { createListing, fetchListings } from "../controllers/listingsController";
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

// router.put(
//   "/:postId",
//   upload.single("image"),
//   (req: Request, res: Response) => {
//     updateListing(req, res);
//   }
// );

// router.put("/listing/:listingId", updateListing);
// router.put("/listing/:listingId/images", addListingImage)
// router.delete("/listing/:listingId", removeListing);

export default router;
