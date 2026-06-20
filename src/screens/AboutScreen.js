// src/screens/AboutScreen.js
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOW_STEPS = [
  "Name your Contro and add how many people are splitting",
  "Add expenses as they happen - hotel, food, cabs, anything",
  "Pick who's in on each expense; shares recalculate instantly",
  "Enter what each person actually paid",
  "The settlement engine works out exactly who owes whom",
  "Export a clean PDF summary and share it with the group",
];

const FEATURES = [
  {
    icon: <Ionicons name="save-outline" size={18} color="#a89bf9" />,
    title: "Save & resume anytime",
    desc: "A Contro isn't a one-time form. Save it mid-trip and keep adding expenses as they happen.",
  },
  {
    icon: <Ionicons name="folder-outline" size={18} color="#a89bf9" />,
    title: "Your Contros, organized",
    desc: "All saved and completed Contros live in one place - in progress and done, clearly separated.",
  },
  {
    icon: <Ionicons name="calculator-outline" size={18} color="#a89bf9" />,
    title: "Live balance tracking",
    desc: "A running coverage bar shows exactly how much of the total is assigned as you go.",
  },
  {
    icon: <Ionicons name="swap-horizontal-outline" size={18} color="#a89bf9" />,
    title: "Smart settlement engine",
    desc: "Automatically works out the minimum number of payments needed to settle everyone up.",
  },
  {
    icon: <Ionicons name="document-text-outline" size={18} color="#a89bf9" />,
    title: "Shareable PDF reports",
    desc: "Generate a clean, structured invoice anyone can read - no app required to view it.",
  },
];

const LINKS = [
  {
    label: "Gmail",
    icon: <Ionicons name="mail-outline" size={18} color="#7c6ff7" />,
    url: "mailto:abhishekanandsharma99@gmail.com",
  },
  {
    label: "GitHub",
    icon: <FontAwesome name="github" size={18} color="#7c6ff7" />,
    url: "https://github.com/Abhishekk29",
  },
  {
    label: "LinkedIn",
    icon: <FontAwesome name="linkedin-square" size={18} color="#7c6ff7" />,
    url: "https://linkedin.com/in/abhisheksharmaendl",
  },
];

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.iconBtn}
        >
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>About</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroAppName}>Contro</Text>
          <Text style={styles.heroVersion}>Expense Settlement App · v1.0</Text>
          <View style={styles.wordBadge}>
            <Text style={styles.wordBadgeText}>✦ Contro = Contribution</Text>
          </View>
          <Text style={styles.heroDesc}>
            Contro tracks group expenses from start to finish not just a single
            split, but an ongoing trip, event, or shared bill you can return to
            anytime. No accounts, no signups.
          </Text>
        </View>

        {/* ── How It Works ── */}
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <View style={styles.stepsCard}>
          {HOW_STEPS.map((step, i) => (
            <View
              key={i}
              style={[
                styles.stepRow,
                i < HOW_STEPS.length - 1 && styles.stepRowBorder,
              ]}
            >
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* ── Features ── */}
        <Text style={styles.sectionLabel}>FEATURES</Text>
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View
              key={f.title}
              style={[
                styles.featureRow,
                i < FEATURES.length - 1 && styles.featureRowBorder,
              ]}
            >
              <View style={styles.featureIconRing}>{f.icon}</View>
              <View style={styles.featureTextBlock}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Storage Note ── */}
        <View style={styles.storageNote}>
          <View style={styles.storageIconRing}>
            <Ionicons name="phone-portrait-outline" size={16} color="#a89bf9" />
          </View>
          <View style={styles.storageTextBlock}>
            <Text style={styles.storageTitle}>Saved on your device</Text>
            <Text style={styles.storageDesc}>
              Your Contros stay on this phone only, nothing is uploaded
              anywhere, which is how Contro works without an account. Saved data
              stays until you delete a Contro, uninstall the app, or clear its
              storage.
            </Text>
          </View>
        </View>

        {/* ── Developer ── */}
        <Text style={styles.sectionLabel}>DEVELOPER</Text>
        <View style={styles.devCard}>
          <View style={styles.devTop}>
            <View style={styles.devAvatar}>
              <Text style={styles.devAvatarText}>AS</Text>
            </View>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Abhishek Sharma</Text>
              <Text style={styles.devRole}>Software Developer</Text>
            </View>
          </View>
          <Text style={styles.devBio}>
            Built Contro to make group expense splitting simple and error-free.
            The goal was a fast utility app with intelligent calculation logic
            and real-time validation.
          </Text>

          {/* Contact buttons */}
          <View style={styles.contactRow}>
            {LINKS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.contactBtn}
                onPress={() => Linking.openURL(item.url)}
                activeOpacity={0.75}
              >
                {item.icon}
                <Text style={styles.contactLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Built with ── */}
        <View style={styles.builtWith}>
          <Text style={styles.builtWithText}>
            Built with React Native · Expo · PDF generation
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1c1c26",
    borderWidth: 0.5,
    borderColor: "#2c2c3a",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { color: "#aaa", fontSize: 18 },
  iconBtnPlaceholder: { width: 36 },
  screenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.2,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 48,
  },

  // Hero card
  heroCard: {
    backgroundColor: "#131318",
    borderWidth: 0.5,
    borderColor: "#1f1f2b",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 22,
  },
  heroLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 14,
  },
  heroAppName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroVersion: {
    fontSize: 12,
    color: "#555",
    marginBottom: 12,
  },
  wordBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124,111,247,0.1)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  wordBadgeText: {
    fontSize: 12,
    color: "#a89bf9",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroDesc: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
  },

  // Section label
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#444",
    letterSpacing: 0.9,
    marginBottom: 10,
    marginTop: 2,
  },

  // Steps card
  stepsCard: {
    backgroundColor: "#131318",
    borderWidth: 0.5,
    borderColor: "#1f1f2b",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 22,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  stepRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a24",
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(124,111,247,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#a89bf9",
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#bbb",
    lineHeight: 18,
  },

  // Features card
  featuresCard: {
    backgroundColor: "#131318",
    borderWidth: 0.5,
    borderColor: "#1f1f2b",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  featureRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a24",
  },
  featureIconRing: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(124,111,247,0.1)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.22)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureTextBlock: { flex: 1 },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ddd",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: "#666",
    lineHeight: 17,
  },

  // Storage note
  storageNote: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(124,111,247,0.06)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.18)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  storageIconRing: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(124,111,247,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  storageTextBlock: { flex: 1 },
  storageTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#a89bf9",
    marginBottom: 4,
  },
  storageDesc: {
    fontSize: 12,
    color: "#777",
    lineHeight: 17,
  },

  // Developer card
  devCard: {
    backgroundColor: "#131318",
    borderWidth: 0.5,
    borderColor: "#1f1f2b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  devTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  devAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(124,111,247,0.15)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  devAvatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#a89bf9",
  },
  devInfo: { flex: 1 },
  devName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ddd",
  },
  devRole: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
  devBio: {
    fontSize: 13,
    color: "#777",
    lineHeight: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#1f1f2b",
    paddingTop: 14,
    marginBottom: 14,
  },

  // Contact buttons
  contactRow: {
    flexDirection: "row",
    gap: 8,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: "#0f0f14",
    borderWidth: 0.5,
    borderColor: "#252535",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    gap: 5,
  },
  contactLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Built with
  builtWith: {
    alignItems: "center",
    paddingBottom: 8,
  },
  builtWithText: {
    fontSize: 11,
    color: "#2a2a3a",
    fontWeight: "500",
  },
});
