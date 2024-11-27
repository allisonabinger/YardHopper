// Contains functions that helped us get urls to work with the firebase storage
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {getFirestore, doc, getDoc} from "firebase/firestore"
import { app, db } from "../../../../holdStuffTemporarily/YardHopper/firebaseConfig"

// Function to get the download URL
async function getDownloadUrl(filePath: string) {
    const storage = getStorage(app);
    try {
      const fileRef = ref(storage, filePath); // Create reference
      const url = await getDownloadURL(fileRef); // Get download URL
      console.log("Download URL:", url);
      return url;
    } catch (error) {
      console.error("Error fetching download URL:", error);
    }
  }

  async function fetchDocument(collectionName: string, documentId: string) {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return docSnap.data();
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    }


  // Call function with the file path in your storage
  // getDownloadUrl("gs://yardhopper-7aeb4.firebasestorage.app/userPostImages/Sale_2.jpeg");

//   fetchDocument("posts", "198LBolAsId4ka8aROqt")
