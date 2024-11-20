import { error } from "console";
import { db, storage } from "../config/firebase"
import seedData from "./seedData.json"
import fs from "fs"
import path from "path"

const seedDatabase = async() => {
    try {
        const listings = seedData.listings

        for (const listing of listings) {
            const docRef = db.collection("listings").doc();
            const postId = docRef.id
            const now = new Date()

            // assigns new ID to listing postId
            listing.postId = postId;
            
            // generate timestamp
            listing.generatedAt = now.toISOString()

            // image upload
            if (listing.images && listing.images.length > 0) {
                for (let i =0; i < listing.images.length; i++) {
                    const image = listing.images[i];
                    const localImagePath = path.join(__dirname, image.uri);

                    // firebase storage file
                    const storagePath = `listings/${postId}/image${i + 1}.jpg`
                    // firebase storage upload

                    try {
                        const uploadResponse = await storage.bucket().upload(localImagePath, {
                            destination: storagePath,
                            public: true,
                        });
                                            // get public url and convert
                    const publicURL = uploadResponse[0].metadata.mediaLink;
                    if (publicURL) {
                        image.uri = publicURL
                    } else {
                        throw error
                    }
                    } catch (err) {
                        console.error("Error uploading image: ", err)
                    }

                    // const [file] = await storage.bucket().upload(localImagePath, {
                    //     destination: storagePath,
                    //     public: true,
                    // });
                    
                }
            }
            const firstSaleDate = new Date(`${listing.dates[0]}T${listing.startTime}:00`)
            if (now >= firstSaleDate && now.toISOString().split("T")[0] <= listing.dates[0]) {
                listing.status = "active"
            } else {
                listing.status = "upcoming"
            }
            await docRef.set(listing);
            console.log(`Seeded listing: ${listing.title}`)
        }
        console.log(`Seeding completed successfully.`)
    } catch (err) {
        console.error("Error seeding database: ", err)
    }
};

seedDatabase();
