import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import LogoutComponent from '@/components/LogoutComponent';

export default function SettingsScreen() {
  const navigation = useNavigation();

  // Simulated logged-in user data
  const user = {
    name: "John Doe", // Replace this with dynamic data from your auth provider or state management
  };

  // Extract the first name
  const firstName = user?.name?.split(" ")[0] || "User";

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

  // Greeting Logic
  const currentHour = new Date().getHours();
  const greetings = [
    { start: 6, end: 12, icon: "sunny", text: "Morning" },
    { start: 12, end: 17, icon: "sunny", text: "Afternoon" },
    { start: 17, end: 21, icon: "moon", text: "Evening" },
    { start: 21, end: 24, icon: "moon", text: "Night" },
  ];

  type IoniconsName = "sunny" | "moon";
  const greeting = greetings.find(({ start, end }) => currentHour >= start && currentHour < end);
  const { icon, text } = greeting || { icon: "sunny", text: "Hello" };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="white" />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Ionicons name={icon as IoniconsName} size={38} color="#159636" style={styles.greetingIcon} />
          <Text style={styles.profileName}>{`${text}, ${firstName}!`}</Text>
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

        <Link href="/userprofile/changepassword" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={24} color="#333" />
            <Text style={styles.menuText}>Change password</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <LogoutComponent style={styles.menuItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: '35%',
    backgroundColor: '#159636',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 120,
    position: 'absolute',
    width: '100%',
    paddingLeft: 35,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  greetingIcon: {
    marginRight: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#159636',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginTop: 150,
    marginHorizontal: 35,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
});
