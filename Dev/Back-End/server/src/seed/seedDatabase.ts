import { error } from "console";
import { db, storage } from "../config/firebase"
import seedData from "./seedData.json"
import fs from "fs"
import path from "path"
import { DocumentData } from '@google-cloud/firestore';

const seedDatabase = async() => {
    try {
        const listings = seedData.listings

        for (const listing of listings) {
            const docRef = db.collection("listings").doc();
            const postId = docRef.id
            // const now = new Date()

            // // assigns new ID to listing postId
            // listing.postId = postId;
            
            // // generate timestamp
            // listing.generatedAt = now.toISOString()

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
            // const firstSaleDate = new Date(`${listing.dates[0]}T${listing.startTime}:00`)
            // if (now >= firstSaleDate && now.toISOString().split("T")[0] <= listing.dates[0]) {
            //     listing.status = "active"
            // } else {
            //     listing.status = "upcoming"
            // }
            // await docRef.set(listing);
            // console.log(`Seeded listing: ${listing.title}`)
        }
        console.log(`Seeding completed successfully.`)
    } catch (err) {
        console.error("Error seeding database: ", err)
    }
};

function flattenCategories(categories: Array<{ name: string, subcategories?: string[] }>) {
    const flatCategories: string[] = [];

    categories.forEach(({ name, subcategories }) => {
        flatCategories.push(name); // Add the broad category
        if (subcategories) {
            subcategories.forEach(sub => flatCategories.push(`${name} > ${sub}`)); // Add subcategories with prefix
        }
    });

    return flatCategories;
}

function reformatCategories(categories: string[]) {
    return categories.map(category => category.replace(" > ", "-"));
}

async function updateCategoryFormat() {
    const listingsRef = db.collection('listings');

    try {
        const snapshot = await listingsRef.get();

        if (snapshot.empty) {
            console.log('No listings found');
            return;
        }

        for (const doc of snapshot.docs) {
            const data = doc.data() as DocumentData;

            if (data.categories && Array.isArray(data.categories)) {
                const reformattedCategories = reformatCategories(data.categories);

                await listingsRef.doc(doc.id).update({
                    categories: reformattedCategories
                });
                console.log("Updated document ID: ", doc.id);
            } else {
                console.warn("Document didn't have categories or wasn't formatted correctly: ", doc.id);
            }
        }
        console.log("Listings updated successfully");
    } catch (err) {
        console.error("Error updating categories: ", err);
    }
}

async function updateCategoryFields() {
    const listingsRef = db.collection('listings');

    try {
        const snapshot = await listingsRef.get();

        if (snapshot.empty) {
            console.log('No listings found');
            return;
        }

        for (const doc of snapshot.docs) {
            const data = doc.data() as any;

            if (data.categories && Array.isArray(data.categories)) {
                const subcategories: Record<string, string[]> = {}

                const broadCategories: string[] = []
                data.categories.forEach((category: string) => {
                    const parts = category.split('-');

                    if (parts.length === 1) {
                        broadCategories.push(category);
                    } else if (parts.length === 2) {
                        const [parentCategory, childCategory] = parts;
                        if (!subcategories[parentCategory]) {
                            subcategories[parentCategory] = []
                        }
                        subcategories[parentCategory].push(childCategory)
                    }
                });

                const updatedData: any = {
                    categories: broadCategories,
                    subcategories: subcategories
                }
                await listingsRef.doc(doc.id).update(updatedData);
                console.log(`Updated document ID: ${doc.id}`);
            } else {
                console.warn(`Doc ${doc.id} doesnt have categories or isnt in correct format`)
            }
        }
        console.log('All listings updated')
    } catch (err) {
        console.error('Error updating categories: ', err)
    }
}


async function updateImageURLS() {
    const listingsRef = db.collection('listings');

    try {
        const snapshot = await listingsRef.get();

        if (snapshot.empty) {
            console.log('No listings found');
            return;
        }

        for (const doc of snapshot.docs) {
            const data = doc.data() as any;
            if (data.images && Array.isArray(data.images)) {
                const updatedImages = data.images.map((image: { uri: string, caption?: string }) => {
                    if (!image.uri) return image; // Skip if no URI exists
                    
                    const transformedUri = transformUrl(image.uri); // Transform the URL
                    return { ...image, uri: transformedUri };
                });

                // update Firestore document with transformed URLs
                await doc.ref.update({ images: updatedImages });
            }

        }
        console.log('All listings updated')
    } catch (err) {
        console.error('Error updating categories: ', err)
    }
}

function transformUrl(originalUrl: string): string {
    const match = originalUrl.match(/\/o\/(.*?)\?/);
    const filePath = match ? match[1] : null;

    if (!filePath) {
        console.error('Invalid Firebase Storage URL:', originalUrl);
        return originalUrl;
    }

    return `https://firebasestorage.googleapis.com/v0/b/yardhopper-7aeb4.appspot.com/o/${filePath}?alt=media`;
}

async function getNewImageUrls(postId: string): Promise<string[]> {
  const bucket = storage.bucket();
  const folderPath = `listings/${postId}/`;

  try {
    const [files] = await bucket.getFiles({ prefix: folderPath });

    if (files.length === 0) {
      console.log(`No files found for postId: ${postId}`);
      return [];
    }

    const urls = files.map((file) => {
      const encodedPath = encodeURIComponent(file.name);
      return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
    });

    return urls;
  } catch (error) {
    console.error(`Error fetching files for postId ${postId}:`, error);
    throw new Error('Unable to fetch image URLs.');
  }
}

async function updateListingImages(postId: string) {
  try {
    const newUrls = await getNewImageUrls(postId);
    console.log(`New URLs for postId ${postId}:`, newUrls);

    return newUrls;
  } catch (error) {
    console.error('Error updating listing images:', error);
  }
}

updateListingImages('DOcNhHR25vTD70cmlySs');


// seedDatabase();
// updateCategoryFormat()
// 
