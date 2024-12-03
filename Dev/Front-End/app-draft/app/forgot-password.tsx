// import React, { useState } from 'react';
// import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
// import { useAuth } from "@/components/AuthProvider";
// import { useRouter, Link } from "expo-router";

// const ForgotPassword: React.FC = () => {
//   const { resetPassword } = useAuth();
//   const [email, setEmail] = useState<string>('');
//   const [message, setMessage] = useState<string | null>(null);
//   const router = useRouter();

//   const handleResetPassword = async () => {
//     try {
//       await resetPassword(email);
//       setMessage("Password reset email sent! Check your inbox.");
//     } catch (error: any) {
//       setMessage("Error: " + error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password?</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         autoCorrect={false}
//       />
//       <Pressable style={styles.button} onPress={handleResetPassword}>
//         <Text style={styles.buttonText}>Reset Password</Text>
//       </Pressable>
//       {message && <Text style={styles.message}>{message}</Text>}
//       <Link href={"/login"}>
//         <Text>Login</Text>
//       </Link>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 8,
//     fontWeight: "bold",
//     color: "#159636",
//   },
//   input: {
//     marginBottom: 20,
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: "#F0F0F0",
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#159636",
//     borderRadius: 30,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   message: {
//     marginTop: 8,
//     color: "green",
//     textAlign: "center",
//   },
// });

// export default ForgotPassword;
import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useAuth } from "@/components/AuthProvider";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

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
      <Pressable
        style={styles.backButton}
        onPress={() => router.push("/login")}
      >
        <Ionicons name="arrow-back" size={24} color="#159636" />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Forgot Password?</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
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
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#159636",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "semibold",
    color: "#159636",
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    width: "80%",
  },
  button: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    color: "green",
    textAlign: "center",
  },
});

export default ForgotPassword;

