import { Link } from 'expo-router';
import { View, Text } from 'react-native'

export default function Page() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Login</Text>
      <Link href="/register">
        <Text>Create a new account</Text>
      </Link>
    </View>
  );

}