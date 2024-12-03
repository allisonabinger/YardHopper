import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      alert("Passwords do not match");
      return;
    }

    try {
      console.log(`Signing up with email: ${email}`);
      await auth.register(email, password); // Call the register function from your AuthProvider
      router.replace("/(tabs)"); // Redirect after successful registration
    } catch (e) {
      alert("Unable to create account");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.title}>Create your account</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* First Name Input */}
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Last Name Input */}
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Register Button */}
          <Pressable
            onPress={() => handleRegister(email, password, confirmPassword)}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </Pressable>

          {/* Redirect to Login */}
          <View style={styles.loginRedirectContainer}>
            <Link href="/login" replace style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
                Already have an account? Log in
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#159636"
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
  registerButton: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginRedirectContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loginLink: {
    marginTop: 30,
  },
  loginLinkText: {
    textAlign: "center",
    color: "#159636",
    fontSize: 16,
  },
});

