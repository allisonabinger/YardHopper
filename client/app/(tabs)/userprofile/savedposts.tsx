import React, { useState, useEffect } from "react";
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
import PopupCardModal from "@/components/PopupCardModal";
import Card from "@/components/Card";
import { useRouter } from "expo-router";
import { useSavedListings } from "../../../contexts/SavedListingsContext";
import { SafeAreaView } from "react-native-safe-area-context";

type ListingItem = {
  title: string;
  description: string;
  address: {
    city: string;
    street: string;
    zip: number;
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

export default function SavedScreen() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

  // Access SavedPostsContext
  const { savedListings, fetchSavedListings, removeSavedListing } = useSavedListings();

  const router = useRouter();

  useEffect(() => {
    fetchSavedListings().then(() => {
      console.log("Saved Listings:", JSON.stringify(savedListings.listings, null, 2));
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedListings();
    // console.log("Fetched saved listings:", savedListings);
    setRefreshing(false);
  };

  const openModal = (listing: ListingItem) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedListing(null);
  };


  const handleToggleLike = (listing: ListingItem) => {
    const isAlreadyLiked = savedListings.listings.some(
      (savedListing) => savedListing.postId === listing.postId
    );
    if (isAlreadyLiked) {
      removeSavedListing(listing.postId);
    }
  };

  const renderItem = ({ item }: { item: ListingItem }) => (
  <Card
    images={item.images?.map((img) => ({ uri: img.uri })) || []}
    postId={item.postId}
    title={item.title || "No title"}
    description={item.description || "No description"}
    address={`${item.address?.street || "Unknown street"}, ${item.address?.city || "Unknown city"}`}
    date={item.dates?.[0] || "No date available"}
    categories={item.categories || []}
    isLiked={true}
    onToggleLike={() => handleToggleLike(item)}
    route={() =>
      router.push({
        pathname: "../../listing/[id]",
        params: { id: item.postId },
      })
    }
  />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Listings</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
          style={styles.toggleButton}
        >
          <Ionicons
            name={viewMode === "list" ? "toggle-outline" : "toggle"}
            size={28}
            color="#159636"
            style={{
              transform: [
                { rotate: viewMode === "list" ? "180deg" : "0deg" }
              ],
            }}
          />
          <Text style={styles.toggleText}>
            {viewMode === "list" ? "Map View" : "List View"}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={savedListings.listings}
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
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: savedListings.listings[0]?.g.geopoint._latitude || 37.7749,
            longitude: savedListings.listings[0]?.g.geopoint._longitude || -122.4194,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
        {savedListings.listings
          .filter((item) => item.g?.geopoint)
          .map((item) => (
            <Marker
              key={item.postId}
              coordinate={{
                latitude: item.g.geopoint._latitude,
                longitude: item.g.geopoint._longitude,
              }}
              title={item.title}
              description={`${item.address?.street || "Unknown"}, ${item.address?.city || "Unknown"}`}
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
        onCardPress={(postId) => console.log("Card pressed:", postId)}
        isLiked={true}
        onLikeToggle={() => selectedListing && handleToggleLike(selectedListing)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
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
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  map: {
    flex: 1,
  },
});
