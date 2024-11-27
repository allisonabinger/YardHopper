import { Link, useRouter } from 'expo-router';
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Text,
} from "react-native";
import { useAuth } from "@/components/AuthProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import  AuthForm  from "@/components/AuthForm";
import  ForgotPassword from "@/components/ForgotPassword";



export default function Page() {
  const auth = useAuth();
  const router = useRouter();

  async function login(email: string, password: string) {
    // setLoading(true);
    try {
      console.log(`logging in with ${email} and ${password}`)
      await auth.login(email, password)
      router.replace("/(tabs)");
    } catch (e) {
      alert("Email or password is incorrect");
    }
    // setLoading(false);
  }

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Login</Text>
      <AuthForm onSubmit={login} buttonTitle="Sign In" />
      <ForgotPassword />
      <Link href="/register" replace>
        <Text>Create a new account</Text>
      </Link>
      <Pressable onPress={() => {router.replace("/(tabs)")}}>
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );

}