import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Linking } from 'react-native';

export default function EntryScreen({ navigation }) {
  const handleSignup = () => {
    Alert.alert(
      "Coming Soon",
      "Currently in development!!👨🏻‍💻",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => navigation.navigate('QuickContro')}
      >
        <Text style={styles.buttonText}>Quick Contro (Guest Mode)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.authButton}
        onPress={handleSignup}
      >
       <Text style={styles.buttonText}>Signup / Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.aboutButtonText}>About Contro</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Abhishek Sharma</Text>
        <View style={styles.links}>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:abhishekanandsharma99@gmail.com")}
          >
            Gmail
          </Text>
          <Text style={styles.separator}> | </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://github.com/Abhishekk29")}
          >
            GitHub
          </Text>
          <Text style={styles.separator}> | </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://linkedin.com/in/abhisheksharmaendl")}
          >
            LinkedIn
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181717ff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  guestButton: {
    backgroundColor: '#0b7f3dff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 250,
    alignItems: 'center',
  },
  authButton: {
    backgroundColor: '#0b7f3dff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 250,
    alignItems: 'center',
  },
    aboutButton: {
    backgroundColor: '#0b7f3dff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 250,
    alignItems: 'center',
  },
    aboutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#bbb",
    fontSize: 12,
    marginBottom: 5,
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#089babff",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  separator: {
    color: "#fff",
    fontSize: 12,
    marginHorizontal: 3,
  },
});
