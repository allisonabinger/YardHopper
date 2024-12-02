import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
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
    marginBottom: 4,
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
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dateTimeContainer: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
});
