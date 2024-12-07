// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Image,
//   Text,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
//   StyleSheet,
// } from "react-native";
// import { Link, useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "@/components/AuthProvider";

// export default function RegisterPage() {
//   const auth = useAuth();
//   const router = useRouter();

//   const { getIdToken, user } = useAuth();

//   // State for form fields
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [zipcode, setZipcode] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   async function handleRegister(email: string, zipcode: string, password: string, confirmPassword: string) {
//     if (!firstName || !lastName || !email || !zipcode || !password || !confirmPassword) {
//       console.log("All fields are required");
//       alert("All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       console.log("Passwords do not match");
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       console.log(`Signing up with email: ${email}`);
//       await auth.register(email, password);
//       router.replace("/register-location");
//     } catch (e) {
//       alert("Unable to create account");
//     }
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollViewContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Title */}
//         <Text style={styles.title}>Create your account</Text>

//         {/* Form Container */}
//         <View style={styles.formContainer}>
//           {/* First Name Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="First Name"
//               placeholderTextColor="#A9A9A9"
//               style={styles.input}
//               value={firstName}
//               onChangeText={setFirstName}
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Last Name Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Last Name"
//               placeholderTextColor="#A9A9A9"
//               style={styles.input}
//               value={lastName}
//               onChangeText={setLastName}
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Email Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Email"
//               placeholderTextColor="#A9A9A9"
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Zipcode Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Zipcode"
//               placeholderTextColor="#A9A9A9"
//               style={styles.input}
//               value={zipcode}
//               onChangeText={setZipcode}
//               keyboardType="numeric"
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Password Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="#A9A9A9"
//               secureTextEntry
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Confirm Password Input */}
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Confirm Password"
//               placeholderTextColor="#A9A9A9"
//               secureTextEntry
//               style={styles.input}
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//             />
//             <Text style={styles.requiredAsterisk}>*</Text>
//           </View>

//           {/* Register Button Container */}
//           <View style={styles.registerButtonContainer}>
//             <Pressable
//               onPress={() => handleRegister(email, zipcode, password, confirmPassword)}
//               style={styles.registerButton}
//             >
//               <Text style={styles.registerButtonText}>Create Account</Text>
//             </Pressable>
//           </View>

//           {/* Redirect to Login */}
//           <View style={styles.loginRedirectContainer}>
//             <Link href="/login" replace style={styles.loginLink}>
//               <Text style={styles.loginLinkText}>
//                 Already have an account? Log in
//               </Text>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 30,
//     color: "#159636"
//   },
//   formContainer: {
//     width: "100%",
//     paddingHorizontal: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: "#F0F0F0",
//   },
//   requiredAsterisk: {
//     color: 'red',
//     position: 'absolute',
//     right: 10,
//     fontSize: 18,
//   },
//   registerButton: {
//     backgroundColor: "#159636",
//     borderRadius: 30,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//     width: "60%",
//   },
//   registerButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   loginRedirectContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   loginLink: {
//     marginTop: 30,
//   },
//   loginLinkText: {
//     textAlign: "center",
//     color: "#159636",
//     fontSize: 16,
//   },
//   registerButtonContainer: {
//     alignItems: "center",
//     width: "100%",
//   },
// });

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

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !zipcode || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Create account in Firebase Auth
      const register = await auth.register(email, password);
      const idToken = await auth.getIdToken();

      console.log("ID Token:", idToken);
      if (!idToken) {
        throw new Error("Unable to retrieve ID token. Registration failed.");
      }

      // Step 2: Create user profile in Firestore
      const response = await fetch("https://yardhopperapi.onrender.com/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          first: firstName,
          last: lastName,
          zipcode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user profile");
      }

      const data = await response.json();
      console.log("User profile created successfully:", data);

      // Navigate to the next page
      router.replace("/register-location");
    } catch (e: any) {
      console.error("Error during registration:", e.message);
      setError(e.message || "Registration failed. Please try again.");
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
        <Text style={styles.title}>Create your account</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Zipcode"
            style={styles.input}
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
