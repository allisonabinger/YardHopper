import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Text,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Signup: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const router = useRouter();

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
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 200,
          height: 280,
          marginBottom: 60,
          padding: 30
        }}
      />

      {/* Form Container */}
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
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

        {/* Login Button */}
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

        {/* "Log in with" Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#333", marginRight: 8 }}>
            Log in with
          </Text>
          <Pressable
            onPress={() => {
              console.log("Google login pressed");
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

        {/* Sign-up Redirect */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Link href="/register" replace style={{ marginTop: 30 }}>
            <Text
              style={{
                textAlign: "center",
                color: "#159636",
                fontSize: 16,
              }}
            >
              No account? Sign up
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
