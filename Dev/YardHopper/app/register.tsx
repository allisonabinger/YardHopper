import { Link, useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from "@/components/AuthProvider";
import  AuthForm  from "@/components/AuthForm";


export default function Page() {
  const auth = useAuth();
  const router = useRouter();

  async function register(email: string, password: string) {
    // setLoading(true);
    try {
      console.log(`signing up with ${email} and ${password}`)
      await auth.register(email, password)
      router.replace("/(tabs)");
    } catch (e) {
      alert("Unable to create account");
    }
    // setLoading(false);
  }
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Register</Text>
      <AuthForm onSubmit={register} buttonTitle="Create Account" />

      <Link href="/login" replace>
        <Text>Log in to existing account</Text>
      </Link>
    </View>
  );

}