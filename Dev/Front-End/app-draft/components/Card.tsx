import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CardProps {
  images: { uri: string }[];
  postId: string;
  title: string;
  description: string;
  address: string;
  date: string;
  categories?: string[];
  isLiked?: boolean;
  onToggleLike?: (postId: string) => void;
  isExpanded?: boolean;
  disableToggle?: boolean; // Added this prop to disable toggling
  route: () => void;
}

const Card: React.FC<CardProps> = ({
  images = [],
  postId,
  title,
  description,
  address,
  date,
  isLiked,
  categories,
  onToggleLike,
  disableToggle = false,
  route,
}) => {
  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandToggle = () => {
    if (disableToggle) {
      route(); // Trigger onPress if toggling is disabled
      return;
    }
    setIsExpanded(!isExpanded);

    // Animate the fade in or out
    Animated.spring(fadeAnimation, {
      toValue: isExpanded ? 0 : 1,
      friction: 9,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleExpandToggle}>
      {/* Image Carousel Section */}
      <View style={styles.imageContainer}>
        <ScrollView horizontal pagingEnabled style={styles.imageCarousel}>
          {images.length > 0 ? (
            images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))
          ) : (
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onToggleLike?.(postId)}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#159636" : "gray"}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.address}>{address}</Text>

        {isExpanded && (
          <Animated.View
            style={[styles.expandedDetails, { opacity: fadeAnimation }]}
          >
            <Text style={styles.description}>{description}</Text>

            {/* Categories Section */}
            {categories && categories.length > 0 ? (
              <View style={styles.categoriesContainer}>
                {categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noCategories}>No categories available</Text>
            )}

            {/* Date Section */}
            <Text style={styles.date}>Date: {date}</Text>

            {/* See More Details Button */}
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={route}
            >
              <Text style={styles.seeMoreText}>See More Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    margin: 20,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  imageContainer: {
    borderRadius: 8,
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  imageCarousel: {
    height: "100%",
    borderRadius: 10,
  },
  image: {
    height: "100%",
    width: 300,
    borderRadius: 10,
    marginRight: 10,
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardContent: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  expandedDetails: {
    marginTop: 16,
  },
  description: {
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
  noCategories: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginVertical: 8,
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
