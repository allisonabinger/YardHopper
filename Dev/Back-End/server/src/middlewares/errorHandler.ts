import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors"

// Error handlers for actions
interface ErrorObject extends Error {
      status?: number;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if (err instanceof AppError) {

        console.error(`[AppError] ${err.status}: ${err.message}`);
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }


    console.error(`[Unknown Error] ${err.stack || err.message}`);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
    });
};
