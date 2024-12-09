import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ListingItem = ({ route }) => {
  const { postId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listing Details</Text>
      <Text>Post ID: {postId}</Text>
      {/* Fetch and display more details based on postId */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ListingItem;
