import React, { useEffect, useRef } from "react";
import { Animated, Easing, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const PageLayout = ({ children, step = 1, steps = 3 }) => {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current; // Animated value for progress bar

  useEffect(() => {
    const targetWidth = (step / steps) * 100;

    // Animate the progress bar
    Animated.timing(progressAnim, {
      toValue: targetWidth,
      duration: 500, // Animation duration in milliseconds
      easing: Easing.inOut(Easing.ease), // Easing function
      useNativeDriver: false, // Use native driver (false since we're animating width)
    }).start();
  }, [step, steps, progressAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
            if (router.canGoBack()) {
                router.back(); // Navigate back if possible
            } else {
              router.push("../(tabs)/index"); // Fallback to homepage or another default route
            }
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progress, { width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
            }) }]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 16,
    padding: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
});

export default PageLayout;