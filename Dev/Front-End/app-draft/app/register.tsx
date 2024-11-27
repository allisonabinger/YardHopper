import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Pressable, Image, Text, Alert } from "react-native";
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
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      console.log(`Signing up with email: ${email}`);
      await auth.register(email, password); // Call the register function from your AuthProvider
      router.replace("/(tabs)"); // Redirect after successful registration
    } catch (e) {
      Alert.alert("Error", "Unable to create account");
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >

      {/* Title */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 30,
        }}
      >
        Create your account
      </Text>

      {/* Form Container */}
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        {/* First Name Input */}
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#A9A9A9"
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: 30,
            backgroundColor: "#F0F0F0",
            width: "100%",
          }}
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name Input */}
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#A9A9A9"
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: 30,
            backgroundColor: "#F0F0F0",
            width: "100%",
          }}
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: 30,
            backgroundColor: "#F0F0F0",
            width: "100%",
          }}
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
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: 30,
            backgroundColor: "#F0F0F0",
            width: "100%",
          }}
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password Input */}
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: 30,
            backgroundColor: "#F0F0F0",
            width: "100%",
          }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Register Button */}
        <Pressable
          onPress={() => handleRegister(email, password, confirmPassword)}
          style={{
            backgroundColor: "#159636",
            borderRadius: 30,
            padding: 15,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
            Create Account
          </Text>
        </Pressable>

        {/* "Register with Google" Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#333", marginRight: 8 }}>
            Sign up with
          </Text>
          <Pressable
            onPress={() => {
              console.log("Google signup pressed");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Ionicons name="logo-google" size={24} />
          </Pressable>
        </View>

        {/* Redirect to Login */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Link href="/login" replace style={{ marginTop: 30 }}>
            <Text
              style={{
                textAlign: "center",
                color: "#159636",
                fontSize: 16,
              }}
            >
              Already have an account? Log in
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
