import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dynamically calculate icon size based on screen width
const dynamicIconSize = width * 0.07;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={dynamicIconSize}
              name={focused ? 'navigate-circle' : 'navigate-circle-outline'}
              color={"#159636"}
            />
          )
        }}
      />
      <Tabs.Screen
        name="add-listing"
        options={{
          title: 'Add Listing',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={dynamicIconSize}
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={"#159636"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="userprofile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={dynamicIconSize}
              name={focused ? 'person' : 'person-outline'}
              color={"#159636"}
            />
          ),
        }}
      />
      <Tabs.Screen name="userprofile/updatesettings" options={{ href: null }} />
      <Tabs.Screen name="userprofile/mylistings" options={{ href: null }} />
      <Tabs.Screen name="userprofile/savedposts" options={{ href: null }} />
      {/* <Tabs.Screen name="userprofile/ProgressTracker" options={{ href: null }} /> */}
      <Tabs.Screen name="userprofile/(sale)/[id]" options={{ href: null }} />
      <Tabs.Screen name="app/register-location" options={{ href: null }} />
      <Tabs.Screen name="app/login" options={{ href: null }} />
    </Tabs>
  );
}
