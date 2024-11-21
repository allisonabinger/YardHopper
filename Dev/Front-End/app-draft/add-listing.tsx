import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Easing } from "react-native";

const categories = [
  { id: "1", name: "Decor & Art", subcategories: ["Paintings", "Sculptures", "Wall Art", "Pottery", "Mirrors", "Candles", "Clocks"] },
  { id: "2", name: "Clothing", subcategories: ["Mens", "Womens", "Kids", "Winter", "Summer", "Outerwear", "Belts", "Sunglasses"] },
  { id: "3", name: "Shoes & Accessories", subcategories: ["Jewelry", "Bags", "Mens", "Womens"] },
  { id: "4", name: "Pet", subcategories: ["Cat", "Dog", "Bird", "Exotic", "Other"] },
  { id: "5", name: "Tools/Parts", subcategories: ["Automotive", "Power Tools", "Lawn/Garden", "Trades", "Hand Tools"] },
  { id: "6", name: "Kitchenware", subcategories: ["Cups/Glasses", "Crystal", "Silverware", "Dining", "Utensils", "Gadgets"] },
  { id: "7", name: "Textiles", subcategories: ["Fabrics", "Bedding", "Towels", "Rugs"] },
  { id: "8", name: "Furniture", subcategories: ["Seating", "Tables/Desks", "Storage", "Bedroom", "Outdoor", "Office", "Children's", "Nursery"] },
  { id: "9", name: "Books & Media", subcategories: ["Picture Books", "Novels", "Reference Books", "CDs", "Television Series Sets", "VHS", "Cassettes", "Vinyl"] },
  { id: "10", name: "Seasonal/Holiday", subcategories: ["Christmas", "Halloween", "Costumes", "Gift/Wrapping", "Misc Holiday", "Seasonal Decor"] },
  { id: "11", name: "Appliances", subcategories: ["Large Appliances", "Kitchen Appliances", "Personal Care", "Outdoor", "Cleaning"] },
  { id: "12", name: "Electronics", subcategories: ["TVs/Home Entertainment", "Gaming", "Computer/Accessories", "Personal Devices", "Music/Audio", "Photography"] },
  { id: "13", name: "Hobbies", subcategories: ["Painting", "Yarn", "Sewing", "Woodworking", "Floral/Decorative", "Kids Crafts", "Musical Instruments"] },
  { id: "14", name: "Sports/Outdoors", subcategories: ["Sport Accessories", "Camping Gear", "Bikes/Scooters", "Skating", "Sporting Gear", "Fishing"] },
  { id: "15", name: "Kids", subcategories: ["Clothing", "Toys", "Nursery"] },
  { id: "16", name: "Other", subcategories: [] },
];

const icons = {
  "Decor & Art": "palette",
  Clothing: "tshirt-crew",
  "Shoes & Accessories": "shoe-formal",
  Pet: "paw",
  "Tools/Parts": "tools",
  Kitchenware: "silverware",
  Textiles: "rug",
  Furniture: "sofa",
  "Books & Media": "book-open",
  "Seasonal/Holiday": "calendar",
  Appliances: "fridge",
  Electronics: "desktop-mac",
  Hobbies: "puzzle",
  "Sports/Outdoors": "basketball",
  Other: "dots-horizontal",
  Kids: "baby",
};

export default function AddListingPage() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const dropdownAnimations = useRef({});
  const router = useRouter();

  categories.forEach((cat) => {
    if (!dropdownAnimations.current[cat.id]) {
      dropdownAnimations.current[cat.id] = new Animated.Value(0);
    }
  });

  const toggleCategory = (id, subcategories) => {
    const isExpanded = expandedCategory === id;
  
    // Close the previously expanded category
    if (expandedCategory && expandedCategory !== id) {
      Animated.timing(dropdownAnimations.current[expandedCategory], {
        toValue: 0,
        duration: 400, // Slightly longer for smoothness
        easing: Easing.inOut(Easing.ease), // Smooth easing
        useNativeDriver: false,
      }).start();
    }
  
    // Expand or collapse the current category
    setExpandedCategory(isExpanded ? null : id);
    Animated.timing(dropdownAnimations.current[id], {
      toValue: isExpanded ? 0 : 1,
      duration: 100, // Match the duration
      easing: Easing.inOut(Easing.ease), // Smooth easing
      useNativeDriver: false,
    }).start();
  
    // Manage selected categories
    setSelectedCategories((prev) => {
      if (isExpanded && !subcategories.some((sub) => selectedSubcategories.includes(sub))) {
        return prev.filter((cat) => cat !== id);
      }
      return prev.includes(id) ? prev : [...prev, id];
    });
  };

  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((sub) => sub !== subcategory)
        : [...prev, subcategory]
    );
  };

  const isCategorySelected = (category) => {
    return (
      selectedCategories.includes(category.id) ||
      (category.subcategories || []).some((sub) => selectedSubcategories.includes(sub))
    );
  };

  const renderCategory = ({ section }) => {
    const isSelected = isCategorySelected(section);
    const heightAnimation = dropdownAnimations.current[section.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (section.data.length + 1) * 50],
    });

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.category,
            isSelected && styles.selectedCategory,
          ]}
          onPress={() => toggleCategory(section.id, section.data || [])}
        >
          <Icon
            name={icons[section.name] || "help-circle"}
            size={30}
            color={isSelected ? "#fff" : "#333"}
            style={styles.icon}
          />
          <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
            {section.name}
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.dropdownContainer, { height: heightAnimation }]}>
          {section.data.length > 0 && (
            <Text style={styles.subcategoriesLabel}>Subcategories</Text>
          )}
          {(section.data || []).map((subcategory) => {
            const isSubSelected = selectedSubcategories.includes(subcategory);
            return (
              <TouchableOpacity
                key={subcategory}
                style={[
                  styles.subcategory,
                  isSubSelected && styles.selectedSubcategory,
                ]}
                onPress={() => toggleSubcategory(subcategory)}
              >
                <Text
                  style={[
                    styles.subcategoryText,
                    isSubSelected && styles.selectedSubcategoryText,
                  ]}
                >
                  {subcategory}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Create your listing</Text>
      <Text style={styles.subtitle}>Categories (select all that apply)</Text>

      {/* SectionList */}
      <SectionList
        sections={categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          data: cat.subcategories,
        }))}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={renderCategory}
        renderItem={() => null} // Subcategories are handled inside Animated.View
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]} // Add extra padding for scroll space
        ListFooterComponent={
<TouchableOpacity
  style={styles.continueButton}
  onPress={() => router.push('/add-listing-details')} // Navigate to the second page
>
  <Text style={styles.continueText}>Continue</Text>
</TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  progress: {
    width: "50%",
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: '#159636',
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16, // Ensure enough space for footer
    paddingTop: 16,
  },
  category: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  selectedCategory: {
    backgroundColor: "#4caf50",
    borderColor: "#388e3c",
  },
  icon: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  dropdownContainer: {
    overflow: "hidden",
    marginLeft: 16,
  },
  subcategoriesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    marginLeft: 16,
  },
  subcategory: {
    alignItems: "center",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#c7d3c0",
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  selectedSubcategory: {
    backgroundColor: "#4caf50",
    borderColor: "#388e3c",
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  selectedSubcategoryText: {
    color: "#fff",
  },
  continueButton: {
    backgroundColor: "#159636",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});