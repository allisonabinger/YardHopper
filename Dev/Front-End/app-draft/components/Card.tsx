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
  onPress: (event: GestureResponderEvent) => void;
}

const Card: React.FC<CardProps> = ({ title, description, image, date, address, onPress }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "green" : "#BDBDBD"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    elevation: 4,
    marginBottom: 20,
    padding: 16,
    margin: 15,
    width: "90%",
    alignSelf: "center",
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)',

  },
  imageContainer: {
    borderRadius: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
  },
  cardContent: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#777",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
});

export default Card;
