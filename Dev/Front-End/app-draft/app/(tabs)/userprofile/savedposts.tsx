import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function SavedPosts() {
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedPosts = async (isRefresh = false) => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://yardhopperapi.onrender.com/api/users/savedListings?page=${isRefresh ? 1 : page}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSavedPosts((prevPosts) =>
        isRefresh ? data.favorites : [...prevPosts, ...data.favorites]
      );
      if (isRefresh) setPage(2); // Reset to page 2 for next fetch
      else setPage(page + 1);
    } catch (error: any) {
      setError(error.message || "Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts(true); // Fetch initial data with refresh logic
  }, []);

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => console.log(`Remove post with ID: ${item.id}`)}
      >
        <Ionicons name="heart" size={24} color="red" />
      </TouchableOpacity>
      <Image
        source={{
          uri:
            item.image ||
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() =>
          router.push({ pathname: "./(sale)/[id]", params: { id: item.id } })
        }
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saved Posts</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#159636" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={savedPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  errorText: {
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
  listContent: {
    paddingVertical: 16,
  },
  cardContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    margin: 20,
    padding: 16,
    elevation: 4,
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
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
  cardDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 8,
  },
  viewDetailsButton: {
    backgroundColor: "#159636",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  viewDetailsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
