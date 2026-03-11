import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EntryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Guest Mode */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("QuickContro")}
      >
        <Text style={styles.buttonText}>Create Contro</Text>
      </TouchableOpacity>

      {/* About */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.buttonText}>About Contro</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Abhishek Sharma</Text>
        <View style={styles.links}>
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL("mailto:abhishekanandsharma99@gmail.com")
            }
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
            onPress={() =>
              Linking.openURL("https://linkedin.com/in/abhisheksharmaendl")
            }
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181717",
  },
  logo: { width: 200, height: 200, marginBottom: 50 },
  button: {
    backgroundColor: "#0b7f3d",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 250,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  footer: { position: "absolute", bottom: 20, alignItems: "center" },
  footerText: { color: "#bbb", fontSize: 12, marginBottom: 5 },
  links: { flexDirection: "row", justifyContent: "center" },
  link: { color: "#089bab", fontSize: 12, textDecorationLine: "underline" },
  separator: { color: "#fff", fontSize: 12, marginHorizontal: 3 },
});
