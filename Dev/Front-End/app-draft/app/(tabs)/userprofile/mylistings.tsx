import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import Card from "@/components/Card";

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

// const Card: React.FC<{
//   title: string;
//   description: string;
//   image: any;
//   onPress: () => void;
// }> = ({ title, description, image, onPress }) => (
//   <TouchableOpacity style={styles.card} onPress={onPress}>
//     <Image source={{ uri: image }} style={styles.cardImage} />
//     <View style={styles.cardContent}>
//       <Text style={styles.cardTitle}>{title}</Text>
//       <Text style={styles.cardDescription}>{description}</Text>
//     </View>
//   </TouchableOpacity>
// );

export default function MyListings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState<ListingItem[]>([]);

  const { getIdToken, user } = useAuth();
  const router = useRouter();


  const fetchUserListings = async () => {

    // console.log('User data:', auth.user);
    // const currentUser = auth.user;

    try {

      const idToken = await getIdToken();
      if (!idToken) {
        console.error("Unable to retrieve ID token. User might not be authenticated.");
        return;
      }
      console.log("idToken: ", idToken);
      if (loading) {
        console.warn("Fetch already in progress, skipping duplicate request...");
        return;
      }
      setLoading(true);
      setError(null);

      // Build the URL dynamically based on the parameters
      let url = `https://yardhopperapi.onrender.com/api/users/listings`;

      console.log("Fetching data from:", url); // Log URL for debugging

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      // Log the response status for debugging
      console.log("Response Status:", response.status);

      // Fetch the data
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        console.log("Data contains valid listings. Updating state...");
        setListings(data);
      } else {
        console.error("Unexpected data format: ", data);
      }

      // Log the fetched data for debugging
      console.log("Fetched data:", data);

      setListings(data);

    } catch (error: any) {
      console.error("Error while fetching listings:", error.message);
      setError(error.message || "Failed to load listings");
    } finally {
      console.log("Fetch complete. Setting loading to false.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching listings...");
      fetchUserListings();
    }
  }, [user]);

  const renderItem = ({ item }: { item: ListingItem }) => {
    console.log("Rendering item:", item.title, "Post ID:", item.postId);
    return (
      <Card
        postId={item.postId}
        title={item.title}
        description={item.description}
        image={item.images[0]?.uri || "https://example.com/default-image.jpg"}
        address={`${item.address.street}, ${item.address.city}`}
        date={item.dates[0]}
        categories={item.categories || []}
        onPress={() =>
          router.push({
            pathname: "./userprofile/(sale)/[id]",
            params: { id: item.postId },
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Listings</Text>
      </View>

      {/* List */}
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId}
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
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
  },
});
