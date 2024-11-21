import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordPage() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Change Password</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Current Password Input */}
        <TextInput
          placeholder="Current Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
        />

        {/* New Password Input */}
        <TextInput
          placeholder="New Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
        />

        {/* Confirm New Password Input */}
        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
        />

        {/* Change Password Button */}
        <Pressable
          onPress={() => {
            // Handle password change logic here
            console.log("Change password pressed");
            // Navigate back to settings or profile page
            router.back();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          onPress={() => router.push("/(tabs)/userprofile")}
          style={styles.backButton}
        >
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
