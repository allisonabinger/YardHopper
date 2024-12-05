import React, { useState, useRef, useEffect } from "react";
import {
  Easing,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  RefreshControl,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "@/components/FilterModal";
import PopupCardModal from "@/components/PopupCardModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { router } from "expo-router";

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

type RootStackParamList = {
  Home: undefined;
  listing: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(25);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isModalVisible, setModalVisible] = useState(false);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch listings data from API
  const fetchListings = async ({
    isRefresh = false,
    lat = 36.1555,
    long = -95.9950,
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

      // Add pagination
      // url += `&page=${isRefresh ? 1 : page}`;

      // Fetch the data
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Update listings state

      setListings((prevListings) => {
        const newListings = isRefresh ? data.listings : [...prevListings, ...data.listings];
        return newListings.filter(
          (listing, index, self) =>
            index === self.findIndex((l) => l.postId === listing.postId) // Deduplicate
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
    fetchListings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings(true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!loading) {
      await fetchListings();
    }
  };

  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        const storedLikedPosts = await AsyncStorage.getItem("likedPosts");
        if (storedLikedPosts) {
          setLikedPosts(JSON.parse(storedLikedPosts));
        }
      } catch (error) {
        console.error("Failed to load liked posts:", error);
      }
    };

    loadLikedPosts();
  }, []);

  const saveLikedPosts = async (updatedLikedPosts: { [key: string]: boolean }) => {
    try {
      await AsyncStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
    } catch (error) {
      console.error("Failed to save liked posts:", error);
    }
  };

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: !prev[postId] };
      saveLikedPosts(updated);
      return updated;
    });
  };

  const toggleExpand = (postId: string) => {
    const isCurrentlyExpanded = expandedPostId === postId;
    setExpandedPostId(isCurrentlyExpanded ? null : postId);

    // Initialize or reset the animation value
    if (!fadeAnimations[postId]) {
      fadeAnimations[postId] = new Animated.Value(isCurrentlyExpanded ? 1 : 0);
    } else {
      fadeAnimations[postId].setValue(isCurrentlyExpanded ? 1 : 0); // Reset the value
    }

    // Run the spring animation
    Animated.spring(fadeAnimations[postId], {
      toValue: isCurrentlyExpanded ? 0 : 1,
      friction: 9, // Adjust friction for smoothness
      tension: 40, // Adjust tension for the spring's strength
      useNativeDriver: true,
    }).start();
  };

  const openModal = (listing: ListingItem) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedListing(null);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -50 && expandedPostId) {
        toggleExpand(expandedPostId);
      }
    },
  });

  const renderItem = ({ item }: { item: ListingItem }) => {
  const isExpanded = expandedPostId === item.postId;
  const isLiked = likedPosts[item.postId];
  const fadeAnimation = fadeAnimations[item.postId] || new Animated.Value(0);

  return (
    <TouchableOpacity
      onPress={() => toggleExpand(item.postId)}
      activeOpacity={1}
      style={styles.cardContainer}
      {...(isExpanded ? panResponder.panHandlers : {})}
    >
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => toggleLike(item.postId)}
      >
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "#159636" : "gray"}
        />
      </TouchableOpacity>

      <Image
        source={{
          uri: (item?.images?.[0]?.uri) || "https://via.placeholder.com/150",
        }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardAddress}>
        {`${item.address.street}, ${item.address.city}`}
      </Text>

      {isExpanded && (
        <Animated.View style={[styles.expandedDetails, { opacity: fadeAnimation }]}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionContent}>{item.description}</Text>

          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {item.categories.map((cat) => (
              <View key={cat} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>

          {/* Apply the formatDate function */}
          <Text style={styles.date}>Date: {formatDate(item.dates[0])}</Text>

          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => router.push(`/listing/${item.postId}`)}
          >
            <Text style={styles.seeMoreText}>See More Details</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </TouchableOpacity>
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
            style={{
              backgroundColor: viewMode === "list" ? "white" : "#FFFFFF",
              borderRadius: 14, // To make the circle rounded
            }}
            color={viewMode === "list" ? "#159636" : "#159636"} // Set the icon's color
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
          {listings.map((item: { postId: any; g: any; title: any; address: any; description?: string; dates?: string[]; images?: { uri: string; caption: string; }[]; categories?: string[]; }) => (
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
        onLikeToggle={(postId) => toggleLike(postId)}
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
    marginBottom: 70,
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
    // paddingTop: 2,
    paddingBottom: 28,
    paddingHorizontal: 8,
    // paddingVertical: 16,
    // rowGap: 0,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    margin: 20,
    marginBottom: 5,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
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
    shadowOpacity: 0.4,
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
  seeMoreButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#159636",
    borderRadius: 20,
    alignItems: "center",
  },
  seeMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
function setPage(arg0: number) {
  throw new Error("Function not implemented.");
}
