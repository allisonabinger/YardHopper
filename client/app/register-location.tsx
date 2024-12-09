import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

const RegisterLocation = () => {
  const router = useRouter();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        console.log("Location permission granted.");
        getCurrentLocation();
      } else {
        console.log("Location permission denied.");
        Alert.alert(
          "Permission Denied",
          "Location access is required to show listings near you."
        );
      }
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      Alert.alert("Error", "Something went wrong while requesting permissions.");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
      Alert.alert("Location Acquired", `Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log("Current location:", { latitude, longitude });
      router.replace("/(tabs)"); // Navigate to home after successful location access
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Unable to retrieve location. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Listings Near You</Text>
      <Text style={styles.description}>
        We need access to your location to show listings in your area.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={requestLocationPermission}
      >
        <Text style={styles.buttonText}>Allow Location Access</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#159636",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#159636",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
