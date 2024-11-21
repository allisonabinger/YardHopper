import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import LogoutComponent from '@/components/LogoutComponent';
import { Link } from 'expo-router';
import { getAuth } from 'firebase/auth';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch the current user's email
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      setUserEmail('Guest'); // Fallback if no user is signed in
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Gear Icon */}
        <Ionicons name="settings-outline" size={24} color="white" />
        {/* Header Text */}
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={32} color="#666" />
          </View>
          <Text style={styles.profileName}>{userEmail}</Text>
        </View>

        <Text style={styles.sectionTitle}>Account Settings</Text>

        <Pressable style={styles.menuItem}>
          <Ionicons name="share-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Share</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="bookmark-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Saved posts</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="eye-outline" size={24} color="#333" />
          <Text style={styles.menuText}>View your listings</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
        </Pressable>

        <Link href="/userprofile/changepassword" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={24} color="#333" />
            <Text style={styles.menuText}>Change password</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <LogoutComponent style={styles.menuItem}>
          <Text style={styles.menuText}>Log out</Text>
        </LogoutComponent>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',  // White background for the content area
  },
  header: {
    height: '35%',  // Green header takes up 30% of the screen
    backgroundColor: '#159636',  // Green color
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',  // Vertically center items in the header
    paddingBottom: 100,
    position: 'absolute',  // Position this element absolutely at the top
    width: '100%',  // Full width
    paddingLeft: 35,  // Adds space to the left side
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,  // Adds spacing between the icon and the text
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    marginTop: 150,  // Adjust to push the card down a bit (the height of the header)
    marginHorizontal: 35,  // Horizontal padding/margin for the card
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 4,  // Shadow for Android
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
});