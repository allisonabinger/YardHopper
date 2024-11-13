import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native'

export default function Page() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>User Settings for {id}</Text>
    </View>
  );

}