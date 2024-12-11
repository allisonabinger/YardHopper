import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/components/AuthProvider';
import { ListingProvider } from '@/contexts/ListingContext';
import { SavedListingsProvider } from '@/contexts/SavedListingsContext';
import { useColorScheme } from 'react-native'; // Use React Native's color scheme hook
import { Colors } from '@/constants/Colors'; // Your color constants

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Define custom themes for light and dark modes
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      text: Colors.light.text,
      primary: Colors.light.tint,
      card: Colors.light.inputBackground,
      border: Colors.light.inputBorder,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      text: Colors.dark.text,
      primary: Colors.dark.tint,
      card: Colors.dark.inputBackground,
      border: Colors.dark.inputBorder,
    },
  };

  return (
    <AuthProvider>
      <ListingProvider>
        <SavedListingsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="add-listing-details" options={{ headerShown: false }} />
              <Stack.Screen name="add-listing-details-2" options={{ headerShown: false }} />
              <Stack.Screen name="add-listing-details-3" options={{ headerShown: false }} />
              <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
              <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="/" options={{ headerShown: false }} />
              <Stack.Screen name="register-location" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </SavedListingsProvider>
      </ListingProvider>
    </AuthProvider>
  );
}
