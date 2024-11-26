import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import Slider from "@react-native-community/slider";

// Sample sales data
const salesData = [
  { id: "1", title: "Yard Sale 1", description: "Furniture, clothes, and more!", image: require("@/assets/images/sale1.png") },
  { id: "2", title: "Yard Sale 2", description: "Vintage items and antiques!", image: require("@/assets/images/sale2.png") },
  { id: "3", title: "Yard Sale 3", description: "Electronics and appliances sale.", image: require("@/assets/images/sale3.png") },
  { id: "4", title: "Yard Sale 4", description: "Books, toys, and more!", image: require("@/assets/images/sale4.png") },
  { id: "5", title: "Yard Sale 5", description: "Fashion and accessories.", image: require("@/assets/images/sale5.png") },
  { id: "6", title: "Yard Sale 6", description: "Home décor and art pieces.", image: require("@/assets/images/sale6.png") },
];

const categories = [
  "Decor & Art", "Clothing", "Shoes & Accessories", "Pet", "Tools/Parts", 
  "Kitchenware", "Textiles", "Furniture", "Books & Media", "Seasonal/Holiday", 
  "Appliances", "Electronics", "Hobbies", "Sports/Outdoors", "Kids", "Other"
];

export default function HomeScreen() {
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderItem = ({ item }: { item: typeof salesData[0] }) => (
    <Card
      title={item.title}
      description={item.description}
      image={item.image}
      onPress={() =>
        router.push({
          pathname: "./(sale)/[id]",
          params: { id: item.id },
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity onPress={toggleFilter}>
          <Ionicons
            name={filterModalVisible ? "filter-circle" : "filter-circle-outline"}
            size={28}
            color="#159636"
          />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={salesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={toggleFilter}
      >
        <View style={styles.modalOverlay}>
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
                      selectedCategories.includes(category) && styles.selectedCategory
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategories.includes(category) && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyButton} onPress={toggleFilter}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  listContent: {
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesContainer: {
    maxHeight: 300,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#159636',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
  },
  applyButton: {
    backgroundColor: '#159636',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

