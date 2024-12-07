import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import FilterModal from "@/components/FilterModal";
import PopupCardModal from "@/components/PopupCardModal";
import { useSavedPosts } from "@/app/context/SavedPostsContext";
import { useRouter } from "expo-router";

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
  images: { uri: string; caption: string }[];
  categories: string[];
  postId: string;
  g: {
    geopoint: {
      _latitude: number;
      _longitude: number;
    };
  };
};

export default function SavedPosts() {
  const { savedPosts, addSavedPost, removeSavedPost } = useSavedPosts();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const router = useRouter();

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // No additional fetch needed since savedPosts is managed in context
    setRefreshing(false);
  };

  const openModal = (listing: any) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedListing(null);
  };

  // Simplified handleToggleLike function
  const handleToggleLike = (listing: ListingItem) => {
    const isAlreadyLiked = savedPosts.some((post) => post.postId === listing.postId);
    if (isAlreadyLiked) {
      removeSavedPost(listing.postId);
    } else {
      addSavedPost(listing); // Pass the entire listing directly
    }
  };

  const renderItem = ({ item }: { item: ListingItem }) => {
    const isLiked = savedPosts.some((post) => post.postId === item.postId);

    return (
      <Card
        images={item.images?.map((img) => ({ uri: img.uri })) || []}
        postId={item.postId}
        title={item.title}
        description={item.description}
        address={`${item.address}, ${item.address}`}
        date={item.dates[0]}
        categories={item.categories}
        isLiked={isLiked}
        onToggleLike={() => handleToggleLike(item)}
        route={() =>
          router.push({
            pathname: "./listing/[id]",
            params: { id: item.postId },
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Posts</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
          <Ionicons
            name={filterModalVisible ? "filter-circle" : "filter-circle-outline"}
            size={28}
            color="#159636"
          />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
          style={styles.toggleButton}
        >
          <Ionicons
            name={viewMode === "list" ? "map-outline" : "list-outline"}
            size={28}
            color="#159636"
          />
          <Text style={styles.toggleText}>
            {viewMode === "list" ? "Map View" : "List View"}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={savedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#159636", "#28a745", "#85e085"]}
              tintColor="#159636"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saved posts available.</Text>
          }
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: savedPosts[0]?.g?.geopoint?._latitude || 37.7749,
            longitude: savedPosts[0]?.g?.geopoint?._longitude || -122.4194,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {savedPosts.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.g.geopoint._latitude,
                longitude: item.g.geopoint._longitude,
              }}
              title={item.title}
              description={`${item.address.street}, ${item.address.city}`}
              onPress={() => openModal(item)}
            />
          ))}
        </MapView>
      )}

      <PopupCardModal
        isVisible={isModalVisible}
        item={selectedListing}
        onClose={closeModal}
        animation={new Animated.Value(1)}
        onLikeToggle={(postId) => console.log("Toggled like for:", postId)}
        onCardPress={(postId) => console.log("Card pressed:", postId)}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        setRadius={setRadius}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        radius={radius}
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
    justifyContent: "center",
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
    color: "#159636",
  },
  listContent: {
    paddingBottom: 28,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#999",
  },
  map: {
    flex: 1,
  },
});
