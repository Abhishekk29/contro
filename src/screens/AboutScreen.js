// src/screens/AboutScreen.js
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App Intro */}
      <Text style={styles.title}>What is Contro?</Text>
      <Text style={styles.description}>
        Contro is a lightweight mobile app designed to instantly split group
        expenses and generate a clean PDF summary. No accounts, no signups just
        quick, accurate splitting when you need it.
      </Text>

      <Text style={styles.highlight}>Contro = Contribution </Text>

      <Text style={styles.description}>
        Whether it's a trip, party, dinner, or event Contro helps you divide
        money fairly and transparently in just a few steps.
      </Text>

      {/* Core Features */}
      <Text style={styles.title}>How It Works ?</Text>

      <View style={styles.features}>
        <Text style={styles.feature}>
          • Add total amount and number of participants
        </Text>
        <Text style={styles.feature}>• Choose Split Mode: Equal or Custom</Text>
        <Text style={styles.feature}>
          • Equal Mode auto-calculates individual shares
        </Text>
        <Text style={styles.feature}>
          • Custom Mode allows manual amount entry
        </Text>
        <Text style={styles.feature}>
          • Live balance bar shows if total is matched
        </Text>
        <Text style={styles.feature}>
          • Generate and share a structured PDF summary
        </Text>
      </View>

      <Text style={styles.description}>
        In Equal Split mode, the total amount is automatically divided among all
        participants. For example, ₹90 split among 3 people assigns ₹30 to each.
      </Text>

      <Text style={styles.description}>
        In Custom Split mode, users manually enter individual amounts. A live
        sliding balance indicator shows whether the entered values are balanced,
        under-assigned, or over-assigned helping prevent mistakes before
        generating the PDF.
      </Text>

      <Text style={styles.description}>
        Contro is built for quick use. Enter → Split → Generate PDF → Done.
        Simple, fast, and reliable.
      </Text>

      {/* About Developer */}
      <Text style={[styles.title, { marginTop: 30 }]}>
        About the Developer 👨🏻‍💻
      </Text>

      <Text style={styles.description}>
        Hi, I’m Abhishek Sharma. I built Contro to make group expense splitting
        simple and error-free. The goal was to create a fast utility app with
        intelligent calculation logic and real-time validation.
      </Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingVertical: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  highlight: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00c2ff",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#bdbdbd",
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 18,
    lineHeight: 22,
  },
  features: {
    alignItems: "flex-start",
    marginHorizontal: 40,
    marginBottom: 20,
  },
  feature: {
    fontSize: 15,
    color: "#ffffff",
    marginVertical: 6,
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 45,
  },
  link: {
    color: "#00c2ff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  separator: {
    color: "#ffffff",
    fontSize: 14,
    marginHorizontal: 5,
  },
});
