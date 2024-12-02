import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import Card from "./Card";
import { useRouter } from "expo-router";

interface PopupCardModalProps {
  isVisible: boolean;
  item: any | null;
  onClose: () => void;
  animation: Animated.Value;
}

const { height } = Dimensions.get("window");

const PopupCardModal: React.FC<PopupCardModalProps> = ({
  isVisible,
  item,
  onClose,
  animation,
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
      router.push(`/listing/${item.postId}`);
      onClose(); // Close the modal after navigating
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
                image={item.images[0]?.uri || "https://via.placeholder.com/150"}
                date={item.dates[0]}
                address={`${item.address.street}, ${item.address.city}`}
                onPress={handleCardPress} // Redirect to listing/[id]
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
