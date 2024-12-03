import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";

interface LogoutComponentProps {
  style?: ViewStyle;
}

export default function LogoutComponent({ style }: LogoutComponentProps) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
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
      <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
      <Text style={styles.logoutText}>Log out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 13,
    marginLeft: 3
  },
  logoutText: {
    fontSize: 16,
    color: '#333',
  },
});

