import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28}
              name={focused ? 'navigate-circle' : 'navigate-circle-outline'}
              color={"#159636"}
            />
          )
        }}
      />
      <Tabs.Screen
        name="add-listing"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28}
              name={focused ? 'add-outline' : 'add'}
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
            <Ionicons size={28}
            name={focused ? 'person' : 'person-outline'}
            color={"#159636"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="userprofile/changepassword"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="userprofile/mylistings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="userprofile/savedposts"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
