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
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "@/components/FilterModal";
import PopupCardModal from "@/components/PopupCardModal";
import Card from "@/components/Card";
import { useRouter } from "expo-router";
import { useSavedListings} from "../context/SavedListingsContext";

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

export default function HomeScreen() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(25);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Access SavedPostsContext
  const { savedListings, addSavedListing, removeSavedListing, fetchSavedListings } = useSavedListings();

  const router = useRouter();

 // Fetch listings data from API
  const fetchListings = async ({
  isRefresh = false,
  lat = 36.156089,
  long = -95.994973,
  radius = 25,
  selectedCategories = [],
}: {
  isRefresh?: boolean;
  lat?: number;
  long?: number;
  radius?: number;
  selectedCategories?: string[];
} = {}) => {
  if (loading) return; // Prevent multiple calls
  setLoading(true);
  setError(null);

  try {
    // Build the URL dynamically based on the parameters
    let url = `https://yardhopperapi.onrender.com/api/listings?lat=${lat}&long=${long}&radius=${radius}`;

    // Add encoded categories to request
    if (selectedCategories.length > 0) {
      const encodedCategories = selectedCategories.map((category) => encodeURIComponent(category)).join(',');
      url += `&categories=${encodedCategories}`;
    }

    // Fetch the data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Update listings state
    console.log(JSON.stringify(data, null, 2));
    setListings((prevListings) => {
      const newListings = isRefresh ? data.listings : [...prevListings, ...data.listings];
      return newListings.filter(
        (listing: { postId: any; }, index: any, self: any[]) =>
          index === self.findIndex((l: { postId: any; }) => l.postId === listing.postId) // Deduplicate
      );
    });

    // Update page state
    if (isRefresh) setPage(2); // Reset to page 2 for next fetch
    else setPage((prevPage) => prevPage + 1);
  } catch (error: any) {
    setError(error.message || "Failed to load listings");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Fetch both listings and saved listings on initial load
  const initializeData = async () => {
    await Promise.all([fetchListings(), fetchSavedListings()]);
  };

  initializeData();
}, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchListings({ isRefresh: true }), fetchSavedListings()]);
    setRefreshing(false);
  };

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
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
    } else {
      addSavedListing(listing.postId);
    }
  };

  const isSelectedLiked = selectedListing
  ? savedListings.listings.some(
      (savedListing) => savedListing.postId === selectedListing.postId
    )
  : false;

  const renderItem = ({ item }: { item: ListingItem }) => {
    const isLiked = savedListings.listings.some(
      (savedListing) => savedListing.postId === item.postId
    );

    return (
      <Card
        images={item.images?.map((img) => ({ uri: img.uri })) || []}
        postId={item.postId}
        title={item.title}
        description={item.description}
        address={`${item.address.street}, ${item.address.city}`}
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
        <Text style={styles.headerText}>Explore</Text>
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
            name={viewMode === "list" ? "toggle-outline" : "toggle"}
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
          data={listings}
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
          latitude: listings[0]?.g.geopoint._latitude || 37.7749,
          longitude: listings[0]?.g.geopoint._longitude || -122.4194,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {listings.map((item) => (
          <Marker
            key={item.postId}
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
        isLiked={isSelectedLiked}
        onLikeToggle={() => selectedListing && handleToggleLike(selectedListing)}
        onCardPress={(postId) => console.log("Card pressed:", postId)}
      />
      <FilterModal
        visible={filterModalVisible}
        onClose={() => {
          setFilterModalVisible(false);
          fetchListings({ isRefresh: true, selectedCategories, radius});
        }}
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
