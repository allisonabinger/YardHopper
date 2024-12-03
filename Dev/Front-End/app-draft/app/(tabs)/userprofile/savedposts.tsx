import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSavedPosts } from "../../context/SavedPostsContext";
import FilterModal from "@/components/FilterModal";

export default function SavedPosts() {
  const router = useRouter();
  const { savedPosts, removeSavedPost } = useSavedPosts();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const filteredData = selectedCategories.length
    ? savedPosts.filter((item) =>
        selectedCategories.some((category) =>
          item.description.toLowerCase().includes(category.toLowerCase())
        )
      )
    : savedPosts;

  const renderItem = ({ item }: { item: typeof savedPosts[0] }) => (
    <View style={styles.cardContainer}>
      {/* Like Button */}
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => removeSavedPost(item.id)} // Removes the item from saved posts
      >
        <Ionicons name="heart" size={24} color="#159636" />
      </TouchableOpacity>

      {/* Listing Image */}
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.cardImage}
      />

      {/* Listing Details */}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>

      {/* Navigate to Detailed Page */}
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => router.push({ pathname: "./(sale)/[id]", params: { id: item.id } })}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
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
            latitude: filteredData[0]?.g.geopoint._latitude || 37.7749,
            longitude: filteredData[0]?.g.geopoint._longitude || -122.4194,
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
  cardContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    margin: 20,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: {
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#159636",
  },
  cardAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  expandedDetails: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderColor: "#A9A9A9",
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});
