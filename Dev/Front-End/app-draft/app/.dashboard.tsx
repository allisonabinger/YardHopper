// // app/dashboard.tsx
// import React from "react";
// import { View, Text, Button } from "react-native";
// import * as SecureStore from "expo-secure-store";
// import { useRouter } from "expo-router";

// const Dashboard = () => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await SecureStore.deleteItemAsync("userToken");
//     await SecureStore.deleteItemAsync("useBiometrics");
//     router.replace("/login");
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Welcome to the Dashboard!</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default Dashboard;
