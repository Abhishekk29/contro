import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";

export default function QuickControScreen({ navigation }) {
  const [controName, setControName] = useState("");
  const [totalContro, setTotalContro] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState([]);
  const [errors, setErrors] = useState({});
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Validation Watchers
  useEffect(() => {
    if (controName.trim() !== "" && errors.controName) {
      setErrors((prev) => ({ ...prev, controName: null }));
    }
    if (numPeople && Number(numPeople) > 0 && errors.numPeople) {
      setErrors((prev) => ({ ...prev, numPeople: null }));
    }
    if (totalContro && Number(totalContro) > 0 && errors.totalContro) {
      setErrors((prev) => ({ ...prev, totalContro: null }));
    }
  }, [controName, numPeople, totalContro]);

  // Generate people dynamically when numPeople changes
  useEffect(() => {
    if (!numPeople || isNaN(numPeople) || Number(numPeople) <= 0) {
      setPeople([]);
      return;
    }
    const count = Number(numPeople);
    const equalAmount =
      splitType === "equal" && totalContro
        ? (Number(totalContro) / count).toFixed(2)
        : "";

    const newPeople = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: i === 0 ? "You" : `Person ${i}`,
      amount: splitType === "equal" ? equalAmount : "",
      note: "",
    }));

    setPeople(newPeople);
  }, [numPeople, totalContro, splitType]);

  // Calculate tally
  const totalEntered = people.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );
  const tallyPercent =
    totalContro > 0 ? Math.min((totalEntered / totalContro) * 100, 100) : 0;

  // Animate tally bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: tallyPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [tallyPercent]);

  // ✅ Live clear amount errors
  useEffect(() => {
    const updatedErrors = { ...errors };
    people.forEach((person, index) => {
      if (person.amount && !isNaN(person.amount)) {
        delete updatedErrors[`amount_${index}`];
      }
    });
    setErrors(updatedErrors);
  }, [people]);

  const handleInputChange = (index, field, value) => {
    const updated = [...people];
    updated[index][field] = value;
    setPeople(updated);
  };

  const validateAndSubmit = () => {
  let newErrors = {};
  if (!controName.trim()) newErrors.controName = "Contro name is required";
  if (!totalContro || isNaN(totalContro) || totalContro <= 0)
    newErrors.totalContro = "Enter valid total amount";
  if (!numPeople || isNaN(numPeople) || numPeople <= 0)
    newErrors.numPeople = "Enter valid no. of people";

  people.forEach((p, i) => {
    if (!p.name.trim()) newErrors[`name_${i}`] = "Name required";
    if (
      splitType === "custom" &&
      (!p.amount || isNaN(p.amount) || p.amount < 0)
    )
      newErrors[`amount_${i}`] = "Enter valid amount";
  });

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    // ✅ Show alert before navigation
    Alert.alert(
      "Temporary Contro",
      "This Contro is temporary and won't be saved for later. Sign up for full access.",
      [
        {
          text: "I Understand",
          onPress: () => {
            navigation.navigate("Invoice", {
              controName,
              totalContro,
              people,
            });
          },
        },
      ]
    );
  }
};


  // Dynamic bar color
  const barColor =
    tallyPercent < 40
      ? "#e74c3c" // red
      : tallyPercent < 80
      ? "#f1c40f" // yellow
      : "#2ecc71"; // green

  // ✅ Diff calculation for tally label
  const diff = Number((Number(totalContro) - totalEntered).toFixed(2));

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={{ flex: 1}}>
  <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.header}>Create Quick Contro</Text></View></SafeAreaView>

      {/* Contro Name */}
      <TextInput
        style={styles.input}
        placeholder="Contro Name"
        placeholderTextColor="#aaa"
        value={controName}
        onChangeText={setControName}
      />
      {errors.controName && (
        <Text style={styles.error}>{errors.controName}</Text>
      )}

      {/* Total Amount */}
      <TextInput
        style={styles.input}
        placeholder="Total Contro (₹)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={totalContro}
        onChangeText={setTotalContro}
      />
      {errors.totalContro && (
        <Text style={styles.error}>{errors.totalContro}</Text>
      )}

      {/* Split Options */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            splitType === "equal" && styles.selectedOption,
          ]}
          onPress={() => setSplitType("equal")}
        >
          <Text style={styles.optionText}>Split Equally</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            splitType === "custom" && styles.selectedOption,
          ]}
          onPress={() => setSplitType("custom")}
        >
          <Text style={styles.optionText}>Custom Split</Text>
        </TouchableOpacity>
      </View>

      {/* Number of People */}
      {/* Number of People */}
<TextInput
  style={styles.input}
  placeholder="Total No. of People"
  placeholderTextColor="#aaa"
  keyboardType="numeric"
  value={numPeople}
  onChangeText={(val) => {
    // Limit input to numbers between 1 and 50
    let num = val.replace(/[^0-9]/g, ""); // remove non-numeric
    if (num !== "") {
      num = Math.min(Number(num), 50).toString();
    }
    setNumPeople(num);
  }}
/>
<Text style={styles.limitText}>*Max 50 allowed</Text>
{errors.numPeople && <Text style={styles.error}>{errors.numPeople}</Text>}

 {/* ✅ Tally Bar with improved label */}
      {totalContro > 0 && (
        <View style={styles.tallyContainer}>
          <Text style={diff === 0 ? styles.tallyOk : styles.tallyBad}>
            {diff === 0
              ? "✅ Balanced"
              : diff > 0
              ? `⚠️ ₹${diff.toFixed(2)} remaining`
              : `⚠️ ₹${Math.abs(diff).toFixed(2)} excess`}
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



      {/* People Cards */}
      {people.map((p, i) => (
        <View key={p.id} style={styles.card}>
          <TextInput
            style={styles.cardInput}
            value={p.name}
            onChangeText={(val) => handleInputChange(i, "name", val)}
          />
          {errors[`name_${i}`] && (
            <Text style={styles.error}>{errors[`name_${i}`]}</Text>
          )}

          <TextInput
            style={styles.cardInput}
            placeholder="Amount (₹)"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={p.amount.toString()}
            onChangeText={(val) => handleInputChange(i, "amount", val)}
            editable={splitType === "custom"}
          />
          {errors[`amount_${i}`] && (
            <Text style={styles.error}>{errors[`amount_${i}`]}</Text>
          )}

          <TextInput
            style={styles.cardInput}
            placeholder="Note"
            placeholderTextColor="#aaa"
            value={p.note}
            onChangeText={(val) => handleInputChange(i, "note", val)}
          />
        </View>
      ))}



      {/* Submit */}
      <SafeAreaView style={{ flex: 1 }}>
  <View style={{ flex: 1, justifyContent: "flex-end", padding: 20,marginBottom:20 }}>
      <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity></View></SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {  flex: 1, backgroundColor: '#181717ff', padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  error: { color: "#e74c3c", marginBottom: 8, fontSize: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  option: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2c2c2c",
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedOption: { backgroundColor: "#6c5ce7" },
  optionText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  limitText: {
  color: "#aaa",
  fontSize: 12,
  marginBottom: 4,
  marginTop: -4,
},
  cardInput: {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  tallyContainer: { marginTop: 16, marginBottom: 16 },
  tallyOk: { color: "#2ecc71", fontWeight: "700", marginBottom: 6 },
  tallyBad: { color: "#e74c3c", fontWeight: "700", marginBottom: 6 },
  tallyBar: {
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    overflow: "hidden",
  },
  tallyProgress: { height: "100%", borderRadius: 6 },
  submitBtn: {
    backgroundColor: "#6c5ce7",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
