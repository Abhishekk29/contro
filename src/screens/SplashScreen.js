// src/screens/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("Entry"); // ✅ goes to EntryScreen
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* ✅ App logo animation */}
      <LottieView
        source={require("../../assets/animations/logo.json")} // make sure logo.json exists in src/assets/
        autoPlay
        loop={true}
        style={{ width: 250, height: 250 }}
      />

      {/* ✅ App name fades in */}
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        Contro
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    marginTop: 20,
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
});
