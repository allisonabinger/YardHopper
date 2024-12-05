import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as FileSystem from 'expo-file-system';
import { useImagePicker } from "@/hooks/useImagePicker";
import PageLayout from "./PageLayout";
import { useRouter } from "expo-router";
import { useListingContext } from "./context/ListingContext";

const ImageUploadScreen = () => {
  const { image, openImagePicker, reset, mimeType } = useImagePicker();
  const { addImage, listingData } = useListingContext();
  const router = useRouter();

  const createListing = async () => {
    const listing = { ...listingData };

    const response = await fetch("https://yardhopperapi.onrender.com/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to create listing");
    }

    const responseData = await response.json();
    console.log("Full Response JSON:", responseData);

    // Extract the postId from the response
    const postIdKey = "Listing created with new postId";
    const postId = responseData[postIdKey];

    if (postId) {
      console.log("Extracted postId:", postId);
    } else {
      console.error("postId not found in response");
    }

    return(postId);
  };

  const uploadImage = async (postId: string) => {
    if (!image) return;


    try {
      console.log("Selected image URI:", image);

      // Validate the image file
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        throw new Error("Selected file does not exist");
      }

      // Prepare FormData
      const formData = new FormData();
      if (!formData) {
        throw new Error("Selected file does not exist");
      }

      const imageName = image.split("/").pop() || "default-name.jpg";

      formData.append("image", {
        uri: image,
        type: mimeType,
        name: imageName,
      });
      formData.append("caption", "More Items");

      console.log("FormData debug:", JSON.stringify(formData));

      console.log("FormData prepared:", formData);
      console.log("Post Id: ", postId)

      // Make the upload request
      const uploadResponse = await fetch(
        `https://yardhopperapi.onrender.com/api/listings/${postId}/images`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorResponse = await uploadResponse.text();
        console.error("Server response:", errorResponse);
        throw new Error("Failed to upload image");
      }

      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  const handleUpload = async () => {
    try {
      const postId = await createListing();

      if (image) {
        await uploadImage(postId);
      }

      alert("Listing uploaded successfully!");
      reset(); // Clear the image picker state
      router.push("/(tabs)"); // Navigate to the main screen
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("An error occurred while uploading the listing.");
    }
  };

  const handleSkip = async () => {
    try {
      // Only create the listing, no image upload
      await createListing();
      alert("Listing uploaded successfully without an image!");
      router.push("/(tabs)"); // Navigate to the main screen
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("An error occurred while uploading the listing.");
    }
  };

  return (
    <PageLayout step={4} steps={4}>
      <View style={styles.container}>
        <Text style={styles.heading}>Upload an Image</Text>
        <Image
          source={{
            uri:
              image ||
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.button} onPress={openImagePicker}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {!image && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        {image && (
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#159636",
  },
  imagePreview: {
    width: 300,
    height: 200,
    marginBottom: 40,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#159636",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  skipText: {
    marginTop: 20,
    fontSize: 16,
    color: "#159636",
    textAlign: "center",
    fontWeight: "semibold",
  },
});

export default ImageUploadScreen;