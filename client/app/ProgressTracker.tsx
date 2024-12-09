import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Replace with your icon library
import { useRouter } from 'expo-router';

const ProgressTracker = ({ step, steps, height, onBack }) => {
    const [width, setWidth] = React.useState(0);
    const animatedValue = React.useRef(new Animated.Value(-1000)).current;
    const reactive = React.useRef(new Animated.Value(-1000)).current;

    const router = useRouter();

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [reactive]);

    React.useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width, reactive]);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back(); // Navigate back if possible
            } else {
              router.push("../(tabs)/index"); // Redirect to homepage explicitly
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>


            {/* Progress Tracker */}
            <View style={styles.progressContent}>
                <Text style={styles.progressText}/>
                <View
                    onLayout={(e) => {
                        const newWidth = e.nativeEvent.layout.width;
                        setWidth(newWidth);
                    }}
                    style={styles.progressBarContainer}
                >
                    <View style={{ ...styles.progressBar, height, borderRadius: height }} />
                    <Animated.View
                        style={{
                            height,
                            width,
                            borderRadius: height,
                            backgroundColor: '#159636',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: [{ translateX: animatedValue }],
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backButton: {
        marginRight: 12,
        marginTop: 25,
    },
    progressContent: {
        flex: 1,
    },
    progressText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: '900',
        marginBottom: 8,
    },
    progressBarContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        borderRadius: 10,
    },
    progressBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
});

export default ProgressTracker;