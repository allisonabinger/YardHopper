import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import FilterModal from "@/components/FilterModal";

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

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
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity onPress={toggleFilter}>
          <Ionicons
            name={filterModalVisible ? "filter-circle" : "filter-circle-outline"}
            size={28}
            color="#159636"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={salesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={toggleFilter}
        radius={radius}
        setRadius={setRadius}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  listContent: {
    paddingVertical: 16,
  },
});
