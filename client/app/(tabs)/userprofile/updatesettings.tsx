import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/components/AuthProvider";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useColorScheme } from 'react-native';


export default function UpdateUserSettingsPage() {
  const { user, getValidIdToken, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const placeholderColor = colorScheme === 'dark' ? '#AAAAAA' : '#888888';

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const idToken = await getValidIdToken();
        if (!idToken) {
          throw new Error("Unable to retrieve ID token.");
        }

        const response = await fetch("https://yardhopperapi.onrender.com/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user profile.");
        }

        const profileData = await response.json();

        // Populate form fields with user profile data
        setFirstName(profileData.first || "");
        setLastName(profileData.last || "");
        setEmail(profileData.email || "");
        setAddress({
          street: profileData.street || "",
          city: profileData.city || "",
          state: profileData.state || "",
          zip: profileData.zipcode || "",
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching user profile:", errorMessage);
        Alert.alert("Error", errorMessage || "Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleUpdateSettings = async () => {
    if (!user) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const auth = getAuth();

    try {
      setLoading(true);

      // Check if user is trying to change password
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "New password and confirm password do not match.");
          return;
        }

        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser!, credential);
        await updatePassword(auth.currentUser!, newPassword);
        Alert.alert("Success", "Password updated successfully!");
      }

      // Prepare data for profile update
      const updateData = {
        first: firstName,
        last: lastName,
        email,
        street: address.street,
        city: address.city,
        state: address.state,
        zipcode: address.zip,
      };

      const idToken = await getValidIdToken();
      if (!idToken) {
        throw new Error("Unable to retrieve ID token.");
      }

      const response = await fetch("https://yardhopperapi.onrender.com/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      await refreshProfile();
      Alert.alert("Success", "Account settings updated successfully!");
      router.push("/(tabs)/userprofile");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error updating settings:", errorMessage);
      Alert.alert("Error", errorMessage || "Failed to update account settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Account Settings</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="First Name"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={placeholderColor}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Last Name"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={placeholderColor}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={placeholderColor}
              />
            </View>
            <View style={styles.addressSection}>
              <Text style={styles.addressTitle}>Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Street Address"
                  placeholderTextColor={placeholderColor}
                  value={address.street}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, street: text }))
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={placeholderColor}
                  value={address.city}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor={placeholderColor}
                  value={address.state}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, state: text }))
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="ZIP Code"
                  placeholderTextColor={placeholderColor}
                  value={address.zip}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, zip: text }))
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
            {loading && <Text style={styles.loadingText}>Processing...</Text>}
            <Pressable
              onPress={handleUpdateSettings}
              style={[styles.button, loading && { opacity: 0.7 }]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    backgroundColor: "#F0F0F0",
  },
  optionalAsterisk: {
    color: "red",
    marginLeft: 8,
    fontSize: 18,
  },
  addressSection: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#159636",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#159636",
    marginLeft: 8,
  },
  loadingText: {
    textAlign: "center",
    color: "#555555",
    fontSize: 16,
    marginBottom: 10,
  },
});
