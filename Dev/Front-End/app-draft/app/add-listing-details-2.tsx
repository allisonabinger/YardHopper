import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import PageLayout from "./PageLayout";

export default function AddListingDetailsPage2() {
  const router = useRouter();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [currentPicker, setCurrentPicker] = useState(null); // 'start' or 'end'

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00 to compare only the date
  
    if (selectedDate < today) {
      Alert.alert("Invalid Date", "Start date cannot be in the past.");
      return;
    }
  
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

  const handlePublish = () => {
    if (startDate && endDate) {
      router.push("/add-listing-details-3");
    } else {
      Alert.alert("Error", "Please select valid dates and times.");
    }
  };

  return (
    <PageLayout step={3} steps={4}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Select Dates & Times</Text>
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
  
          <View style={styles.timePickerRow}>
            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setCurrentPicker("start")}
              >
                <Text>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
            </View>
  
            <View style={styles.timePickerContainer}>
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setCurrentPicker("end")}
              >
                <Text>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
            </View>
          </View>
  
          {/* Modal for Time Picker */}
          <Modal
            visible={currentPicker !== null}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setCurrentPicker(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {currentPicker === "start"
                    ? "Select Start Time"
                    : "Select End Time"}
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
                          Alert.alert(
                            "Invalid Time",
                            "End time must be after start time."
                          );
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
  
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 24,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 4, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timePickerContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    color: "#159636",
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#159636",
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: "#159636",
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    width: "40%",
  },
  closeModalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  timeButton: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
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
});