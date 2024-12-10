import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { useListingContext } from "@/app/context/ListingContext";
import { useAuth } from '@/components/AuthProvider';

const allCategories = [
  "Decor & Art", "Clothing", "Shoes & Accessories", "Pet", "Tools/Parts",
  "Kitchenware", "Textiles", "Furniture", "Books & Media", "Seasonal/Holiday",
  "Appliances", "Electronics", "Hobbies", "Sports/Outdoors", "Kids", "Other"
];

export default function SaleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listingData, updateListingData, updateListing } = useListingContext();
  const sale = listingData;
  const { getValidIdToken, user } = useAuth();


  const [startDate, setStartDate] = useState(sale.startDate);
  const [endDate, setEndDate] = useState(sale.endDate);
  const [startTime, setStartTime] = useState(sale.startTime);
  const [endTime, setEndTime] = useState(sale.endTime);
  const [selectedCategories, setSelectedCategories] = useState(new Set(sale.categories || []));
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<"start" | "end" | null>(null);
  // const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  // const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleUpdateSale = () => {
    const updatedData = {
      title: sale.title,
      description: sale.description,
      startDate,
      endDate,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      categories: Array.from(selectedCategories),
    };

    updateListing(postId, updatedData, token); // Update global context
    console.log("Updated sale data:", updatedData);
    Alert.alert("Success", "Listing updated successfully!");
    router.back(); // Navigate back
  };

  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      const start = new Date(startDate);
      const end = new Date(day.dateString);

      if (end >= start) {
        setEndDate(day.dateString);
      } else {
        Alert.alert("Invalid Date", "End date must be after the start date.");
      }
    }
  };


  const handleDeleteSale = () => {
    console.log('Deleting sale:', id);
    // In a real app, you would send a delete request to your backend
    router.back();
  };

  const getDatesInRange = (start, end) => {
    const dates = {};
    let currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      dates[dateString] = {
        selected: true,
        color: "#159636",
        textColor: "white",
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const removeCategory = (category) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
  };

  const [temporarySelectedCategories, setTemporarySelectedCategories] = useState(new Set(sale.categories));

// Function to toggle category selection in the temporary state
const toggleTemporaryCategory = (category) => {
  setTemporarySelectedCategories((prev) => {
    const updatedSet = new Set(prev);
    if (updatedSet.has(category)) {
      updatedSet.delete(category);
    } else {
      updatedSet.add(category);
    }
    return updatedSet;
  });
};

return (
  <ScrollView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Update Listing</Text>
    </View>

    {/* Sale Details */}
    <View style={styles.cardContainer}>
      <Image source={sale.image} style={styles.image} />
      <TouchableOpacity style={styles.imageButton}>
        <Text style={styles.buttonText}>Change Photo</Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Update Title</Text>
      <TextInput
        style={styles.input}
        value={sale.title}
        onChangeText={(text) => setSale((prevSale) => ({ ...prevSale, title: text }))}
        placeholder="Sale Title"
      />

      <Text style={styles.inputLabel}>Update Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={sale.description}
        onChangeText={(text) => setSale((prevSale) => ({ ...prevSale, description: text }))}
        placeholder="Sale Description"
        multiline
      />

      {/* Calendar */}
      <View style={styles.card}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...(startDate && endDate ? getDatesInRange(startDate, endDate) : {}),
            [startDate]: {
              selected: true,
              startingDay: true,
              color: "#159636",
              textColor: "white",
            },
            [endDate]: {
              selected: true,
              endingDay: true,
              color: "#159636",
              textColor: "white",
            },
          }}
          markingType="period"
          theme={{
            arrowColor: "#159636",
            textMonthFontWeight: "semibold",
            todayTextColor: "#159636",
          }}
        />
      </View>

      {/* Time Picker */}
      <View style={styles.timePickerWrapper}>
        <View style={styles.timePickerRow}>
          {/* Start Time */}
          <View style={styles.timePickerContainer}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setCurrentPicker("start")}
            >
              <Text>
                startTime
              </Text>
            </TouchableOpacity>
          </View>

          {/* End Time */}
          <View style={styles.timePickerContainer}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setCurrentPicker("end")}
            >
              <Text>
                endTime
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Picker Modal */}
        <Modal
          visible={currentPicker !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCurrentPicker(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentPicker === "start" ? "Select Start Time" : "Select End Time"}
              </Text>
              <DateTimePicker
                value={currentPicker === "start" ? startTime : endTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    if (currentPicker === "start") {
                      setStartTime(selectedTime);
                    } else if (currentPicker === "end") {
                      if (selectedTime > startTime) {
                        setEndTime(selectedTime);
                      } else {
                        Alert.alert("Invalid Time", "End time must be after start time.");
                      }
                    }
                  }
                  setCurrentPicker(null); // Close the modal
                }}
              />
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setCurrentPicker(null)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.selectedCategories}>
          {Array.from(selectedCategories).map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryChip}
              onPress={() => removeCategory(category)}
            >
              <Text style={styles.categoryChipText}>{category}</Text>
              <Ionicons name="close-circle" size={16} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowAddCategory(true)}
        >
          <Text style={styles.addCategoryButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      {/* Update and Delete Buttons */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateSale}>
        <Text style={styles.buttonText}>Update Sale</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSale}>
        <Text style={styles.buttonText}>Delete Sale</Text>
      </TouchableOpacity>
    </View>

    {/* Add Category Modal */}
    <Modal
      visible={showAddCategory}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddCategory(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Categories</Text>
          <ScrollView style={styles.categoryList}>
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryItem,
                  temporarySelectedCategories.has(category) &&
                    styles.modalCategoryItemSelected,
                ]}
                onPress={() => toggleTemporaryCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    temporarySelectedCategories.has(category) &&
                      styles.modalCategoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              setSelectedCategories(new Set(temporarySelectedCategories));
              setShowAddCategory(false);
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <View style={{ height: 70 }} />
  </ScrollView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: '#159636',
    flex: 1,
    marginLeft: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    margin: 16,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: '#159636',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 45,
    width: '50%',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 28,
  },
  timePickerWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#159636',
  },
  categoriesContainer: {
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#159636',
    marginBottom: 8,
  },
  selectedCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#159636',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  addCategoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#159636',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addCategoryButtonText: {
    color: '#159636',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#159636',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
    width: '50%',
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',

  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#159636',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#159636',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeModalButton: {
    backgroundColor: '#159636',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalCategoryItemSelected: {
    backgroundColor: '#159636', // Green background
    borderRadius: 8,
  },
  modalCategoryTextSelected: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#159636',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderRadius: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#CCCCCC',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  inlinePicker: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    elevation: 4, // For shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4, // For shadow on iOS
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
});