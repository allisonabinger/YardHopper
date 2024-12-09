# YardHopper - A Garage Sale App

YardHopper is a comprehensive full-stack application developed using Expo, React Native, and Firebase, designed to simplify the process of discovering and organizing garage sales within local communities. Tailored for bargain hunters and enthusiasts who enjoy treasure hunting at yard sales, YardHopper provides a centralized and user-friendly platform for finding nearby sales or promoting one’s own.

With YardHopper, users can effortlessly search for garage sales in their area, explore detailed listings of items available for purchase, and create and manage their own sales. This streamlined experience eliminates the hassle of sifting through scattered sources to find local events.

YardHopper addresses the challenges of locating and organizing garage sales by offering a one-stop solution where users can seamlessly access all the information they need. By consolidating listings and sale details in one intuitive app, YardHopper ensures users spend less time searching and more time enjoying the hunt for unique finds.

## Tools Used

* `@expo/ngrok`: A library for exposing a development server to the internet.
* `@expo/vector-icons`: A library for using icons in Expo apps.
* `@react-native-async-storage/async-storage`: A library for using a local storage on React Native.
* `@react-native-community/datetimepicker`: A library for building a date and time picker in React Native apps.
* `@react-native-community/slider`: A library for building a slider in React Native apps.
* `@react-navigation/bottom-tabs`: A library for building a tab bar in React Native apps.
* `@react-navigation/native`: A library for building navigation in React Native apps.
* `@react-navigation/stack`: A library for building a stack navigator in React Native apps.
* `Expo`: A framework for building cross-platform native apps with React Native.
* `React Native`: A framework for building native mobile apps with React.
* `babel`: A JavaScript compiler.
* `dotenv`: A library for loading environment variables from a .env file.
* `expo-blur`: A library for blurring components in Expo apps.
* `expo-constants`: A library for accessing constants in Expo apps.
* `expo-font`: A library for loading and using fonts in Expo apps.
* `expo-haptics`: A library for accessing haptic feedback on devices in Expo apps.
* `expo-image-picker`: A library for accessing the device's camera and photo library in Expo apps.
* `expo-linking`: A library for linking to other apps in Expo apps.
* `expo-local-authentication`: A library for accessing biometric authentication on devices in Expo apps.
* `expo-location`: A library for accessing the device's location in Expo apps.
* `expo-media-library`: A library for accessing the device's media library in Expo apps.
* `expo-router`: A library for building routes in Expo apps.
* `expo-secure-store`: A library for securely storing data in Expo apps.
* `expo-splash-screen`: A library for building a splash screen in Expo apps.
* `expo-status-bar`: A library for accessing the device's status bar in Expo apps.
* `expo-symbols`: A library for accessing symbols in Expo apps.
* `expo-system-ui`: A library for accessing system UI components in Expo apps.
* `expo-web-browser`: A library for opening web pages in Expo apps.
* `firebase`: A backend platform for building web and mobile applications.
* `react-native-calendars`: A library for building calendars in React Native apps.
* `react-native-maps`: A library for building maps in React Native apps.
* `react-navigation`: A library for building navigation in React Native apps.
* `expo-font`: A library for loading and using fonts in Expo apps.
* `expo-image-picker`: A library for accessing the device's camera and photo library in Expo apps.
* `expo-location`: A library for accessing the device's location in Expo apps.
* `TypeScript`: A superset of JavaScript that adds optional static typing and other features.

## Directories

* `app`: The root directory for the app. Contains the main entry point for the app (`index.tsx`) and other top-level components.
* `components`: Directory containing reusable React components used throughout the app.
* `constants`: Directory containing constants used throughout the app.
* `hooks`: Directory containing custom React hooks used throughout the app.
* `scripts`: Directory containing scripts used for development and deployment.
* `styles`: Directory containing global styles used throughout the app.


## Navigating the Codebase

* `app/index.tsx`: The main entry point for the app. Renders the main navigation stack.
* `app/(tabs)`: The main navigation stack for the app. Contains tabs for different sections of the app.
* `app/(tabs)/discover`: The discover tab. Displays a list of sales and allows users to filter them and view details.
* `app/(tabs)/userprofile`: The user profile tab. Displays the user's profile information and allows them to edit it.
* `app/(tabs)/add-listing`: The add listing tab. Allows the user to add a new sale.
* `app/(tabs)/settings`: The settings tab. Allows the user to edit their account settings.

## Components Used

* `FilterModal`: A component used for filtering sales.
* `PopupCardModal`: A component used for displaying a sale's details.
* `SaleCard`: A component used for displaying a sale.
* `SaleItem`: A component used for displaying a sale's full details.
* `Map`: A component used for displaying a map of active sales.
* `Marker`: A component used for displaying a markers on the map.
* `LogoutComponent`: A component used for handling user logout.
* `HelloWave`: A component used for displaying a greeting animation in sett.
* `AuthProvider`: A component used for authentication context.
* `ExternalLink`: A component used for opening external links.
* `ListingItem`: A component used for displaying an individual listing.
* `ProgressTracker`: A component used for tracking progress within the creation process of new listings.

## Screenshots

[add screen shots here]

## Full Stack Integration

This repository is part of a full-stack application built with Expo, React Native, and Firebase. The backend code can be found in the [YardHopper/Backend](https://github.com/YardHopper/Backend) repository. The backend API is built with Firebase Cloud Functions and uses Firebase Firestore as its database. The front-end code in this repository interacts with the backend API using the Firebase JavaScript SDK.

## Authors:
Chris Gillis
Mark Tipton
Allison Binger
Mariah Bargas
Kier McAlister
