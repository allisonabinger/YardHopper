import React, { useState } from "react";
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
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";

export default function UpdateUserSettingsPage() {
  const { user, getIdToken } = useAuth();
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
      const updateData: Record<string, any> = {};
      if (firstName) updateData.first = firstName;
      if (lastName) updateData.last = lastName;
      if (email && email !== user.email) updateData.email = email;
      if (address.street) updateData.street = address.street;
      if (address.city) updateData.city = address.city;
      if (address.state) updateData.state = address.state;
      if (address.zip) updateData.zipcode = address.zip;

      if (Object.keys(updateData).length > 0) {
        // Get the ID token
        const idToken = await getIdToken();
        if (!idToken) {
          throw new Error("Unable to retrieve ID token.");
        }

        // Make the API call to update the user profile
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

        const data = await response.json();
        console.log("Profile updated successfully:", data);
        Alert.alert("Success", "Account settings updated successfully!");
      }

      // Navigate back to user profile
      router.push("/(tabs)/userprofile");
    } catch (error: any) {
      console.error("Error updating settings:", error.message);
      Alert.alert("Error", error.message || "Failed to update account settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const auth = getAuth();

    try {
      setLoading(true);

      // Get the ID token
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error("Unable to retrieve ID token.");
      }

      // Call the DELETE endpoint
      const response = await fetch("https://yardhopperapi.onrender.com/api/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      const data = await response.json();
      console.log("Account deleted successfully:", data);

      // Delete the user from Firebase Auth
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }

      Alert.alert("Success", "Account successfully deleted.");
      // Navigate to a landing or login page
      router.replace("/login");
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
      Alert.alert("Error", error.message || "Failed to delete account. Please try again.");
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
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Last Name"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
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
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Current Password"
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="New Password"
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm New Password"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.addressSection}>
              <Text style={styles.addressTitle}>Address</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Street Address"
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

            <Pressable
              onPress={handleDeleteAccount}
              style={[styles.deleteButton, loading && { opacity: 0.7 }]}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/userprofile")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#159636" />
              <Text style={styles.backButtonText}>Back to Profile</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#FF4D4F",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
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
