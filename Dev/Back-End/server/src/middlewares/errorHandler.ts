import { Request, Response, NextFunction } from "express";

// Error handlers for actions
interface ErrorObject extends Error {
      status?: number;
}

export const errorHandler = (
      err: ErrorObject,
      req: Request,
      res: Response,
      next: NextFunction
): void => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";

      console.error(`[Error] ${status}: ${message}`);

      res.status(status).json({ status, message });
};
