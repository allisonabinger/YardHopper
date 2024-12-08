import * as multer from "multer";
import path from "path";
import { db, storage } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/environment";
import { BadRequestError, InternalServerError, NotFoundError } from "../middlewares/errors";

// Uploads image to firebase and returns uri
export const uploadImageToFirebase = async (file: Express.Multer.File, postId: string): Promise<string> => {
    const imageId = uuidv4();
    const fileName = `${imageId}-${file.originalname}`;

    const imagePath = `listings/${postId}/${fileName}`;

    try {
        const bucket = storage.bucket();
        const fileUpload = bucket.file(imagePath);

        if (!fileUpload) {
            throw new NotFoundError("Unable to find image in Firebase storage.");
        }
        await fileUpload.save(file.buffer, {
            contentType: file.mimetype,
            public: false,
        });
        const encodedPath = encodeURIComponent(imagePath);
        const fileUri = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
        return fileUri;
    } catch (err) {
        if (!(err instanceof NotFoundError)) {
            throw new InternalServerError(
                `An unexpected error occurred while uploading the image to Firebase Storage. Path: ${imagePath}`
            );
        }
        throw err;
    }
};

// removes image stored in Firebase from bucket
export const removeImageInFirebase = async (filePath: string): Promise<void> => {
    try {
        const file = storage.bucket().file(filePath);
        if (!file) {
            throw new NotFoundError(`File not found at path: ${filePath}`);
        }
        await file.delete();
    } catch (err) {
        if (!(err instanceof NotFoundError)) {
            throw new InternalServerError(`An unexpected error occurred while deleting the file at path: ${filePath}`);
        }
        throw err;
    }
};

export const removeFolderInFirebase = async (folderPath: string): Promise<void> => {
    try {
        const [files] = await storage.bucket().getFiles({ prefix: folderPath });

        if (!files || files.length === 0) {
            throw new NotFoundError(`No files found in folder: ${folderPath}`);
        }

        const deletePromises = files.map((file) => file.delete());
        await Promise.all(deletePromises);
    } catch (err) {
        if (!(err instanceof NotFoundError)) {
            throw new InternalServerError(`An unexpected error occurred while deleting files in folder: ${folderPath}`);
        }
        throw err;
    }
};

// obtains the file path of an image in firebase based on public uri
export const getFilePathFromURI = (imageURI: string): string => {
    try {
        const bucketBaseURL = `https://firebasestorage.googleapis.com/v0/b/${ENV.FIREBASE_STORAGE_BUCKET}/o/`;

        if (!imageURI.startsWith(bucketBaseURL)) {
            throw new BadRequestError(`Invalid image URI: ${imageURI}`);
        }
        const encodedPath = imageURI.replace(bucketBaseURL, "").split("?")[0];
        const decodedPath = decodeURIComponent(encodedPath);
    
        return decodedPath;
    } catch (err) {
        if (!(err instanceof BadRequestError)) {
            throw new InternalServerError(`Error decoding image URI: ${imageURI}`);
        }
        throw err;
    }
};
