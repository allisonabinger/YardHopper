import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";
import { useAuth } from "@/components/AuthProvider";

export default function LogoutComponent({ style }) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout(){
    try {
      console.log("logging out");
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }

  return (
    <Pressable onPress={handleLogout} style={[styles.logoutButton, style]}>
      <Ionicons name="log-out-outline" size={24} style={{ marginRight: 2 }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
