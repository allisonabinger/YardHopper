import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import mockData from "@/mockData.json";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [liked, setLiked] = useState(false);

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Missing post ID</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#159636" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const listing = mockData.listings.find((item) => item.postId === id);

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Listing not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#159636" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { title, description, address, dates, startTime, endTime, images, categories } = listing;
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const date = dates.length > 0 ? dates[0] : "No date available";

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button Only */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#159636" />
        </TouchableOpacity>
      </View>

      {/* Additional Details */}
      <View style={styles.cardContainer}>
        {/* Image Carousel */}
        <ScrollView horizontal pagingEnabled style={styles.imageCarousel}>
          {images.map((img, idx) => (
            <Image key={idx} source={{ uri: img.uri }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Like Button */}
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#159636" : "gray"}
          />
        </TouchableOpacity>

        {/* Address and Date/Time */}
        <Text style={styles.address}>{formattedAddress}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.date}>Date(s): {formatDate(date)}</Text>
          <Text style={styles.time}>
            {formatTime(startTime)} - {formatTime(endTime)}
          </Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.listingTitle}>{title}</Text>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionContent}>{description}</Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#159636",
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 2,
    padding: 16,
    marginTop: 16,
    position: "relative", // Ensures the like button is positioned correctly
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageCarousel: {
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginVertical: 8,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  listingTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderColor: "#5555",
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 16,
  },
  dateTimeContainer: {
    margin: 10,
    alignItems: "flex-start",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
});
