import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import LogoutComponent from '@/components/LogoutComponent';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  const navigation = useNavigation();

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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={32} color="#666" />
          </View>
          <Text style={styles.profileName}>John Doe</Text>
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
