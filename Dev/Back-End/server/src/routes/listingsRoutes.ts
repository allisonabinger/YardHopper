// routes for listing management
import express from "express";
import { Request, Response } from "express";
import { createListing, fetchListings } from "../controllers/listingsController";
// import { authenticate } from "../middlewares/authMiddleware"

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    fetchListings(req, res);
  });
  
  router.post("/", (req: Request, res: Response) => {
    createListing(req, res);
  });
  
// router.put("/listing/:listingId", updateListing);
// router.put("/listing/:listingId/images", addListingImage)
// router.delete("/listing/:listingId", removeListing);

export default router
