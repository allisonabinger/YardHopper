// Main router for all routes
import express from "express";
import listingsRoutes from "./listingsRoutes"

const router = express.Router();

router.use("/listings", listingsRoutes);

export default router
