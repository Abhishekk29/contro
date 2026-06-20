// src/screens/SavedControScreen.js
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    calcTotal,
    deleteContro,
    formatDate,
    getAllContros,
} from "../utils/controStorage";

// ─── Avatar colors (matches QuickControScreen / InvoiceScreen) ────────────────
const AVATAR_COLORS = [
  { bg: "rgba(124,111,247,0.18)", text: "#a89bf9" },
  { bg: "rgba(29,158,117,0.18)", text: "#3dcfa0" },
  { bg: "rgba(212,83,126,0.18)", text: "#e07ba0" },
  { bg: "rgba(239,159,39,0.18)", text: "#f5b94e" },
  { bg: "rgba(55,138,221,0.18)", text: "#74b6f0" },
  { bg: "rgba(99,153,34,0.18)", text: "#93c455" },
];

// ─── Contro Card ───────────────────────────────────────────────────────────────
function ControCard({ contro, onPress, onLongPress }) {
  const total = calcTotal(contro.expenses);
  const isDraft = contro.status !== "completed";
  const colorIdx =
    Math.abs(contro.id?.charCodeAt(8) || 0) % AVATAR_COLORS.length;
  const colors = AVATAR_COLORS[colorIdx];
  const initial = contro.controName?.charAt(0)?.toUpperCase() || "C";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      delayLongPress={400}
    >
      <View style={[styles.cardAvatar, { backgroundColor: colors.bg }]}>
        <Text style={[styles.cardAvatarText, { color: colors.text }]}>
          {initial}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {contro.controName || "Unnamed Contro"}
          </Text>
          <View
            style={[styles.statusBadge, !isDraft && styles.statusBadgeDone]}
          >
            <Text
              style={[styles.statusText, !isDraft && styles.statusTextDone]}
            >
              {isDraft ? "Draft" : "Done"}
            </Text>
          </View>
        </View>
        <View style={styles.cardBottomRow}>
          <Text style={styles.cardMeta}>
            {contro.people?.length || 0} people · {formatDate(contro.updatedAt)}
          </Text>
          <Text style={styles.cardTotal}>₹{total.toFixed(0)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Custom Delete Confirmation Modal ──────────────────────────────────────────
function DeleteModal({ visible, controName, onCancel, onConfirm }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onCancel}
        />
        <View style={styles.modalCard}>
          <View style={styles.modalIconRing}>
            <Text style={styles.modalIcon}>🗑</Text>
          </View>

          <Text style={styles.modalTitle}>Delete this Contro?</Text>
          <Text style={styles.modalDesc}>
            <Text style={styles.modalNameHighlight}>
              "{controName || "This Contro"}"
            </Text>{" "}
            and all its expenses will be permanently removed. This can't be
            undone.
          </Text>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.btnDeleteText}>Delete Contro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onCancel}
            activeOpacity={0.85}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onCreate }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconRing}>
        <Text style={styles.emptyIcon}>📁</Text>
      </View>
      <Text style={styles.emptyTitle}>No Contros yet</Text>
      <Text style={styles.emptyDesc}>
        Contros you save or generate will show up here so you can pick up right
        where you left off.
      </Text>
      <TouchableOpacity
        style={styles.emptyCta}
        onPress={onCreate}
        activeOpacity={0.85}
      >
        <Text style={styles.emptyCtaText}>+ Create your first Contro</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function SavedControScreen({ navigation }) {
  const [contros, setContros] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // holds the contro object

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllContros().then((list) => {
        if (active) {
          setContros(list);
          setLoaded(true);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const handleLongPress = (contro) => {
    setPendingDelete(contro);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteContro(pendingDelete.id);
    setContros((prev) => prev.filter((c) => c.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const handleCancelDelete = () => setPendingDelete(null);

  const drafts = contros.filter((c) => c.status !== "completed");
  const completed = contros.filter((c) => c.status === "completed");

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Your Contros</Text>
        <View style={[styles.iconBtn, { opacity: 0 }]} />
      </View>

      {loaded && contros.length === 0 ? (
        <EmptyState onCreate={() => navigation.replace("QuickContro", {})} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hint}>Hold a card to delete</Text>

          {drafts.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>IN PROGRESS</Text>
              {drafts.map((c) => (
                <ControCard
                  key={c.id}
                  contro={c}
                  onPress={() =>
                    navigation.navigate("QuickContro", { controId: c.id })
                  }
                  onLongPress={() => handleLongPress(c)}
                />
              ))}
            </>
          )}

          {completed.length > 0 && (
            <>
              <Text
                style={[
                  styles.sectionLabel,
                  { marginTop: drafts.length ? 22 : 0 },
                ]}
              >
                COMPLETED
              </Text>
              {completed.map((c) => (
                <ControCard
                  key={c.id}
                  contro={c}
                  onPress={() =>
                    navigation.navigate("QuickContro", { controId: c.id })
                  }
                  onLongPress={() => handleLongPress(c)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* ── Custom Delete Modal ── */}
      <DeleteModal
        visible={!!pendingDelete}
        controName={pendingDelete?.controName}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const CARD = "#131318";
const BORDER = "#1f1f2b";
const PURPLE = "#7c6ff7";
const RED = "#e05a5a";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0b0b0f" },

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
  screenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.2,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 40 },

  hint: {
    fontSize: 11,
    color: "#2a2a3a",
    textAlign: "center",
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#444",
    letterSpacing: 0.9,
    marginBottom: 10,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardAvatarText: { fontSize: 16, fontWeight: "800" },
  cardInfo: { flex: 1, gap: 5 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardName: { fontSize: 14, fontWeight: "700", color: "#ddd", flex: 1 },
  statusBadge: {
    backgroundColor: "rgba(245,185,78,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(245,185,78,0.3)",
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  statusBadgeDone: {
    backgroundColor: "rgba(61,207,160,0.12)",
    borderColor: "rgba(61,207,160,0.3)",
  },
  statusText: { fontSize: 10, fontWeight: "700", color: "#f5b94e" },
  statusTextDone: { color: "#3dcfa0" },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMeta: { fontSize: 11, color: "#444" },
  cardTotal: { fontSize: 13, fontWeight: "800", color: PURPLE },

  // ── Empty state ──
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconRing: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyIcon: { fontSize: 28 },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ddd",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
  },
  emptyCta: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  emptyCtaText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // ── Delete Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#15151b",
    borderWidth: 0.5,
    borderColor: "#26263a",
    borderRadius: 24,
    paddingTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  modalIconRing: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(224,90,90,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(224,90,90,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalIcon: { fontSize: 24 },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDesc: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  modalNameHighlight: {
    color: "#ddd",
    fontWeight: "700",
  },
  btnDelete: {
    width: "100%",
    backgroundColor: RED,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 9,
  },
  btnDeleteText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  btnCancel: {
    width: "100%",
    backgroundColor: "#1c1c26",
    borderWidth: 0.5,
    borderColor: "#2a2a36",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnCancelText: { color: "#999", fontWeight: "700", fontSize: 14 },
});
