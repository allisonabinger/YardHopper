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
import { useSavedListings } from "@/app/context/SavedListingsContext";
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
  const { savedListings, addSavedListing, removeSavedListing, loading, error } = useSavedListings();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const router = useRouter();


  const onRefresh = () => {
    setRefreshing(true);
    // Assuming the `fetchSavedListings` function is automatically triggered by the context.
    setRefreshing(false);
  };

  const handleToggleLike = (postId: string) => {
    removeSavedListing(postId);
  };

  const renderItem = ({ item }: { item: ListingItem }) => (
    <Card
      images={item.images.map((img) => ({ uri: img.uri }))}
      postId={item.postId}
      title={item.title}
      description={item.description}
      address={`${item.address.street}, ${item.address.city}, ${item.address.state}`}
      date={item.dates[0]}
      categories={item.categories}
      isLiked={true}
      onToggleLike={() => handleToggleLike(item.postId)}
      route={() =>
        router.push({
          pathname: "./listing/[id]",
          params: { id: item.postId },
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Posts</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading saved posts...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : savedListings.length === 0 ? (
        <Text style={styles.emptyText}>No saved posts available.</Text>
      ) : (
        <FlatList
          data={savedListings}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#159636", "#28a745", "#85e085"]}
              tintColor="#159636"
            />
          }
        />
      )}
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
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#FF0000",
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
