import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      uid: string;
      hashedUid: string;
    };
  }
}
