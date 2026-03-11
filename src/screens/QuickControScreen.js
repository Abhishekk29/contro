import { useEffect, useRef, useState } from "react";
import {
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

export default function QuickControScreen({ navigation }) {
  const [controName, setControName] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, title: "", amount: "", participants: [] },
  ]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // 🔥 Generate People
  useEffect(() => {
    if (!numPeople || Number(numPeople) <= 0) {
      setPeople([]);
      return;
    }

    const count = Number(numPeople);

    const newPeople = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: i === 0 ? "You" : `Person ${i}`,
      share: 0,
      paid: "",
    }));

    setPeople(newPeople);
  }, [numPeople]);

  // 🔥 Calculate total expense
  const calculatedTotal = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0,
  );

  // 🔥 Calculate shares per expense
  const calculateShares = () => {
    const shares = Array(people.length).fill(0);

    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      const participants = expense.participants;

      if (participants.length > 0) {
        const splitAmount = amount / participants.length;

        participants.forEach((personIndex) => {
          shares[personIndex] += splitAmount;
        });
      }
    });

    return shares;
  };

  // 🔥 Update shares automatically
  useEffect(() => {
    if (people.length === 0) return;

    const shares = calculateShares();

    const updatedPeople = people.map((p, i) => ({
      ...p,
      share: shares[i],
    }));

    setPeople(updatedPeople);
  }, [expenses]);

  // 🔥 Total share tally
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

  // 🔥 Balance Calculation
  const balances = people.map((p) => ({
    name: p.name,
    balance: (parseFloat(p.paid) || 0) - (parseFloat(p.share) || 0),
  }));

  // 🔥 Settlement Engine
  const generateSettlement = () => {
    const receivers = balances
      .filter((p) => p.balance > 0)
      .map((p) => ({ ...p }));

    const payers = balances
      .filter((p) => p.balance < 0)
      .map((p) => ({ ...p, balance: Math.abs(p.balance) }));

    const settlements = [];

    let i = 0;
    let j = 0;

    while (i < payers.length && j < receivers.length) {
      const payer = payers[i];
      const receiver = receivers[j];

      const amount = Math.min(payer.balance, receiver.balance);

      settlements.push({
        from: payer.name,
        to: receiver.name,
        amount: amount.toFixed(2),
      });

      payer.balance -= amount;
      receiver.balance -= amount;

      if (payer.balance === 0) i++;
      if (receiver.balance === 0) j++;
    }

    return settlements;
  };

  const settlements = generateSettlement();

  // 🔥 Handlers
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
    const participants = updated[expenseIndex].participants;

    if (participants.includes(personIndex)) {
      updated[expenseIndex].participants = participants.filter(
        (p) => p !== personIndex,
      );
    } else {
      updated[expenseIndex].participants.push(personIndex);
    }

    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now(), title: "", amount: "", participants: [] },
    ]);
  };

  const removeExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const toggleSelectAll = (expenseIndex) => {
    const updated = [...expenses];
    const allIndexes = people.map((_, index) => index);

    const isAllSelected =
      updated[expenseIndex].participants.length === people.length;

    updated[expenseIndex].participants = isAllSelected ? [] : allIndexes;

    setExpenses(updated);
  };

  const diff = Number((calculatedTotal - totalShare).toFixed(2));

  const barColor = diff === 0 ? "#2ecc71" : diff > 0 ? "#f1c40f" : "#e74c3c";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text style={styles.header}>Create Contro</Text>

        <TextInput
          style={styles.input}
          placeholder="Contro Name"
          placeholderTextColor="#aaa"
          value={controName}
          onChangeText={setControName}
        />

        {/* Expense Section */}
        <Text style={styles.sectionTitle}>Expense Breakdown</Text>

        {expenses.map((exp, i) => (
          <View key={exp.id} style={styles.expenseCard}>
            <TextInput
              style={styles.input}
              placeholder="Expense Title"
              placeholderTextColor="#aaa"
              value={exp.title}
              onChangeText={(val) => handleExpenseChange(i, "title", val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount (₹)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={exp.amount}
              onChangeText={(val) => handleExpenseChange(i, "amount", val)}
            />

            <Text style={styles.participantLabel}>Select Participants</Text>

            {/* Select All Button */}
            <TouchableOpacity
              onPress={() => toggleSelectAll(i)}
              style={styles.selectAllBtn}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {exp.participants.length === people.length
                  ? "Unselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>

            <View style={styles.participantContainer}>
              {people.map((person, personIndex) => (
                <TouchableOpacity
                  key={personIndex}
                  onPress={() => toggleParticipant(i, personIndex)}
                  style={[
                    styles.participantTag,
                    exp.participants.includes(personIndex) &&
                      styles.selectedParticipant,
                  ]}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {person.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => removeExpense(i)}>
              <Text style={{ color: "red", marginTop: 6 }}>Remove Expense</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
          <Text style={{ color: "#fff" }}>+ Add Expense</Text>
        </TouchableOpacity>

        <Text style={styles.totalText}>
          Total: ₹{calculatedTotal.toFixed(2)}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Number of People"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={numPeople}
          onChangeText={setNumPeople}
        />

        {/* Tally */}
        {calculatedTotal > 0 && (
          <View style={styles.tallyContainer}>
            <Text style={diff === 0 ? styles.tallyOk : styles.tallyBad}>
              {diff === 0
                ? "Balanced"
                : diff > 0
                  ? `₹${diff} remaining`
                  : `₹${Math.abs(diff)} excess`}
            </Text>

            <View style={styles.tallyBar}>
              <Animated.View
                style={[
                  styles.tallyProgress,
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
          </View>
        )}

        {/* Paid Input */}
        {people.map((p, i) => (
          <View key={p.id} style={styles.card}>
            {/* Editable Name */}
            <TextInput
              style={styles.cardInput}
              value={p.name}
              onChangeText={(val) => handlePersonChange(i, "name", val)}
              placeholder="Person Name"
              placeholderTextColor="#aaa"
            />

            {/* Auto Calculated Share */}
            <Text style={{ color: "#bbb", marginBottom: 6 }}>
              Share: ₹{p.share.toFixed(2)}
            </Text>

            {/* Paid Input */}
            <TextInput
              style={styles.cardInput}
              placeholder="Paid (₹)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={p.paid?.toString()}
              onChangeText={(val) => handlePersonChange(i, "paid", val)}
            />
          </View>
        ))}

        {/* Settlement */}
        {settlements.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Who Pays Whom</Text>

            {settlements.map((s, index) => (
              <Text
                key={index}
                style={{
                  color: "#00cec9",
                  marginBottom: 6,
                }}
              >
                {s.from} → Pay ₹{s.amount} to {s.to}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() =>
            navigation.navigate("Invoice", {
              controName,
              expenses,
              people,
              balances,
              settlements,
            })
          }
        >
          <Text style={styles.submitText}>Generate PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f12",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 25,
    letterSpacing: 0.5,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 25,
  },

  input: {
    backgroundColor: "#1c1c22",
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a32",
  },

  expenseCard: {
    backgroundColor: "#15151b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#23232b",
  },

  participantLabel: {
    color: "#8f8f9e",
    fontSize: 13,
    marginBottom: 8,
    marginTop: 6,
  },

  selectAllBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#262633",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3a4a",
  },

  participantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  participantTag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: "#202028",
    borderWidth: 1,
    borderColor: "#2c2c36",
  },

  selectedParticipant: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },

  addBtn: {
    backgroundColor: "#22222a",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#33333d",
  },

  totalText: {
    color: "#6c5ce7",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#15151b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#23232b",
  },

  cardInput: {
    backgroundColor: "#1c1c22",
    color: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2a2a32",
  },

  tallyContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  tallyOk: {
    color: "#2ecc71",
    fontWeight: "600",
    marginBottom: 6,
  },

  tallyBad: {
    color: "#e74c3c",
    fontWeight: "600",
    marginBottom: 6,
  },

  tallyBar: {
    height: 10,
    backgroundColor: "#1c1c22",
    borderRadius: 20,
    overflow: "hidden",
  },

  tallyProgress: {
    height: "100%",
    borderRadius: 20,
  },

  submitBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#6c5ce7",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
