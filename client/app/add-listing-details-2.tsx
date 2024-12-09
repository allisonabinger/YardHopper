import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import PageLayout from "./PageLayout";
import { useListingContext } from "./context/ListingContext";
import { useEffect } from "react";

export default function AddListingDetailsPage2() {
  const { listingData, updateListingData } = useListingContext();
  const router = useRouter();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(
    listingData.startTime ? new Date(`1970-01-01T${listingData.startTime}:00`) : new Date()
  );
  const [endTime, setEndTime] = useState(
    listingData.endTime
      ? new Date(`1970-01-01T${listingData.endTime}:00`)
      : new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [currentPicker, setCurrentPicker] = useState<"start" | "end" | null>(
    null
  );

    // Ensure defaults are set in listingData
    useEffect(() => {
      if (!listingData.startTime) {
        updateListingData({ startTime: "07:00" });
      }
      if (!listingData.endTime) {
        updateListingData({ endTime: "08:00" });
      }
    }, [listingData, updateListingData]);

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) return "00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert("Invalid Date", "Start date cannot be in the past.");
      return;
    }

    if (!listingData.startDate || (listingData.startDate && listingData.endDate)) {
      updateListingData({
        startDate: day.dateString,
        endDate: undefined,
        dates: [day.dateString],
      });
    } else if (listingData.startDate && !listingData.endDate) {
      const start = new Date(listingData.startDate);
      const end = new Date(day.dateString);

      if (end >= start) {
        const newDates = getDatesInRange(start, end);
        updateListingData({
          endDate: day.dateString,
          dates: newDates,
        });
      } else {
        Alert.alert("Invalid Date", "End date must be after the start date.");
      }
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handlePublish = () => {
    const today = new Date();

    if (!listingData.startDate || !listingData.endDate) {
      Alert.alert("Error", "Please select valid dates.");
      return;
    }

    if (!listingData.startTime || !listingData.endTime) {
      Alert.alert("Error", "Please select both start and end times.");
      return;
    }

    const parseTime = (time) => {
      if (!time) return null;
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const startTime = parseTime(listingData.startTime);
    const endTime = parseTime(listingData.endTime);

    if (!startTime || !endTime) {
      Alert.alert("Error", "Please select valid times.");
      return;
    }

    if (listingData.startDate === today.toISOString().split("T")[0] && startTime <= today) {
      Alert.alert("Error", "Start time must be in the future.");
      return;
    }

    if (endTime <= new Date(startTime.getTime() + 60 * 60 * 1000)) {
      Alert.alert("Error", "End time must be at least 1 hour after the start time.");
      return;
    }

    router.push("/add-listing-details-3");
  };

  return (
    <PageLayout step={3} steps={4}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Select Dates & Times</Text>
            <View style={styles.card}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                  ...(listingData.dates?.length > 0
                    ? listingData.dates.reduce((acc, date, index, array) => {
                        acc[date] = {
                          selected: true,
                          color: "#159636",
                          textColor: "white",
                          startingDay: index === 0,
                          endingDay: index === array.length - 1,
                        };
                        return acc;
                      }, {})
                    : {}),
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
                  <Text>
                    {listingData.startTime
                      ? new Date(`1970-01-01T${listingData.startTime}:00`).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "Select Start Time"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timePickerContainer}>
                <Text style={styles.label}>End Time</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setCurrentPicker("end")}
                >
                  <Text>
                    {listingData.endTime
                      ? new Date(`1970-01-01T${listingData.endTime}:00`).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "Select End Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                        const formattedTime = formatTime(selectedTime);
                    
                        if (currentPicker === "start") {
                          setStartTime(selectedTime);
                          updateListingData({ startTime: formattedTime });
                        } else if (currentPicker === "end") {
                          const startMinutes = startTime.getMinutes();
                          const endMinutes = selectedTime.getMinutes();
                    
                          // Check if the end time is within 10 minutes of the hour from the start time
                          const diff = Math.abs(startMinutes - endMinutes);
                    
                          if (diff > 10 && diff < 50) {
                            Alert.alert(
                              "Invalid End Time",
                              "End time must be within 10 minutes of an hour from the start time."
                            );
                            return;
                          }
                    
                          const minEndTime = new Date(startTime.getTime() + 1 * 61 * 1000); // 10 minutes after start time
                          if (selectedTime >= minEndTime) {
                            setEndTime(selectedTime);
                            updateListingData({ endTime: formattedTime });
                          } else {
                            Alert.alert(
                              "Invalid End Time",
                              "End time must be at least 60 minutes after the start time."
                            );
                          }
                        }
                      }
                      setCurrentPicker(null);
                    }}
                    textColor="black"
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
      </KeyboardAvoidingView>
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
    fontWeight: "semibold",
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