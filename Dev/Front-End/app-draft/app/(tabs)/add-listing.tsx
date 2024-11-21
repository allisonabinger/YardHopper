import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function AddListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const categories = [
    { id: 1, name: 'Decor /Art', icon: 'image-outline' },
    { id: 2, name: 'Clothing', icon: 'shirt-outline' },
    { id: 3, name: 'Furniture', icon: 'bed-outline' },
    { id: 4, name: 'Electronics', icon: 'tv-outline' },
    { id: 5, name: 'Books & Media', icon: 'book-outline' },
    { id: 6, name: 'Hobbies', icon: 'game-controller-outline' },
    { id: 7, name: 'Kitchenware', icon: 'restaurant-outline' },
    { id: 8, name: 'Pets', icon: 'paw-outline' },
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 26);

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const renderCategoriesStep = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.title}>Create your listing</Text>

      <View style={styles.categoriesSection}>
        <Text style={styles.categoryTitle}>Categories</Text>
        <Text style={styles.categorySubtitle}>(select all that apply)</Text>

        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategories.includes(category.id) && styles.selectedCategory
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <Ionicons name={category.icon} size={32} color={selectedCategories.includes(category.id) ? "white" : "black"} />
              <Text style={[
                styles.categoryLabel,
                selectedCategories.includes(category.id) && styles.selectedCategoryText
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderDetailsStep = () => (
    <ScrollView style={styles.content}>
      {/* Listing Title */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Listing title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          placeholderTextColor="#666"
        />
      </View>

      {/* Address Section */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Listing address</Text>
        <View style={styles.addressInputs}>
          <View style={styles.addressInput}>
            <TextInput
              style={styles.input}
              placeholder="Street"
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="location-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Zip"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Listing description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          placeholder="Enter description"
          placeholderTextColor="#666"
        />
      </View>

      {/* Calendar */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.calendar}>
          <View style={styles.weekDays}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDay}>{day}</Text>
            ))}
          </View>
          <View style={styles.dates}>
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  date === 20 && styles.selectedDate
                ]}
              >
                <Text style={[
                  styles.dateText,
                  date === 20 && styles.selectedDateText
                ]}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Time Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Time</Text>
        <View style={styles.timeSelection}>
          <View style={styles.timeInput}>
            <Text>7:00 am</Text>
          </View>
          <Text style={styles.toText}>to</Text>
          <View style={styles.timeInput}>
            <Text>3:00 pm</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
        </View>
      </View>

      {step === 1 ? renderCategoriesStep() : renderDetailsStep()}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => step === 1 ? setStep(2) : console.log('Publish')}
      >
        <Text style={styles.continueButtonText}>
          {step === 1 ? 'Continue' : 'Publish'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    gap: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#159636',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#159636', // Updated green
    marginBottom: 24,
  },
  categoriesSection: {
    gap: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#159636', // Updated green
  },
  categorySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: '#159636', // Updated green
  },
  categoryLabel: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
  },
  continueButton: {
    margin: 16,
    backgroundColor: '#159636', // Updated green
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  addressInputs: {
    gap: 8,
  },
  addressInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    marginLeft: 8,
  },
  textArea: {
    height: 100,
  },
  calendar: {
    gap: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    fontSize: 16,
    color: '#333',
  },
  dates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedDate: {
    backgroundColor: '#159636', // Updated green
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateText: {
    color: 'white',
  },
  timeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toText: {
    fontSize: 16,
    color: '#333',
  },
});
