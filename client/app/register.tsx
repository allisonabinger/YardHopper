import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorScheme = useColorScheme(); // Declare colorScheme first
  const placeholderColor = colorScheme === "dark" ? "#AAAAAA" : "#888888";

  const auth = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !zipcode || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Register user with Firebase
      await auth.register(email, password);

      // Step 2: Fetch ID token and create profile
      const idToken = await auth.getValidIdToken();
      if (!idToken) throw new Error("Failed to retrieve ID token.");

      const response = await fetch("https://yardhopperapi.onrender.com/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ first: firstName, last: lastName, zipcode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create profile.");
      }

      console.log("User profile successfully created.");
      router.replace("/register-location");
    } catch (error: any) {
      console.error("Error during registration:", error.message);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button
        <Pressable onPress={() => router.push("/login")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={30} color="#159636" />
        </Pressable> */}

        <Text style={styles.title}>Create your account</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={placeholderColor}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={placeholderColor}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Zipcode"
            style={styles.input}
            value={zipcode}
            onChangeText={setZipcode}
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={placeholderColor}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor={placeholderColor}
            secureTextEntry
          />

          {loading && <Text style={styles.loadingText}>Registering...</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            onPress={handleRegister}
            style={styles.registerButton}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </Pressable>

          {/* Back to Login Button */}
          <Pressable onPress={() => router.push("/login")} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#159636" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </Pressable>
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#159636",
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#159636",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  loadingText: {
    color: "#555555",
    fontSize: 14,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
});
