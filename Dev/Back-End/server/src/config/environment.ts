// Environment var handling
export const ENV = {
    PORT: process.env.PORT || 4000,
    FIREBASE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "default-bucket",
}
