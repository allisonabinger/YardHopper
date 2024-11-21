import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/components/Card";

// Updated sales data with images
const salesData = [
  { id: "1", title: "Yard Sale 1", description: "Furniture, clothes, and more!", image: require("@/assets/images/sale1.png") },
  { id: "2", title: "Yard Sale 2", description: "Vintage items and antiques!", image: require("@/assets/images/sale2.png") },
  { id: "3", title: "Yard Sale 3", description: "Electronics and appliances sale.", image: require("@/assets/images/sale3.png") },
  { id: "4", title: "Yard Sale 4", description: "Books, toys, and more!", image: require("@/assets/images/sale4.png") },
  { id: "5", title: "Yard Sale 5", description: "Fashion and accessories.", image: require("@/assets/images/sale5.png") },
  { id: "6", title: "Yard Sale 6", description: "Home décor and art pieces.", image: require("@/assets/images/sale6.png") },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof salesData[0] }) => (
    <Card
      title={item.title}
      description={item.description}
      image={item.image}
      onPress={() =>
        router.push({
          pathname: "./(sale)/[id]",
          params: { id: item.id },
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={salesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingVertical: 16,
  },
});
