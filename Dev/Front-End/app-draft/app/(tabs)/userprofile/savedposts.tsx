import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Card from "@/components/Card";
import FilterModal from "@/components/FilterModal";

// Updated sales data with images and categories
const salesData = [
  { id: "1", title: "Yard Sale 1", description: "Furniture, clothes, and more!", image: require("@/assets/images/sale1.png"), category: "Furniture", g: { geopoint: { _latitude: 37.7749, _longitude: -122.4194 } } },
  { id: "2", title: "Yard Sale 2", description: "Vintage items and antiques!", image: require("@/assets/images/sale2.png"), category: "Decor & Art", g: { geopoint: { _latitude: 37.7849, _longitude: -122.4094 } } },
  { id: "3", title: "Yard Sale 3", description: "Electronics and appliances sale.", image: require("@/assets/images/sale3.png"), category: "Electronics", g: { geopoint: { _latitude: 37.7649, _longitude: -122.4294 } } },
  { id: "4", title: "Yard Sale 4", description: "Books, toys, and more!", image: require("@/assets/images/sale4.png"), category: "Books & Media", g: { geopoint: { _latitude: 37.7749, _longitude: -122.4394 } } },
  { id: "5", title: "Yard Sale 5", description: "Fashion and accessories.", image: require("@/assets/images/sale5.png"), category: "Clothing", g: { geopoint: { _latitude: 37.7849, _longitude: -122.4494 } } },
  { id: "6", title: "Yard Sale 6", description: "Home décor and art pieces.", image: require("@/assets/images/sale6.png"), category: "Decor & Art", g: { geopoint: { _latitude: 37.7949, _longitude: -122.4594 } } },
];

export default function SavedPosts() {
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list"); // Default to "list"

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const filteredData = selectedCategories.length
    ? salesData.filter((item) => selectedCategories.includes(item.category))
    : salesData;

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Posts</Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        {/* Filter Button */}
        <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
          <Ionicons
            name={filterModalVisible ? "filter-circle" : "filter-circle-outline"}
            size={28}
            color="#159636"
          />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        {/* View Toggle Button */}
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
          style={styles.toggleButton}
        >
          <Ionicons
            name={viewMode === "list" ? "toggle-outline" : "toggle"}
            size={28}
            color={viewMode === "list" ? "gray" : "#159636"}
          />
          <Text
            style={[
              styles.toggleText,
              { color: viewMode === "list" ? "gray" : "#159636" },
            ]}
          >
            {viewMode === "list" ? "Map View" : "List View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === "list" ? (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: salesData[0].g.geopoint._latitude,
            longitude: salesData[0].g.geopoint._longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {filteredData.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.g.geopoint._latitude,
                longitude: item.g.geopoint._longitude,
              }}
              title={item.title}
              description={item.description}
            />
          ))}
        </MapView>
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#159636",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    fontSize: 16,
    color: "#159636",
    marginLeft: 4,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 16,
  },
  map: {
    flex: 1,
  },
});
