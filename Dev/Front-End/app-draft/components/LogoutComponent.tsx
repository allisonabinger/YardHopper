import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";

export default function LogoutComponent({ children, style }) {
  const router = useRouter();

  function logout() {
    router.replace('/login');
  }

  return (
    <Pressable onPress={logout} style={[styles.logoutButton, style]}>
      <Ionicons name="log-out-outline" size={24} style={{ marginRight: 2 }} />
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
