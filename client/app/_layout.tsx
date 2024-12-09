import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/components/AuthProvider';
import { ListingProvider } from '@/app/context/ListingContext'
import { SavedListingsProvider } from '@/app/context/SavedListingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';

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

  return (
    <AuthProvider>
      <ListingProvider>
        <SavedListingsProvider>
          <ThemeProvider value={DefaultTheme}>
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
          </ThemeProvider>
          <StatusBar style="auto" />
        </SavedListingsProvider>
      </ListingProvider>
    </AuthProvider>
  );
}
