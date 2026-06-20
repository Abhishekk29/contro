// src/screens/EntryScreen.js
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllContros } from "../utils/controStorage";

const FEATURES = ["No signup needed", "PDF export", "Smart splits"];

const LINKS = [
  { label: "Gmail", url: "mailto:abhishekanandsharma99@gmail.com" },
  { label: "GitHub", url: "https://github.com/Abhishekk29" },
  { label: "LinkedIn", url: "https://linkedin.com/in/abhisheksharmaendl" },
];

export default function EntryScreen({ navigation }) {
  const [savedCount, setSavedCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllContros().then((list) => {
        if (active) setSavedCount(list.length);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <View style={styles.logoRing}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appName}>Contro</Text>
        <Text style={styles.tagline}>
          Split smarter.{" "}
          <Text style={styles.taglineAccent}>Settle faster.</Text>
        </Text>

        <View style={styles.pillRow}>
          {FEATURES.map((f) => (
            <View key={f} style={styles.pill}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 36 }} />

        {/* Create Contro — primary, solid purple */}
        <TouchableOpacity
          style={styles.ctaPrimary}
          onPress={() => navigation.navigate("QuickContro", {})}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaPrimaryIcon}>+</Text>
          <Text style={styles.ctaPrimaryText}>Create Contro</Text>
        </TouchableOpacity>

        {/* Your Contros — secondary, purple-tinted */}
        <TouchableOpacity
          style={styles.ctaTinted}
          onPress={() => navigation.navigate("SavedContros")}
          activeOpacity={0.85}
        >
          <View style={styles.ctaTintedLeft}>
            <Text style={styles.ctaTintedIcon}>📁</Text>
            <Text style={styles.ctaTintedText}>Your Contros</Text>
          </View>
          {savedCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{savedCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* About — secondary, purple-tinted */}
        <TouchableOpacity
          style={styles.ctaTinted}
          onPress={() => navigation.navigate("About")}
          activeOpacity={0.85}
        >
          <View style={styles.ctaTintedLeft}>
            <Text style={styles.ctaTintedText}>About Contro</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerDev}>Developed by Abhishek Sharma</Text>
        <View style={styles.footerLinks}>
          {LINKS.map((item, i) => (
            <View key={item.label} style={styles.footerLinkWrap}>
              <Text
                style={styles.footerLink}
                onPress={() => Linking.openURL(item.url)}
              >
                {item.label}
              </Text>
              {i < LINKS.length - 1 && (
                <Text style={styles.footerSep}> · </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    paddingHorizontal: 22,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoImg: {
    width: 150,
    height: 150,
  },

  appName: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 7,
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginBottom: 22,
  },
  taglineAccent: {
    color: "#7c6ff7",
    fontWeight: "700",
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#131318",
    borderWidth: 0.5,
    borderColor: "#1f1f2b",
    borderRadius: 99,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#7c6ff7",
  },
  pillText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  // ── Primary CTA — solid purple ──
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#7c6ff7",
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
    marginBottom: 10,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#7c6ff7",
          shadowOpacity: 0.35,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 5 },
        }
      : { elevation: 7 }),
  },
  ctaPrimaryIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
    lineHeight: 22,
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },

  // ── Secondary CTAs — purple-tinted (NOT grey) ──
  ctaTinted: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(124,111,247,0.10)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 10,
  },
  ctaTintedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  ctaTintedIcon: { fontSize: 15 },
  ctaTintedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#a89bf9",
  },
  countBadge: {
    backgroundColor: "rgba(124,111,247,0.2)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.4)",
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#a89bf9",
  },

  footer: {
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#1a1a24",
    paddingVertical: 14,
    gap: 5,
  },
  footerDev: {
    fontSize: 11,
    color: "#2e2e40",
    fontWeight: "600",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLinkWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLink: {
    fontSize: 12,
    color: "#7c6ff7",
    fontWeight: "600",
  },
  footerSep: {
    fontSize: 12,
    color: "#252535",
    marginHorizontal: 3,
  },
});
