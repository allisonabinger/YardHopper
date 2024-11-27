import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import FilterModal from "@/components/FilterModal";
import mockData from "@/mockData.json";

// Define the type for each listing
type ListingItem = {
  title: string;
  description: string;
  address: {
    zip: number;
    city: string;
    street: string;
    state: string;
  };
  dates: string[];
  startTime: string;
  endTime: string;
  images: { uri: string; caption: string }[];
  categories: string[];
  subcategories: {
    [category: string]: string[] | undefined;
  };
  postId: string;
  generatedAt: string;
  status: string;
  g: {
    geohash: string;
    geopoint: {
      _latitude: number;
      _longitude: number;
    };
  };
  userId: null | string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  // Render function for each listing item
  const renderItem = ({ item }: { item: ListingItem }) => (
    <Card
      title={item.title}
      description={item.description}
      image={item.images[0]?.uri || "https://via.placeholder.com/150"}
      onPress={() =>
        router.push({
          pathname: `/listing/[id]`,
          params: {
            postId: item.postId,
            // title: item.title,
            // description: item.description,
            // address: `${item.address.street}, ${item.address.city}, ${item.address.state} ${item.address.zip}`,
            // category: item.categories.join(", "),
          },
        })
      }
      date={item.dates[0]}
      address={`${item.address.street}, ${item.address.city}, ${item.address.state} ${item.address.zip}`}
      postId={item.postId}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* List of Listings */}
      <FlatList
        data={mockData.listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={styles.listContent}
      />

      {/* Filter Modal */}
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

// Styles
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
