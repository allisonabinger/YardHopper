import * as multer from 'multer';
import path from "path"
import { db, storage } from '../config/firebase';
import { v4 as uuidv4 } from "uuid"
import { ENV } from '../config/environment';

// ads image to firebase and returns uri
export const uploadImageToFirebase = async (file: Express.Multer.File, postId: string): Promise<string> => {
    const imageId = uuidv4();
    const fileName = `${imageId}-${file.originalname}`;

    const imagePath = `listings/${postId}/${fileName}`;

    try {
        const fileUpload = storage.bucket().file(imagePath);

        await fileUpload.save(file.buffer, {
            contentType: file.mimetype,
            public: true
        });

        const fileUri = fileUpload.publicUrl()
        return fileUri;
    } catch (err) {
        console.error("Error uploading image to Firebase", err);
        throw new Error("Error uploading image to Firebase");
    }
}

// removes image stored in Firebase from bucket
export const removeImageInFirebase = async (filePath: string): Promise<void> => {
    try {
        const file = storage.bucket().file(filePath);

        await file.delete();

        console.log(`Successfully deleted file: ${file}`)
    } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
        throw new Error(`Error deleting file: ${filePath}`);
    }
}

export const removeFolderInFirebase = async (folderPath: string): Promise<void> => {
    try {
        const [files] = await storage.bucket().getFiles({ prefix: folderPath });

        if (files.length === 0) {
            console.log(`No files found in folder: ${folderPath}`);
            return;
        }

        const deletePromises = files.map(file => file.delete());
        await Promise.all(deletePromises);

        console.log(`Successfully delete all images in the folder: ${folderPath}`)
    } catch (err) {
        console.error(`Error deleting files in folder: ${folderPath}`, err);
        throw new Error(`Error deleting files in folder: ${folderPath}`);
    }
}

export const getFilePathFromURI = (imageURI: string): string => {

    const bucketBaseURL = `https://storage.googleapis.com/${ENV.FIREBASE_STORAGE_BUCKET}`;

    if (!imageURI.startsWith(bucketBaseURL)) {
        throw new Error("Invalid image URI.")
    }
    const encodedPath = imageURI.replace(bucketBaseURL, "")
    const decodedPath = decodeURIComponent(encodedPath)
    return decodedPath.startsWith("/") ? decodedPath.slice(1) : decodedPath;

}
