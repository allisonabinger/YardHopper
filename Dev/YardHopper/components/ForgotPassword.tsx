import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from "@/components/AuthProvider";

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </Pressable>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
  message: {
    marginTop: 8,
    color: "green",
    textAlign: "center",
  },
});

export default ForgotPassword;