import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
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

  const handlePublish = () => {
    if (startDate && endDate) {
      Alert.alert("Success", "Your listing has been published!");
    } else {
      Alert.alert("Error", "Please select valid dates and times.");
    }
  };

  return (
    <PageLayout step={3} steps={3}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Select Dates and Times</Text>
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
            />
          </View>

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

          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishText}>Publish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#white", marginTop: -50 },
    scrollContainer: { flexGrow: 1, marginBottom: 0 },
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center"},
    backArrow: { fontSize: 24, marginRight: 8 },
    title: { fontSize: 24, fontWeight: "bold", color: "#159636", marginBottom: 24, marginTop: 16 },
    form: { flex: 1 },
    label: { fontSize: 16, fontWeight: "bold", color: "#159636", marginTop: 0, marginBottom: 8, marginLeft: 8 }, 
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
      width: "100%"
    },
    timePickerContainer: {
      flex: 1,
      alignItems: "center",
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