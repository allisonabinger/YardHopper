// usersRouters - routes for user management
import { createUser, fetchUser, fetchUserListings, saveListing, unsaveListing, updateUser } from "../controllers/usersController";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// create user
// router.post("/", authenticateUser, createUser);
router.get("/me", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchUser(req, res, next);
});
// router.get("/me", authenticateUser, fetchUser)

router.post("/create", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    createUser(req, res, next);
});

router.put("/update", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    updateUser(req, res, next);
});

router.get("/listings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    fetchUserListings(req, res, next);
});

router.post("/savedListings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    saveListing(req, res, next);
});

router.delete("/savedListings", authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    unsaveListing(req, res, next);
});

// // get all listings saved by a user
// router.get("/:userId/saved", (req: Request, res: Response) => {
//       createListing(req, res);
// });

// // add a new listing to a user's saved listings
// router.post("/:userId/saved")

// // get all listings made my a user
// router.get("/:userId/listings")

export default router;
