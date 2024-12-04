// custom file to extend existing types for user
// sets up req.user to be used later
import { User } from "./models/userModel";

declare global {
    namespace Express {
      interface Request {
        user?: { hashUid: string, unhashedUid: string };
      }
    }
  }
