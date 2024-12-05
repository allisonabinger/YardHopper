// usersRouters - routes for user management
import { createUser, fetchUser, updateUser } from "../controllers/usersController";
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
// router.post("/", authenticateUser, createUser)

// // update user
// router.put("/:userId", (req: Request, res: Response) => {
//     updateUser(req, res);
// });

// // get all listings saved by a user
// router.get("/:userId/saved", (req: Request, res: Response) => {
//       createListing(req, res);
// });

// // add a new listing to a user's saved listings
// router.post("/:userId/saved")

// // get all listings made my a user
// router.get("/:userId/listings")

export default router;
