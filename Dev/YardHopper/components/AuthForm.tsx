import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Pressable, Text } from 'react-native';
// import { Colors } from "@/assets/";

// Define the props type for the AuthForm component
interface AuthFormProps {
  onSubmit: (email: string, password: string) => void; // function to handle form submission
  buttonTitle?: string; // optional button title prop
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, buttonTitle = "Submit" }) => {
  const [email, setEmail] = useState<string>(''); // state for email input
  const [password, setPassword] = useState<string>(''); // state for password input

  const handleSubmit = () => {
    onSubmit(email, password); // call the onSubmit function with email and password
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 50,
    // borderColor: Colors.teal,
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    color: "black",
    borderRadius: 4,
  },
  button: {
    // backgroundColor: Colors.teal,
    // textAlign: "center",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "black",
  },
});

export default AuthForm;