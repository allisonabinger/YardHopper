import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import Card from "@/components/Card";
import { useRouter } from "expo-router";

interface PopupCardModalProps {
  isVisible: boolean;
  item: any | null;
  onClose: () => void;
  animation: Animated.Value;
  isLiked: boolean;
  onLikeToggle?: (postId: string) => void;
  onCardPress?: (postId: string) => void;}

const { height } = Dimensions.get("window");

const PopupCardModal: React.FC<PopupCardModalProps> = ({
  isVisible,
  item,
  onClose,
  animation,
  isLiked,
  onLikeToggle,
}) => {
  const router = useRouter();

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  if (!item) {
    return null;
  }

  const handleCardPress = () => {
    if (item.postId) {
      onClose();
      router.push(`/listing/${item.postId}`);
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.container, { transform: [{ translateY }] }]}
            onStartShouldSetResponder={() => true}
          >
        <View style={styles.cardContainer}>
          <Card
            postId={item.postId}
            title={item.title}
            description={item.description}
            images={Array.isArray(item.images) ? item.images : [{ uri: "https://via.placeholder.com/150" }]}
            date={item.dates?.[0] || "No date available"}
            address={`${item.address.street}, ${item.address.city}`}
            route={handleCardPress}
            isLiked={isLiked}
            onToggleLike={onLikeToggle}
            isExpanded={false}
            disableToggle
          />
        </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    // backgroundColor: "white",
    width: "100%",
  },
  cardContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default PopupCardModal;
