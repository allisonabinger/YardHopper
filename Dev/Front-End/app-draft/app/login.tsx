import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/components/AuthProvider";
import { Link, useRouter } from "expo-router";

export default function LoginScreen() {
  const auth = useAuth();
  const router = useRouter();

  // Form state for email and password
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function login(email: string, password: string) {
    // setLoading(true);
    try {
      console.log(`logging in with ${email} and ${password}`)
      await auth.login(email, password)
      router.replace("/(tabs)");
    } catch (e) {
      alert("Email or password is incorrect");
    }
    // setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Login Button */}
        <Pressable onPress={() => login(email, password)} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </Pressable>

        {/* Sign-up Redirect */}
        <View style={styles.signupContainer}>
          <Link href="/register">
            <Text style={styles.signupText}>No account? Sign up</Text>
          </Link>
        </View>
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
  logo: {
    width: 230,
    height: 282,
    marginBottom: 60,
    padding: 30,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 30,
  },
  signupText: {
    color: "#159636",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
