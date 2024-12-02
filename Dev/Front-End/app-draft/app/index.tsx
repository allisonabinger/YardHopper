import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Redirect } from "expo-router";

export default function Page() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Check for stored token
        const token = await SecureStore.getItemAsync("userToken");

        if (token) {
          // Check if biometrics is enabled
          const isBiometricEnabled = await SecureStore.getItemAsync("useBiometrics");

          if (isBiometricEnabled === "true") {
            const { success } = await LocalAuthentication.authenticateAsync({
              promptMessage: "Authenticate to continue",
            });
            if (success) {
              setIsAuthenticated(true);
            }
          } else {
            // No biometrics, just authenticate with the token
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    authenticateUser();
  }, []);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#159636" />
      </View>
    );
  }

  // Redirect based on authentication state
  return isAuthenticated ? <Redirect href="/dashboard" /> : <Redirect href="/login" />;
}
