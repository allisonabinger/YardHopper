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

const ImageUploadScreen = () => {
  const { image, openImagePicker, reset } = useImagePicker();
  const router = useRouter();

  const handleSkip = () => {
    // Handle the skip action
    router.push("/(tabs)"); // Replace with the appropriate screen
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Error", "No image selected to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch("https://your-backend-api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Image uploaded successfully!");
        reset(); // Clear the image after successful upload
      } else {
        Alert.alert("Error", "Failed to upload the image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Something went wrong while uploading.");
    }
  };

  return (
    <PageLayout step={4} steps={4}>
      <View style={styles.container}>
        <Text style={styles.heading}>Upload an Image</Text>
        <Image
          source={{ uri: image || "https://via.placeholder.com/150" }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.button} onPress={openImagePicker}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {/* Conditionally render the Skip text */}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#159636",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 40,
    borderRadius: 10,
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