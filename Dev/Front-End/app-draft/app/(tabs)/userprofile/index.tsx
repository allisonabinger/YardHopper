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
        <Ionicons name="settings-outline" size={24} color="white" />
        <Text style={styles.headerTitle}>Profile</Text>
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

        <Link href="/userprofile/savedposts" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
            <Text style={styles.menuText}>Saved posts</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
          </Pressable>
        </Link>

        <Link href="/userprofile/mylistings" asChild>
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
    backgroundColor: '#159636',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
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
