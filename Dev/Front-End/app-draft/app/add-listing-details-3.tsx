import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useImagePicker } from "@/hooks/useImagePicker";
import PageLayout from "./PageLayout";
import { useRouter } from "expo-router";
import { useListingContext } from "./context/ListingContext";
import { useAuth } from "@/components/AuthProvider";

const ImageUploadScreen = () => {
  const { image, openImagePicker, reset } = useImagePicker();
  const { addImage, listingData } = useListingContext();
  const router = useRouter();
  const { user } = useAuth();

  const createListing = async () => {
    if (!user) {
      alert("You must be logged in to create a listing");
      return;
    }

    const listing = {
      ...listingData,
      userId: user.uid, // Add the userId to the listing data
    };

    try {
      const response = await fetch(
        "https://yardhopperapi.onrender.com/api/listings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      return response.json(); // Returns { postId }
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };

  const uploadImage = async (postId: string) => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "listing-image.jpg",
      type: "image/jpeg",
    });
    formData.append("caption", "Listing Image");

    try {
      const response = await fetch(
        `https://yardhopperapi.onrender.com/api/listings/${postId}/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    try {
      // Step 1: Create the listing
      const { postId } = await createListing();

      // Step 2: Upload the image if it exists
      if (image) {
        await uploadImage(postId);
      }

      alert("Listing uploaded successfully!");
      reset(); // Clear the image picker state
      router.push("./(tabs)/index"); // Navigate to the main screen
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
      router.push("./(tabs)/index"); // Navigate to the main screen
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