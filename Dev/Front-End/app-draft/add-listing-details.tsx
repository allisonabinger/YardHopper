import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddListingDetails() {
  const router = useRouter();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const fetchGeolocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to auto-fill the address.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      const [geocodedAddress] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodedAddress) {
        setAddress({
          street: geocodedAddress.street || "",
          city: geocodedAddress.city || "",
          state: geocodedAddress.region || "",
          zip: geocodedAddress.postalCode || "",
        });
      } else {
        Alert.alert("Error", "Unable to fetch address information.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching the location.");
      console.error(error);
    }
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
      dates[dateString] = { selected: true, color: "#159636", textColor: "white" };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      // Validate that end time is not before start time
      if (selectedTime < startTime) {
        Alert.alert("Invalid Time", "End time cannot be before the start time.");
      } else {
        setEndTime(selectedTime);
      }
    }
    setShowEndTimePicker(false);
  };

  const validateForm = () => {
    const missingFields = [];
  
    if (!address) missingFields.push("Address");
    if (!address.street) missingFields.push("Street Address");
    if (!address.city) missingFields.push("City");
    if (!address.state) missingFields.push("State");
    if (!address.zip) missingFields.push("ZIP Code");
    if (!startDate) missingFields.push("Start Date");
    if (!endDate) missingFields.push("End Date");
    if (!startTime) missingFields.push("Start Time");
    if (!endTime) missingFields.push("End Time");
  
    return missingFields;
  };
  
  const handlePublish = () => {
    const missingFields = validateForm();
  
    if (missingFields.length > 0) {
      Alert.alert(
        "Incomplete Details",
        `Please fill out the following fields before publishing:\n\n${missingFields.join("\n")}`
      );
    } else {
      console.log("Publish Listing"); // Replace with actual publish logic
      Alert.alert("Success", "Your listing has been published!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "100%" }]} />
            </View>
          </View>

          <Text style={styles.title}>Add Listing Details</Text>

          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Enter title" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />

            <View style={styles.addressHeader}>
              <Text style={styles.label}>Address</Text>
              <TouchableOpacity style={styles.geoButton} onPress={fetchGeolocation}>
                <MaterialIcons name="my-location" size={24} color="#7f7f7f" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={address.street}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, street: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={address.state}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, state: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="ZIP Code"
              keyboardType="numeric"
              value={address.zip}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, zip: text }))}
            />

            <Text style={styles.calenderLabel}>Select Start and End Dates</Text>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                ...(startDate && endDate ? getDatesInRange(startDate, endDate) : {}),
                [startDate]: { selected: true, startingDay: true, color: "#159636", textColor: "white" },
                [endDate]: { selected: true, endingDay: true, color: "#159636", textColor: "white" },
              }}
              markingType="period"
              style={{ marginBottom: 24 }}
            />

            {/* Start Time */}
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {/* Start Time Modal */}
            <Modal
              visible={showStartTimePicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowStartTimePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) {
                        setStartTime(selectedTime);
                      }
                      setShowStartTimePicker(false);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowStartTimePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* End Time */}
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {/* End Time Modal */}
            <Modal
              visible={showEndTimePicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowEndTimePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) {
                        // Ensure end time is after start time
                        if (selectedTime < startTime) {
                          Alert.alert("Invalid Time", "End time cannot be before the start time.");
                        } else {
                          setEndTime(selectedTime);
                        }
                      }
                      setShowEndTimePicker(false);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowEndTimePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.publishButton}
              onPress={handlePublish}
            >
              <Text style={styles.publishText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, paddingBottom: 50 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backArrow: { fontSize: 24, marginRight: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#159636", marginBottom: 24 },
  form: { flex: 1, marginTop: 16 },
  label: { fontSize: 16, fontWeight: "bold", color: "#555", marginBottom: 8 },
  calenderLabel: { fontSize: 16, fontWeight: "bold", color: "#555", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: { height: 100, textAlignVertical: "top", marginBottom: 24 },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  geoButton: { padding: 8, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  timePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  timePickerText: { fontSize: 16, color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#159636",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  publishButton: {
    backgroundColor: "#159636",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },
  publishText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  progress: {
    height: "100%",
    backgroundColor: "#159636",
    width: "100%",
    borderRadius: 3,
  },
});