import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors";

export const jsonValidation = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof SyntaxError) {
        return next(new BadRequestError("Invalid JSON in request body. Please check your JSON syntax."));
    }
    next(err);
};
