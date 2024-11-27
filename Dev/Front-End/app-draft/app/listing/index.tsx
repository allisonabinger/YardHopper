// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams } from "expo-router";
// import mockData from "@/mockData.json";

// export default function ListingDetailIndex() {
//   const router = useRouter();
//   const postId = useLocalSearchParams<{ postId?: string }>();

//   if (!postId) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: Missing post ID</Text>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={28} color="#159636" />
//           <Text>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const listing = mockData.listings.find((item) => item.postId === postId);

//   if (!listing) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: Listing not found</Text>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={28} color="#159636" />
//           <Text>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { title, description, address, dates, images, categories } = listing;
//   const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
//   const date = dates.length > 0 ? dates[0] : "No date available";

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>{title}</Text>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={28} color="#159636" />
//         </TouchableOpacity>
//       </View>

//       {/* Image Carousel */}
//       <ScrollView horizontal pagingEnabled style={styles.imageCarousel}>
//         {images.map((img, idx) => (
//           <Image key={idx} source={{ uri: img.uri }} style={styles.image} />
//         ))}
//       </ScrollView>

//       {/* Address */}
//       <Text style={styles.address}>{formattedAddress}</Text>
//       <Text style={styles.date}>Date: {date}</Text>

//       {/* Description */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Description</Text>
//         <Text style={styles.sectionContent}>{description}</Text>
//       </View>

//       {/* Categories */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Categories</Text>
//         {categories.map((cat) => (
//           <Text key={cat} style={styles.category}>{cat}</Text>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#159636",
//   },
//   imageCarousel: {
//     height: 200,
//     marginBottom: 16,
//   },
//   image: {
//     width: 300,
//     height: 200,
//     marginRight: 10,
//   },
//   address: {
//     fontSize: 16,
//     color: "#666666",
//     marginBottom: 8,
//   },
//   date: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 16,
//   },
//   section: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#159636",
//     marginBottom: 8,
//   },
//   sectionContent: {
//     fontSize: 14,
//     color: "#333333",
//   },
//   category: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 4,
//   },
// });
