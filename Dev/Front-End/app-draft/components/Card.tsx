import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CardProps {
  postId: string;
  title: string;
  description: string;
  image: string;
  date: string;
  address: string;
  startTime: string;
  endTime: string;
  onPress: (event: GestureResponderEvent) => void;
}

const Card: React.FC<CardProps> = ({
  postId,
  title,
  description,
  image,
  date,
  address,
  startTime,
  endTime,
  onPress,
}) => {
  const [liked, setLiked] = useState(false);

  // Helper function to format the date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (time?: string): string => {
    if (!time || !time.includes(":")) {
      return "Invalid Time"; 
    }

    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#159636" : "gray"}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Date and Time Section */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.date}>Date(s): {formatDate(date)}</Text>
          <Text style={styles.time}>
            {formatTime(startTime)} - {formatTime(endTime)}
          </Text>
        </View>
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
    height: 150,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
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
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  dateTimeContainer: {
    marginTop: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
});
