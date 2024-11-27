import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';

// Mock data (replace with actual data fetching in a real app)
const mockSale = {
  id: '1',
  title: 'Yard Sale 1',
  description: 'Furniture, clothes, and more!',
  image: require('@/assets/images/sale1.png'),
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  categories: ['Furniture', 'Clothes'],
};

const allCategories = [
  "Decor & Art", "Clothing", "Shoes & Accessories", "Pet", "Tools/Parts",
  "Kitchenware", "Textiles", "Furniture", "Books & Media", "Seasonal/Holiday",
  "Appliances", "Electronics", "Hobbies", "Sports/Outdoors", "Kids", "Other"
];

export default function SaleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sale, setSale] = useState(mockSale);
  const [startDate, setStartDate] = useState(sale.startDate);
  const [endDate, setEndDate] = useState(sale.endDate);
  const [startTime, setStartTime] = useState(sale.startTime);
  const [endTime, setEndTime] = useState(sale.endTime);
  const [selectedCategories, setSelectedCategories] = useState(sale.categories);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleUpdateSale = () => {
    const updatedSale = {
      ...sale,
      startDate,
      endDate,
      startTime,
      endTime,
      categories: selectedCategories,
    };
    console.log('Updating sale:', updatedSale);
    // In a real app, you would send this data to your backend
  };

  const handleDeleteSale = () => {
    console.log('Deleting sale:', id);
    // In a real app, you would send a delete request to your backend
    router.back();
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

  const removeCategory = (category) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== category));
  };

  const addCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories(prev => [...prev, category]);
    }
    setShowAddCategory(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#159636" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Sale</Text>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Image */}
        <Image source={sale.image} style={styles.image} />
        <TouchableOpacity style={styles.imageButton}>
          <Text style={styles.buttonText}>Change Photo</Text>
        </TouchableOpacity>

        {/* Title */}
        <TextInput
          style={styles.input}
          value={sale.title}
          onChangeText={(text) => setSale(prevSale => ({ ...prevSale, title: text }))}
          placeholder="Sale Title"
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          value={sale.description}
          onChangeText={(text) => setSale(prevSale => ({ ...prevSale, description: text }))}
          placeholder="Sale Description"
          multiline
        />

        {/* Calendar */}
        <View style={styles.card}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...(startDate && endDate
                ? getDatesInRange(startDate, endDate)
                : {}),
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
            style={styles.calendar}
          />
        </View>

        {/* Time Selectors */}
        <View style={styles.timePickerWrapper}>
          <View style={styles.timePickerRow}>
            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>Start Time</Text>
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            </View>

            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>End Time</Text>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  if (selectedTime && selectedTime >= startTime) {
                    setEndTime(selectedTime);
                  } else {
                    Alert.alert(
                      "Invalid Time",
                      "End time cannot be before start time."
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.selectedCategories}>
            {selectedCategories.map((category) => (
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
          {showAddCategory ? (
            <ScrollView style={styles.categoryList}>
              {allCategories.filter(cat => !selectedCategories.includes(cat)).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryItem}
                  onPress={() => addCategory(category)}
                >
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={() => setShowAddCategory(true)}
            >
              <Text style={styles.addCategoryButtonText}>Add Category</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Update and Delete Buttons */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateSale}>
          <Text style={styles.buttonText}>Update Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSale}>
          <Text style={styles.buttonText}>Delete Sale</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#159636',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    margin: 25,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: '#159636',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  timePickerWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  addCategoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#159636',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  addCategoryButtonText: {
    color: '#159636',
    fontWeight: 'bold',
  },
  categoryList: {
    maxHeight: 150,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 8,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  updateButton: {
    backgroundColor: '#159636',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


