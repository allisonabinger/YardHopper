// index.ts - Main router for all routes
import express from "express";
import listingsRoutes from "./listingsRoutes"
import usersRoutes from "./usersRoutes";

const router = express.Router();

router.use("/listings", listingsRoutes);
router.use("/users", usersRoutes);

export default router
