import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage }) => {
  const prev = page > 1 ? page - 1 : 1;

  return (
    <View style={styles.pagination}>
      <View style={styles.buttonContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => setPage(Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={[styles.button, page === 1 && styles.disabledButton]}
        >
          <Text style={[styles.buttonText, page === 1 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => setPage((prev) => prev + 1)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 120,
    paddingVertical: 12,
    backgroundColor: "#1ED2AF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: "#A8A8A8",
  },
  buttonText: {
    color: "#00003c",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledText: {
    color: "#666666",
  },
});

export default Pagination;
