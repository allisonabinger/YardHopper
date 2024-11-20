import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";


export default function LogoutComponent() {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout(){
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }

  return (
    <Pressable onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={24} style={{ marginRight: 16 }} />
    </Pressable>
  );
}