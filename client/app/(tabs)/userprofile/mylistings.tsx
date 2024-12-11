import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import Card from "@/components/Card";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function MyListings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);

  const { getValidIdToken, user } = useAuth();
  const router = useRouter();

  const fetchUserListings = async () => {
    try {
      const idToken = await getValidIdToken();
      if (!idToken) {
        console.error("Unable to retrieve ID token. User might not be authenticated.");
        return;
      }
      if (loading) return;

      setLoading(true);
      setError(null);

      const url = `https://yardhopperapi.onrender.com/api/users/listings`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setListings(data);
      } else {
        console.error("Unexpected data format");
      }
    } catch (error: any) {
      console.error("Error while fetching listings:", error.message);
      setError(error.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const renderItem = ({ item }: { item: ListingItem }) => (
    <Card
      postId={item.postId}
      title={item.title}
      description={item.description}
      images={Array.isArray(item.images) ? item.images : [{ uri: "https://via.placeholder.com/300x200.png?text=Coming+Soon!" }]}
      address={`${item.address.street}, ${item.address.city}`}
      date={item.dates[0]}
      categories={item.categories || []}
      // disableToggle={true}
      disableLikeButton={true}
      route={() =>
        router.push({
          pathname: "./(sale)/[id]",
          params: { id: item.postId, from: "myLisitings"},
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Listings</Text>
      </View>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 30,
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
    fontSize: 25,
    fontWeight: "500",
    color: "#159636",
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666666",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});
