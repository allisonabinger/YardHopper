// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Pressable,
//   Text,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
// } from "react-native";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "@/components/AuthProvider";
// import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";

// export default function UpdateUserSettingsPage() {
//   const { user } = useAuth();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [zipcode, setZipcode] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isFormChanged, setIsFormChanged] = useState(false);

//   const handleUpdateSettings = async () => {
//     if (!user) {
//       Alert.alert("Error", "User is not authenticated.");
//       return;
//     }

//     const auth = getAuth();

//     try {
//       // Check if user is trying to change password
//       if (currentPassword && newPassword && confirmPassword) {
//         if (newPassword !== confirmPassword) {
//           Alert.alert("Error", "New password and confirm password do not match.");
//           return;
//         }

//         const credential = EmailAuthProvider.credential(user.email!, currentPassword);
//         await reauthenticateWithCredential(auth.currentUser!, credential);
//         await updatePassword(auth.currentUser!, newPassword);
//         Alert.alert("Success", "Password updated successfully!");
//       }

//       // Check if other fields are filled and update accordingly
//       if (firstName || lastName || email || zipcode) {
//         if (currentPassword) {
//           const credential = EmailAuthProvider.credential(user.email!, currentPassword);
//           await reauthenticateWithCredential(auth.currentUser!, credential);
//         } else {
//           Alert.alert("Error", "Current password is required to update profile information.");
//           return;
//         }

//         if (firstName || lastName) {
//           await updateProfile(auth.currentUser!, {
//             displayName: `${firstName || ''} ${lastName || ''}`.trim(),
//           });
//         }

//         if (email && email !== user.email) {
//           await auth.currentUser!.updateEmail(email);
//         }

//         // Here you would typically update the zipcode in your database
//         // as Firebase doesn't have a built-in field for it

//         Alert.alert("Success", "Account settings updated successfully!");
//       }

//       router.push("/(tabs)/userprofile"); // Navigate back to profile or settings page
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Failed to update account settings. Please try again.");
//     }
//   };

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
//         <Text style={styles.title}>Account Settings</Text>

//         {/* Form Container */}
//         <View style={styles.formContainer}>
//           {/* First Name Input */}
//           <TextInput
//             placeholder="First Name"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             value={firstName}
//             onChangeText={(text) => {
//               setFirstName(text);
//               setIsFormChanged(true);
//             }}
//           />

//           {/* Last Name Input */}
//           <TextInput
//             placeholder="Last Name"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             value={lastName}
//             onChangeText={(text) => {
//               setLastName(text);
//               setIsFormChanged(true);
//             }}
//           />

//           {/* Email Input */}
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             value={email}
//             onChangeText={(text) => {
//               setEmail(text);
//               setIsFormChanged(true);
//             }}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           {/* Zipcode Input */}
//           <TextInput
//             placeholder="Zipcode"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             value={zipcode}
//             onChangeText={(text) => {
//               setZipcode(text);
//               setIsFormChanged(true);
//             }}
//             keyboardType="numeric"
//           />

//           {/* Current Password Input */}
//           <TextInput
//             placeholder="Current Password"
//             placeholderTextColor="#A9A9A9"
//             secureTextEntry
//             style={styles.input}
//             value={currentPassword}
//             onChangeText={(text) => {
//               setCurrentPassword(text);
//               setIsFormChanged(true);
//             }}
//           />

//           {/* New Password Input */}
//           <TextInput
//             placeholder="New Password"
//             placeholderTextColor="#A9A9A9"
//             secureTextEntry
//             style={styles.input}
//             value={newPassword}
//             onChangeText={(text) => {
//               setNewPassword(text);
//               setIsFormChanged(true);
//             }}
//           />

//           {/* Confirm New Password Input */}
//           <TextInput
//             placeholder="Confirm New Password"
//             placeholderTextColor="#A9A9A9"
//             secureTextEntry
//             style={styles.input}
//             value={confirmPassword}
//             onChangeText={(text) => {
//               setConfirmPassword(text);
//               setIsFormChanged(true);
//             }}
//           />

//           {/* Save Button */}
//           <Pressable
//             onPress={handleUpdateSettings}
//             style={[styles.button]}
//           >
//             <Text style={styles.buttonText}>Save</Text>
//           </Pressable>

//           {/* Back Button */}
//           <Pressable
//             onPress={() => router.push("/(tabs)/userprofile")}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#159636" />
//             <Text style={styles.backButtonText}>Back to Profile</Text>
//           </Pressable>
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
//     color: "#159636",
//     marginBottom: 30,
//   },
//   formContainer: {
//     width: "100%",
//     paddingHorizontal: 20,
//   },
//   input: {
//     marginBottom: 20,
//     padding: 10,
//     borderRadius: 8,
//     borderColor: "#e0e0e0",
//     borderWidth: 1,
//     backgroundColor: "#F0F0F0",
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#159636",
//     borderRadius: 30,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//     width: "50%",
//     marginRight: "auto",
//     marginLeft: "auto",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   backButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//     color: "#159636",
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: "#159636",
//     marginLeft: 8,
//   },
// });
import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context"; //Removed as per update 1
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/components/AuthProvider";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";

export default function UpdateUserSettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleUpdateSettings = async () => {
    if (!user) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const auth = getAuth();

    try {
      // Check if user is trying to change password
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "New password and confirm password do not match.");
          return;
        }

        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser!, credential);
        await updatePassword(auth.currentUser!, newPassword);
        Alert.alert("Success", "Password updated successfully!");
      }

      // Check if other fields are filled and update accordingly
      if (firstName || lastName || email || address.street || address.city || address.state || address.zip) {
        if (currentPassword) {
          const credential = EmailAuthProvider.credential(user.email!, currentPassword);
          await reauthenticateWithCredential(auth.currentUser!, credential);
        } else {
          Alert.alert("Error", "Current password is required to update profile information.");
          return;
        }

        if (firstName || lastName) {
          await updateProfile(auth.currentUser!, {
            displayName: `${firstName || ''} ${lastName || ''}`.trim(),
          });
        }

        if (email && email !== user.email) {
          await auth.currentUser!.updateEmail(email);
        }

        // Here you would typically update the address in your database
        // as Firebase doesn't have a built-in field for it

        Alert.alert("Success", "Account settings updated successfully!");
      }

      router.push("/(tabs)/userprofile");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update account settings. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>Account Settings</Text>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* First Name Input */}
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#A9A9A9"
              style={styles.input}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setIsFormChanged(true);
              }}
            />

            {/* Last Name Input */}
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#A9A9A9"
              style={styles.input}
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setIsFormChanged(true);
              }}
            />

            {/* Email Input */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#A9A9A9"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsFormChanged(true);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Current Password Input */}
            <TextInput
              placeholder="Current Password"
              placeholderTextColor="#A9A9A9"
              secureTextEntry
              style={styles.input}
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setIsFormChanged(true);
              }}
            />

            {/* New Password Input */}
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#A9A9A9"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setIsFormChanged(true);
              }}
            />

            {/* Confirm New Password Input */}
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#A9A9A9"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setIsFormChanged(true);
              }}
            />

            {/* Address Section */}
            <View style={styles.addressSection}>
              <Text style={styles.addressTitle}>Address</Text>

              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor="#A9A9A9"
                value={address.street}
                onChangeText={(text) => {
                  setAddress(prev => ({ ...prev, street: text }));
                  setIsFormChanged(true);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#A9A9A9"
                value={address.city}
                onChangeText={(text) => {
                  setAddress(prev => ({ ...prev, city: text }));
                  setIsFormChanged(true);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#A9A9A9"
                value={address.state}
                onChangeText={(text) => {
                  setAddress(prev => ({ ...prev, state: text }));
                  setIsFormChanged(true);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="ZIP Code"
                placeholderTextColor="#A9A9A9"
                keyboardType="numeric"
                value={address.zip}
                onChangeText={(text) => {
                  setAddress(prev => ({ ...prev, zip: text }));
                  setIsFormChanged(true);
                }}
              />
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleUpdateSettings}
              style={[styles.button]}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            {/* Back Button */}
            <Pressable
              onPress={() => router.push("/(tabs)/userprofile")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#159636" />
              <Text style={styles.backButtonText}>Back to Profile</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  addressSection: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#159636",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#159636",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "#159636",
  },
  backButtonText: {
    fontSize: 16,
    color: "#159636",
    marginLeft: 8,
  },
});

