import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/components/AuthProvider";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { router } from "expo-router";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);

    try {
      // Re-authenticate user with the current password
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Update the user's password
      await updatePassword(auth.currentUser!, newPassword);

      Alert.alert("Success", "Password changed successfully!");
      router.push("/(tabs)/userprofile"); // Navigate back to profile or settings page
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to change password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Current Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          placeholder="New Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable onPress={handleChangePassword} style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(tabs)/userprofile")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#159636" />
          <Text style={styles.backButtonText}>Back to Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  button: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#159636",
    marginLeft: 8,
  },
});