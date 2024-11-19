// Service layer for Firebase operations (image upload)
import { storage } from "../config/firebase";

export const uploadImage = async (file: Buffer, path: string) => {
    const bucket = storage.bucket();
    const fileRef = bucket.file(path);

    await fileRef.save(file, {
        metadata: { contentType: "image/jpeg" }
    });

    return fileRef.publicUrl
};
