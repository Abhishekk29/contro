// src/screens/QuickControScreen.jsx
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getContro,
  markCompleted,
  saveContro,
} from "../../src/utils/controStorage";

// ─── Avatar colors ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "rgba(124,111,247,0.18)", text: "#a89bf9" },
  { bg: "rgba(29,158,117,0.18)", text: "#3dcfa0" },
  { bg: "rgba(212,83,126,0.18)", text: "#e07ba0" },
  { bg: "rgba(239,159,39,0.18)", text: "#f5b94e" },
  { bg: "rgba(55,138,221,0.18)", text: "#74b6f0" },
  { bg: "rgba(99,153,34,0.18)", text: "#93c455" },
];

function Avatar({ name, index, size = 38 }) {
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.bg,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Text
        style={{ color: colors.text, fontSize: size * 0.37, fontWeight: "800" }}
      >
        {initials}
      </Text>
    </View>
  );
}

function SectionHeader({ label, actionLabel, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction} style={styles.addLinkBtn}>
          <Text style={styles.addLinkText}>+ {actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function StyledInput({ icon, label, ...props }) {
  return (
    <View style={styles.inputWrapper}>
      {icon && <Text style={styles.inputIcon}>{icon}</Text>}
      <View style={{ flex: 1 }}>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <TextInput
          style={styles.inputInner}
          placeholderTextColor="#444"
          {...props}
        />
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function QuickControScreen({ navigation, route }) {
  const controId = route?.params?.controId || null;

  const [currentId, setCurrentId] = useState(controId);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!controId);

  const [controName, setControName] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, title: "", category: "", amount: "", participants: [] },
  ]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // ─── Load existing contro if resuming ────────────────────────────────────────
  useEffect(() => {
    if (!controId) return;
    (async () => {
      setIsLoading(true);
      const saved = await getContro(controId);
      if (saved) {
        setCurrentId(saved.id);
        setControName(saved.controName || "");
        setNumPeople(String(saved.numPeople || ""));
        setPeople(saved.people || []);
        setExpenses(
          saved.expenses?.length
            ? saved.expenses
            : [
                {
                  id: 1,
                  title: "",
                  category: "",
                  amount: "",
                  participants: [],
                },
              ],
        );
      }
      setIsLoading(false);
    })();
  }, [controId]);

  // ─── Generate people from numPeople ──────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return; // don't overwrite loaded people
    const count = Number(numPeople);
    if (!numPeople || count <= 0) {
      setPeople([]);
      return;
    }
    setPeople((prev) => {
      if (prev.length === count) return prev;
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        name: prev[i]?.name ?? (i === 0 ? "You" : `Person ${i}`),
        share: prev[i]?.share ?? 0,
        paid: prev[i]?.paid ?? "",
      }));
    });
  }, [numPeople, isLoading]);

  // ─── Calculate shares ─────────────────────────────────────────────────────────
  const calculatedTotal = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0,
  );

  const calculateShares = () => {
    const shares = Array(people.length).fill(0);
    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      if (expense.participants.length > 0) {
        const split = amount / expense.participants.length;
        expense.participants.forEach((idx) => {
          shares[idx] += split;
        });
      }
    });
    return shares;
  };

  useEffect(() => {
    if (people.length === 0) return;
    const shares = calculateShares();
    setPeople((prev) => prev.map((p, i) => ({ ...p, share: shares[i] })));
  }, [expenses]);

  const totalShare = people.reduce(
    (sum, p) => sum + (parseFloat(p.share) || 0),
    0,
  );
  const tallyPercent =
    calculatedTotal > 0
      ? Math.min((totalShare / calculatedTotal) * 100, 100)
      : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: tallyPercent,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [tallyPercent]);

  const diff = Number((calculatedTotal - totalShare).toFixed(2));
  const barColor = diff === 0 ? "#3dcfa0" : diff > 0 ? "#f5b94e" : "#e05a5a";
  const tallyLabel =
    diff === 0
      ? "Fully covered"
      : diff > 0
        ? `₹${diff} remaining`
        : `₹${Math.abs(diff)} excess`;

  const balances = people.map((p) => ({
    name: p.name,
    balance: (parseFloat(p.paid) || 0) - (parseFloat(p.share) || 0),
  }));

  const generateSettlement = () => {
    const receivers = balances
      .filter((p) => p.balance > 0)
      .map((p) => ({ ...p }));
    const payers = balances
      .filter((p) => p.balance < 0)
      .map((p) => ({ ...p, balance: Math.abs(p.balance) }));
    const settlements = [];
    let i = 0,
      j = 0;
    while (i < payers.length && j < receivers.length) {
      const amount = Math.min(payers[i].balance, receivers[j].balance);
      settlements.push({
        from: payers[i].name,
        to: receivers[j].name,
        amount: amount.toFixed(2),
      });
      payers[i].balance -= amount;
      receivers[j].balance -= amount;
      if (payers[i].balance === 0) i++;
      if (receivers[j].balance === 0) j++;
    }
    return settlements;
  };

  const settlements = generateSettlement();

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handlePersonChange = (index, field, value) => {
    const updated = [...people];
    updated[index][field] = value;
    setPeople(updated);
  };
  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };
  const toggleParticipant = (expenseIndex, personIndex) => {
    const updated = [...expenses];
    const parts = updated[expenseIndex].participants;
    updated[expenseIndex].participants = parts.includes(personIndex)
      ? parts.filter((p) => p !== personIndex)
      : [...parts, personIndex];
    setExpenses(updated);
  };
  const toggleSelectAll = (expenseIndex) => {
    const updated = [...expenses];
    const isAll = updated[expenseIndex].participants.length === people.length;
    updated[expenseIndex].participants = isAll ? [] : people.map((_, i) => i);
    setExpenses(updated);
  };
  const addExpense = () =>
    setExpenses([
      ...expenses,
      { id: Date.now(), title: "", category: "", amount: "", participants: [] },
    ]);
  const removeExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  // ─── Save & Exit ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!controName.trim()) {
      Alert.alert(
        "Name required",
        "Please give this Contro a name before saving.",
      );
      return;
    }
    setIsSaving(true);
    const payload = {
      id: currentId,
      controName,
      numPeople,
      people,
      expenses,
      status: "draft",
    };
    const savedId = await saveContro(payload);
    setCurrentId(savedId);
    setIsSaving(false);
    navigation.goBack();
  };

  // ─── Generate PDF (marks completed) ──────────────────────────────────────────
  const handleGeneratePDF = async () => {
    // Auto-save before going to invoice
    if (controName.trim()) {
      const payload = {
        id: currentId,
        controName,
        numPeople,
        people,
        expenses,
        status: "draft",
      };
      const savedId = await saveContro(payload);
      const idToMark = savedId || currentId;
      if (idToMark) await markCompleted(idToMark);
      setCurrentId(idToMark);
    }
    navigation.navigate("Invoice", {
      controName,
      expenses,
      people,
      balances,
      settlements,
    });
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#555", fontSize: 14 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <Text style={styles.iconBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>
            {currentId ? "Edit Contro" : "New Contro"}
          </Text>
          <View style={[styles.iconBtn, { opacity: 0 }]} />
        </View>

        {/* ── Contro Name ── */}
        <StyledInput
          label="Contro Name"
          placeholder="e.g. Goa Trip"
          value={controName}
          onChangeText={setControName}
        />
        <StyledInput
          label="Number of People"
          placeholder="e.g. 3"
          keyboardType="numeric"
          value={numPeople}
          onChangeText={setNumPeople}
        />

        {/* ── Expenses ── */}
        <SectionHeader
          label="Expenses"
          actionLabel="Add Expense"
          onAction={addExpense}
        />

        {expenses.map((exp, i) => (
          <View key={exp.id} style={styles.expenseCard}>
            <View style={styles.expenseTopRow}>
              <TextInput
                style={styles.expenseTitleInput}
                placeholder="Expense name"
                placeholderTextColor="#444"
                value={exp.title}
                onChangeText={(val) => handleExpenseChange(i, "title", val)}
              />
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor="#444"
                  keyboardType="numeric"
                  value={exp.amount}
                  onChangeText={(val) => handleExpenseChange(i, "amount", val)}
                />
              </View>
            </View>

            <TextInput
              style={styles.categoryInput}
              placeholder="Category (e.g. Food, Hotel)"
              placeholderTextColor="#3a3a4e"
              value={exp.category}
              onChangeText={(val) => handleExpenseChange(i, "category", val)}
            />

            <View style={styles.cardDivider} />

            <View style={styles.participantsHeader}>
              <Text style={styles.participantsLabel}>SPLIT BETWEEN</Text>
              {people.length > 0 && (
                <TouchableOpacity onPress={() => toggleSelectAll(i)}>
                  <Text style={styles.selectAllText}>
                    {exp.participants.length === people.length
                      ? "Unselect all"
                      : "Select all"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.participantRow}>
              {people.map((person, personIndex) => {
                const isActive = exp.participants.includes(personIndex);
                return (
                  <TouchableOpacity
                    key={personIndex}
                    onPress={() => toggleParticipant(i, personIndex)}
                    style={[styles.pTag, isActive && styles.pTagActive]}
                  >
                    <Text
                      style={[
                        styles.pTagText,
                        isActive && styles.pTagTextActive,
                      ]}
                    >
                      {person.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => removeExpense(i)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>Remove expense</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ── Total Chip ── */}
        {calculatedTotal > 0 && (
          <View style={styles.totalChip}>
            <Text style={styles.totalChipText}>
              ₹{calculatedTotal.toFixed(2)} across {expenses.length} expense
              {expenses.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* ── Tally Bar ── */}
        {calculatedTotal > 0 && (
          <View style={styles.tallyBox}>
            <View style={styles.tallyTopRow}>
              <Text style={styles.tallyLabel}>Split coverage</Text>
              <Text style={[styles.tallyStatus, { color: barColor }]}>
                {tallyLabel}
              </Text>
            </View>
            <View style={styles.tallyBarBg}>
              <Animated.View
                style={[
                  styles.tallyBarFill,
                  {
                    backgroundColor: barColor,
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.tallyNums}>
              <Text style={styles.tallyNum}>
                Assigned{" "}
                <Text style={styles.tallyNumVal}>₹{totalShare.toFixed(2)}</Text>
              </Text>
              <Text style={styles.tallyNum}>
                Total{" "}
                <Text style={styles.tallyNumVal}>
                  ₹{calculatedTotal.toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* ── People ── */}
        {people.length > 0 && (
          <>
            <SectionHeader label="People" />
            {people.map((p, i) => (
              <View key={p.id} style={styles.personCard}>
                <Avatar name={p.name} index={i} size={40} />
                <View style={styles.personInfo}>
                  <TextInput
                    style={styles.personNameInput}
                    value={p.name}
                    onChangeText={(val) => handlePersonChange(i, "name", val)}
                    placeholder="Name"
                    placeholderTextColor="#444"
                  />
                  <Text style={styles.personShare}>
                    Share: ₹{p.share.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.personPaidBlock}>
                  <Text style={styles.personPaidLabel}>Paid</Text>
                  <View style={styles.paidInputRow}>
                    <Text style={styles.paidCurrency}>₹</Text>
                    <TextInput
                      style={styles.paidInput}
                      placeholder="0"
                      placeholderTextColor="#3a3a4e"
                      keyboardType="numeric"
                      value={p.paid?.toString()}
                      onChangeText={(val) => handlePersonChange(i, "paid", val)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ── Settlement ── */}
        {settlements.length > 0 && (
          <View style={styles.settlementCard}>
            <View style={styles.settlementHeader}>
              <View style={styles.settleDot} />
              <Text style={styles.settleHeaderLabel}>WHO PAYS WHOM</Text>
            </View>
            {settlements.map((s, idx) => (
              <View
                key={idx}
                style={[
                  styles.settleRow,
                  idx < settlements.length - 1 && styles.settleRowBorder,
                ]}
              >
                <View style={styles.settleAvatar}>
                  <Text style={styles.settleAvatarText}>
                    {s.from.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.settleText}>
                  <Text style={styles.settleName}>{s.from}</Text>
                  {" pays "}
                  <Text style={styles.settleName}>{s.to}</Text>
                </Text>
                <Text style={styles.settleAmount}>₹{s.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Action Buttons ── */}
        <View style={styles.actionRow}>
          {/* Save & Exit */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={isSaving}
          >
            <Text style={styles.saveBtnText}>
              {isSaving ? "Saving…" : "Save & Exit"}
            </Text>
          </TouchableOpacity>

          {/* Generate PDF */}
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleGeneratePDF}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Generate PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const BG = "#0b0b0f";
const CARD = "#131318";
const BORDER = "#1f1f2b";
const PURPLE = "#7c6ff7";
const GREEN = "#3dcfa0";
const MUTED = "#555";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 8,
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

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141419",
    borderWidth: 0.5,
    borderColor: "#252530",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 10,
  },
  inputIcon: { fontSize: 16 },
  inputLabel: { fontSize: 11, color: MUTED, marginBottom: 2 },
  inputInner: { color: "#fff", fontSize: 15, fontWeight: "500", padding: 0 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.9,
  },
  addLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(124,111,247,0.12)",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.3)",
  },
  addLinkText: { fontSize: 12, color: PURPLE, fontWeight: "700" },

  expenseCard: {
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  expenseTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  expenseTitleInput: {
    flex: 1,
    color: "#eee",
    fontSize: 15,
    fontWeight: "600",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    paddingBottom: 6,
    padding: 0,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f14",
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  currencySymbol: {
    color: PURPLE,
    fontWeight: "700",
    fontSize: 15,
    marginRight: 2,
  },
  amountInput: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    minWidth: 60,
    padding: 0,
  },
  categoryInput: { color: "#666", fontSize: 12, padding: 0, marginBottom: 10 },
  cardDivider: { height: 0.5, backgroundColor: BORDER, marginBottom: 12 },

  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  participantsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3a3a4e",
    letterSpacing: 0.8,
  },
  selectAllText: { fontSize: 12, color: PURPLE, fontWeight: "600" },
  participantRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  pTag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1c1c26",
    borderWidth: 0.5,
    borderColor: "#28283a",
  },
  pTagActive: {
    backgroundColor: "rgba(124,111,247,0.15)",
    borderColor: "rgba(124,111,247,0.4)",
  },
  pTagText: { fontSize: 13, color: "#555", fontWeight: "500" },
  pTagTextActive: { color: "#a89bf9" },
  removeBtn: { marginTop: 14, alignSelf: "flex-start" },
  removeBtnText: { color: "#b71f1f", fontSize: 12 },

  totalChip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(124,111,247,0.08)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.22)",
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 12,
    marginTop: 4,
  },
  totalChipText: { fontSize: 13, color: "#a89bf9", fontWeight: "600" },

  tallyBox: {
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
  },
  tallyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tallyLabel: { fontSize: 13, color: MUTED },
  tallyStatus: { fontSize: 13, fontWeight: "700" },
  tallyBarBg: {
    height: 6,
    backgroundColor: "#1c1c26",
    borderRadius: 99,
    overflow: "hidden",
  },
  tallyBarFill: { height: "100%", borderRadius: 99 },
  tallyNums: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tallyNum: { fontSize: 11, color: "#3a3a4e" },
  tallyNumVal: { color: "#666", fontWeight: "600" },

  personCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  personInfo: { flex: 1 },
  personNameInput: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
    marginBottom: 3,
  },
  personShare: { fontSize: 12, color: MUTED },
  personPaidBlock: { alignItems: "flex-end" },
  personPaidLabel: { fontSize: 11, color: "#3a3a4e", marginBottom: 2 },
  paidInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f14",
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  paidCurrency: {
    color: PURPLE,
    fontWeight: "700",
    fontSize: 14,
    marginRight: 2,
  },
  paidInput: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 56,
    padding: 0,
  },

  settlementCard: {
    backgroundColor: "#0c1812",
    borderWidth: 0.5,
    borderColor: "#1a2e22",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
  },
  settlementHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a2e22",
  },
  settleDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
  settleHeaderLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: GREEN,
    letterSpacing: 0.7,
  },
  settleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  settleRowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#1a2e22" },
  settleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(29,158,117,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  settleAvatarText: { color: GREEN, fontSize: 12, fontWeight: "800" },
  settleText: { flex: 1, fontSize: 13, color: "#888" },
  settleName: { color: "#ddd", fontWeight: "700" },
  settleAmount: { fontSize: 15, fontWeight: "800", color: GREEN },

  // ── Action buttons row ──
  actionRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  saveBtn: {
    flex: 1,
    backgroundColor: "rgba(124,111,247,0.10)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#a89bf9" },
  ctaBtn: {
    flex: 1,
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "ios"
      ? {
          shadowColor: PURPLE,
          shadowOpacity: 0.4,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
        }
      : { elevation: 8 }),
  },
  ctaBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
