import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";

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

const Card: React.FC<{
  title: string;
  description: string;
  image: any;
  onPress: () => void;
}> = ({ title, description, image, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function MyListings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState<ListingItem[]>([]);

  const router = useRouter();


  const fetchUserListings = async () => {

    const auth = useAuth();
    const currentUser = auth.user;
    const idToken = await currentUser?.getIdToken();
    console.log(idToken);
    if (loading) return; // Prevent multiple calls
    setLoading(true);

    setError(null);

    try {
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

      // Log the fetched data for debugging
      console.log("Fetched data:", data);

      setListings(data.listings);

    } catch (error: any) {
      setError(error.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  const renderItem = ({ item }: { item: ListingItem }) => (
    <Card
      title={item.title}
      description={item.description}
      image={item.images[0]?.uri || "https://example.com/default-image.jpg"}
      onPress={() =>
        router.push({
          pathname: "./userprofile/(sale)/[id]",
          params: { id: item.postId },
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
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

