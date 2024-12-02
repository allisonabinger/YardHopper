// Server actions for user management
import { Request, Response } from "express";
import { createHash } from "crypto";

export const hashUid = (uid: string): string => {
  return createHash("sha256").update(uid).digest("hex");
};

/**
 * Endpoint to fetch hashed userId for a given uid
 * This can be used for testing or validating hash generation.
 */
export const getUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body; // Ensure UID is passed in the request body
    if (!uid) {
      res.status(400).json({ error: "Missing required field: uid" });
      return;
    }

    const hashedUserId = hashUid(uid);
    res.status(200).json({ userId: hashedUserId });
  } catch (error) {
    console.error("Error hashing UID:", error);
    res.status(500).json({ error: "Failed to generate hashed userId" });
  }
};
