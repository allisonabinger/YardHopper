import React from "react";
import { View, TextInput, TouchableOpacity, Pressable, Image, Text } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterPage() {
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
        />

        {/* Register Button */}
        <Pressable
          onPress={() => router.replace("/(tabs)/")}
          style={{
            backgroundColor: "#159636",
            borderRadius: 30,
            padding: 15,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
            Log In
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
