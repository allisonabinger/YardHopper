import * as multer from 'multer';
import path from "path"
import { storage } from '../config/firebase';
import { v4 as uuidv4 } from "uuid"

export const uploadImageToFirebase = async (file: Express.Multer.File, postId: string): Promise => {
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
