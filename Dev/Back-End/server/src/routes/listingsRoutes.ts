// routes for listing management
import express from "express";
import { fetchListings } from "../controllers/listingsController";
// import { authenticate } from "../middlewares/authMiddleware"

const router = express.Router();

router.get("/", fetchListings);
// router.post("/listings", createListing);
// router.put("/listing/:listingId", updateListing);
// router.put("/listing/:listingId/images", addListingImage)
// router.delete("/listing/:listingId", removeListing);

export default router
