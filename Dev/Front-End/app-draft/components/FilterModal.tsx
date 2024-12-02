import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Slider from "@react-native-community/slider";

const categories = [
  "Decor & Art", "Clothing", "Shoes & Accessories", "Pet", "Tools/Parts",
  "Kitchenware", "Textiles", "Furniture", "Books & Media", "Seasonal/Holiday",
  "Appliances", "Electronics", "Hobbies", "Sports/Outdoors", "Kids", "Other"
];

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  radius: number;
  setRadius: (value: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  radius,
  setRadius,
  selectedCategories,
  setSelectedCategories,
}) => {
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter</Text>

              {/* Radius Slider */}
              <Text style={styles.sliderLabel}>Radius: {radius} miles</Text>
              <Slider
                style={styles.slider}
                minimumValue={15}
                maximumValue={50}
                step={5}
                value={radius}
                onValueChange={setRadius}
                minimumTrackTintColor="#159636"
                maximumTrackTintColor="#EFEFF0"
                thumbTintColor="#159636"
              />

              {/* Categories */}
              <Text style={styles.categoriesTitle}>Categories</Text>
              <ScrollView style={styles.categoriesContainer}>
                <View style={styles.categoriesWrapper}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        selectedCategories.includes(category) &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategories.includes(category) &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Apply Button */}
              <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoriesContainer: {
    maxHeight: 300,
  },
  categoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F0F0F0",
  },
  selectedCategory: {
    backgroundColor: "#159636",
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "white",
  },
  applyButton: {
    backgroundColor: "#159636",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilterModal;

