import React, { useLayoutEffect, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import LogoutComponent from "@/components/LogoutComponent";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { profile, getValidIdToken, deleteUser, logout, refreshProfile } = useAuth();
  const firstName = profile?.first || "User";
  console.log("First Name:", firstName);

  // Refresh profile when the component mounts
  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshProfile();
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    };
    refresh();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: "",
    });
  }, [navigation]);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(); // Use the updated deleteUser from AuthProvider
              Alert.alert("Success", "Your account has been deleted.");
              router.replace("/login");
            } catch (error: any) {
              console.error("Error during account deletion:", error.message);
              Alert.alert("Error", error.message || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Ionicons name="sunny" size={38} color="#159636" style={styles.greetingIcon} />
          <Text style={styles.profileName}>{`Hello, ${firstName}!`}</Text>
        </View>

        <Text style={styles.sectionTitle}>Account Settings</Text>

        <Link href="/userprofile/savedposts" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
            <Text style={styles.menuText}>Saved posts</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <Link href="/(tabs)/userprofile/mylistings" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="eye-outline" size={24} color="#333" />
            <Text style={styles.menuText}>View your listings</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <Link href="/userprofile/updatesettings" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="black" />
            <Text style={styles.menuText}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <LogoutComponent style={styles.menuItem} />

        <Pressable style={styles.menuItem} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color="#FF0000" />
          <Text style={[styles.menuText, styles.deleteAccountText]}>Delete Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: "35%",
    backgroundColor: "#159636",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 120,
    position: "absolute",
    width: "100%",
    paddingLeft: 35,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  greetingIcon: {
    marginRight: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#159636",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    marginTop: 150,
    marginHorizontal: 35,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  deleteAccountText: {
    color: "#FF0000",
  },
});
