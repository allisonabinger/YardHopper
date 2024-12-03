import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import PageLayout from "./PageLayout";
import { useListingContext } from "./context/ListingContext";

export default function AddListingDetails() {
  const { listingData, updateListingData } = useListingContext();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1); // Page navigation state
  const [isGeoActive, setIsGeoActive] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const fetchGeolocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to auto-fill the address."
        );
        setIsGeoActive(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      const [geocodedAddress] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodedAddress) {
        updateListingData({
          address: {
            street: geocodedAddress.street || "",
            city: geocodedAddress.city || "",
            state: geocodedAddress.region || "",
            zip: geocodedAddress.postalCode || "",
          },
        });
      } else {
        Alert.alert("Error", "Unable to fetch address information.");
        setIsGeoActive(false);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching the location.");
      console.error(error);
      setIsGeoActive(false);
    }
  };

  const handleDayPress = (selectedDate: string) => {
    const { listingData, updateListingData } = useListingContext();

    if (!listingData.startDate) {
      // If no startDate is set, set the selectedDate as startDate
      updateListingData({ startDate: selectedDate, dates: [selectedDate] });
    } else if (!listingData.endDate) {
      // If startDate is set but no endDate, set the selectedDate as endDate
      const startDate = new Date(listingData.startDate);
      const endDate = new Date(selectedDate);

      if (startDate > endDate) {
        // If selected endDate is before startDate, swap them
        updateListingData({
          startDate: selectedDate,
          endDate: listingData.startDate,
          dates: getDatesInRange(selectedDate, listingData.startDate),
        });
      } else {
        // Valid range, set endDate and update dates array
        updateListingData({
          endDate: selectedDate,
          dates: getDatesInRange(listingData.startDate, selectedDate),
        });
      }
    } else {
      // If both startDate and endDate are set, reset to start new selection
      updateListingData({
        startDate: selectedDate,
        endDate: undefined,
        dates: [selectedDate],
      });
    }
  };

  const getDatesInRange = (start: string, end: string): string[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];

    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split("T")[0]); // Format as "yyyy-mm-dd"
      startDate.setDate(startDate.getDate() + 1); // Increment by 1 day
    }

    return dates;
  };

  const validatePage1 = () => {
    const { title, description, address } = listingData;
    const missingFields = [];

    if (!title.trim()) missingFields.push("Title");
    if (!description.trim()) missingFields.push("Description");
    if (!address.street.trim()) missingFields.push("Street Address");
    if (!address.city.trim()) missingFields.push("City");
    if (!address.state.trim()) missingFields.push("State");
    if (!address.zip.trim()) missingFields.push("ZIP Code");

    if (missingFields.length > 0) {
      Alert.alert(
        "Incomplete Details",
        `Please fill out the following fields before proceeding:\n\n${missingFields.join(
          "\n"
        )}`
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validatePage1()) {
      router.push("/add-listing-details-2");
    }
  };

  const handlePublish = () => {
    if (validatePage1() && startDate && endDate) {
      Alert.alert("Success", "Your listing has been published!");
    } else {
      Alert.alert("Error", "Please complete all required fields.");
    }
  };


  return (
    <PageLayout step={2} steps={4}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Page Content */}
          {currentPage === 1 ? (
            <View style={styles.form}>
              {/* Page 1: Title, Description, and Address */}
              <Text style={styles.title}>Add Listing Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />

              <View style={styles.addressHeader}>
                <Text style={styles.label}>Address</Text>
                <TouchableOpacity
                  style={[
                    styles.geoButton,
                    isGeoActive && styles.geoButtonActive,
                  ]}
                  onPress={() => {
                    setIsGeoActive((prev) => !prev);
                    fetchGeolocation();
                  }}
                >
                  <MaterialIcons
                    name="my-location"
                    size={20}
                    color={isGeoActive ? "#fff" : "#7f7f7f"}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={address.street}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, street: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={address.city}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, city: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={address.state}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, state: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="ZIP Code"
                keyboardType="numeric"
                value={address.zip}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, zip: text }))
                }
              />

              <TouchableOpacity
                style={styles.publishButton}
                onPress={handleNext} // Validate and navigate to page 2
              >
                <Text style={styles.publishText}>Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>

            {/* Page 2: Start/End Dates and Times */}
            <Text style={styles.title}>Select Dates and Times</Text>

            {/* Calendar Card */}
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

                <View style={styles.timerPickerContainer}>
                  <Text style={styles.label}>End Time</Text>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      if (selectedTime >= startTime) {
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

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={styles.publishButton}
                onPress={handlePublish}
              >
                <Text style={styles.publishText}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#white", marginTop: -50 },
  scrollContainer: { flexGrow: 1, marginBottom: 0 },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center"},
  backArrow: { fontSize: 24, marginRight: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#159636", marginBottom: 24},
  form: { flex: 1 },
  label: { fontSize: 16, fontWeight: "bold", color: "#159636" },
  calenderLabel: { fontSize: 16, fontWeight: "bold", color: "#555", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#555",
    fontSize: 16,
    backgroundColor: "#f0f0f0",
  },
  textArea: { height: 100, textAlignVertical: "top", marginBottom: 24 },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  geoButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  geoButtonActive: {
    backgroundColor: "#159636",
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
  timePickerWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%"
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 4, // For Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 12,
  },
  calendar: {
    borderRadius: 8,
    overflow: "hidden",
  },
});