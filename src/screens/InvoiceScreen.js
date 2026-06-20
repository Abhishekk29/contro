import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Avatar colors (matches QuickControScreen) ────────────────────────────────
const AVATAR_COLORS = [
  { bg: "rgba(124,111,247,0.18)", text: "#a89bf9" },
  { bg: "rgba(29,158,117,0.18)", text: "#3dcfa0" },
  { bg: "rgba(212,83,126,0.18)", text: "#e07ba0" },
  { bg: "rgba(239,159,39,0.18)", text: "#f5b94e" },
  { bg: "rgba(55,138,221,0.18)", text: "#74b6f0" },
  { bg: "rgba(99,153,34,0.18)", text: "#93c455" },
];

function Avatar({ name, index, size = 36 }) {
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];
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
        style={{ color: colors.text, fontSize: size * 0.38, fontWeight: "800" }}
      >
        {name?.charAt(0)?.toUpperCase() || "?"}
      </Text>
    </View>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueColor }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Logo loader ───────────────────────────────────────────────────────────────
const getLogoBase64 = async () => {
  try {
    const asset = Asset.fromModule(require("../../assets/images/logo.png"));
    await asset.downloadAsync();
    const cachePath = `${FileSystem.cacheDirectory}logo.png`;
    await FileSystem.copyAsync({
      from: asset.localUri || asset.uri,
      to: cachePath,
    });
    const resized = await ImageManipulator.manipulateAsync(
      cachePath,
      [{ resize: { width: 240 } }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.PNG, base64: true },
    );
    if (!resized.base64) throw new Error("Failed to convert logo to base64");
    return `data:image/png;base64,${resized.base64}`;
  } catch (err) {
    console.error("Error loading logo:", err);
    return null;
  }
};

// ─── PDF HTML Generator ────────────────────────────────────────────────────────
const generateHTML = ({
  controName,
  expenses = [],
  people = [],
  balances = [],
  settlements = [],
  logoBase64,
}) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const invoiceId = `CTR-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const grandTotal = expenses.reduce(
    (s, e) => s + (parseFloat(e.amount) || 0),
    0,
  );

  const expenseRows = expenses
    .map((exp, i) => {
      const participantNames = (exp.participants || [])
        .map((idx) => people[idx]?.name || `P${idx + 1}`)
        .join(", ");
      return `
        <tr>
          <td style="padding:10px 14px;">${i + 1}</td>
          <td style="padding:10px 14px; font-weight:600;">${exp.title || "—"}</td>
          <td style="padding:10px 14px; color:#aaa; font-size:12px;">${exp.category || "—"}</td>
          <td style="padding:10px 14px; font-weight:700; color:#a89bf9;">₹${(parseFloat(exp.amount) || 0).toFixed(2)}</td>
          <td style="padding:10px 14px; color:#888; font-size:12px;">${participantNames || "—"}</td>
        </tr>
      `;
    })
    .join("");

  const contributorRows = people
    .map((p, i) => {
      const paid = parseFloat(p.paid) || 0;
      const share = parseFloat(p.share) || 0;
      const balance = paid - share;
      const balanceColor =
        balance > 0 ? "#3dcfa0" : balance < 0 ? "#e05a5a" : "#888";
      const balanceStr =
        balance > 0
          ? `+₹${balance.toFixed(2)}`
          : `−₹${Math.abs(balance).toFixed(2)}`;
      return `
        <tr>
          <td style="padding:10px 14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:30px; height:30px; border-radius:50%; background:${AVATAR_COLORS[i % AVATAR_COLORS.length].bg}; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; color:${AVATAR_COLORS[i % AVATAR_COLORS.length].text}; flex-shrink:0;">
                ${p.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span style="font-weight:600;">${p.name}</span>
            </div>
          </td>
          <td style="padding:10px 14px; font-weight:700; color:#fff;">₹${paid.toFixed(2)}</td>
          <td style="padding:10px 14px; color:#aaa;">₹${share.toFixed(2)}</td>
          <td style="padding:10px 14px; font-weight:800; color:${balanceColor};">${balanceStr}</td>
        </tr>
      `;
    })
    .join("");

  const settlementRows = settlements
    .map(
      (s) => `
      <tr>
        <td style="padding:9px 14px; font-weight:600;">${s.from}</td>
        <td style="padding:9px 14px; color:#888; text-align:center;">→</td>
        <td style="padding:9px 14px; font-weight:600;">${s.to}</td>
        <td style="padding:9px 14px; font-weight:800; color:#3dcfa0;">₹${s.amount}</td>
      </tr>
    `,
    )
    .join("");

  const logoHTML = logoBase64
    ? `<img src="${logoBase64}" style="height:32px; width:auto; opacity:0.85;" />`
    : `<span style="font-size:18px; font-weight:800; color:#a89bf9;">Contro</span>`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
            background: #0b0b0f;
            color: #e8e8f0;
            min-height: 100vh;
          }

          /* ── Header ── */
          .header {
            background: #131318;
            border-bottom: 1px solid #1f1f2b;
            padding: 32px 40px 28px;
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }
          .brand { display: flex; align-items: center; gap: 10px; }
          .brand-name {
            font-size: 13px;
            font-weight: 700;
            color: #555;
            letter-spacing: 1px;
          }
          .invoice-title {
            font-size: 30px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
            line-height: 1.1;
          }
          .invoice-subtitle {
            font-size: 13px;
            color: #555;
            margin-top: 4px;
          }
          .invoice-id {
            font-size: 11px;
            font-weight: 700;
            color: #7c6ff7;
            background: rgba(124,111,247,0.12);
            border: 1px solid rgba(124,111,247,0.25);
            padding: 5px 14px;
            border-radius: 99px;
            letter-spacing: 0.5px;
          }
          .meta-chips {
            display: flex;
            gap: 12px;
            margin-top: 6px;
          }
          .chip {
            background: #1c1c26;
            border: 1px solid #252535;
            border-radius: 10px;
            padding: 10px 16px;
            flex: 1;
          }
          .chip-label {
            font-size: 9px;
            font-weight: 700;
            color: #444;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
          }
          .chip-value {
            font-size: 16px;
            font-weight: 800;
            color: #fff;
          }
          .chip-value.purple { color: #a89bf9; }
          .chip-value.green  { color: #3dcfa0; }

          /* ── Body ── */
          .body { padding: 32px 40px; }

          .section-title {
            font-size: 10px;
            font-weight: 700;
            color: #444;
            letter-spacing: 1px;
            margin-bottom: 12px;
            margin-top: 28px;
          }
          .section-title:first-child { margin-top: 0; }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          /* ── Expense table ── */
          .table-expenses thead tr {
            background: rgba(124,111,247,0.08);
          }
          .table-expenses thead th {
            padding: 10px 14px;
            font-size: 10px;
            font-weight: 700;
            color: #7c6ff7;
            letter-spacing: 0.6px;
            text-align: left;
            border-bottom: 1px solid #1f1f2b;
          }
          .table-expenses tbody tr {
            border-bottom: 1px solid #1a1a24;
          }
          .table-expenses tbody tr:last-child { border-bottom: none; }
          .table-expenses tbody td { font-size: 13px; color: #ccc; }

          /* ── Contributors table ── */
          .table-contributors thead tr { background: #0f0f14; }
          .table-contributors thead th {
            padding: 10px 14px;
            font-size: 10px;
            font-weight: 700;
            color: #555;
            letter-spacing: 0.6px;
            text-align: left;
            border-bottom: 1px solid #1f1f2b;
          }
          .table-contributors tbody tr { border-bottom: 1px solid #1a1a24; }
          .table-contributors tbody tr:last-child { border-bottom: none; }
          .table-contributors tbody td { font-size: 13px; color: #ccc; }

          /* ── Total bar ── */
          .total-bar {
            background: #7c6ff7;
            border-radius: 12px;
            padding: 14px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
          }
          .total-bar-label {
            font-size: 11px;
            font-weight: 700;
            color: rgba(255,255,255,0.75);
            letter-spacing: 0.8px;
          }
          .total-bar-value {
            font-size: 22px;
            font-weight: 900;
            color: #fff;
            letter-spacing: -0.3px;
          }

          /* ── Settlement card ── */
          .settlement-card {
            background: #0c1812;
            border: 1px solid #1a2e22;
            border-radius: 14px;
            overflow: hidden;
            margin-top: 0;
          }
          .settlement-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border-bottom: 1px solid #1a2e22;
          }
          .settle-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3dcfa0;
            flex-shrink: 0;
          }
          .settle-header-label {
            font-size: 10px;
            font-weight: 700;
            color: #3dcfa0;
            letter-spacing: 0.8px;
          }
          .table-settlement thead th {
            padding: 9px 16px;
            font-size: 10px;
            color: #3a5a4a;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-align: left;
          }
          .table-settlement tbody td { font-size: 13px; color: #aaa; }

          /* ── Table wrapper ── */
          .table-card {
            background: #131318;
            border: 1px solid #1f1f2b;
            border-radius: 14px;
            overflow: hidden;
          }

          /* ── Footer ── */
          .footer {
            margin-top: 40px;
            border-top: 1px solid #1f1f2b;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .footer-brand { font-size: 11px; color: #444; }
          .footer-brand span { color: #7c6ff7; font-weight: 700; }
          .footer-note { font-size: 10px; color: #333; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-top">
            <div>
              <div class="brand">
                ${logoHTML}
                <span class="brand-name">CONTRO</span>
              </div>
              <div style="margin-top:16px;">
                <div class="invoice-title">${controName || "Expense Report"}</div>
                <div class="invoice-subtitle">Expense Settlement Report · ${date}</div>
              </div>
            </div>
            <div class="invoice-id">${invoiceId}</div>
          </div>
          <div class="meta-chips">
            <div class="chip">
              <div class="chip-label">GRAND TOTAL</div>
              <div class="chip-value purple">₹${grandTotal.toFixed(2)}</div>
            </div>
            <div class="chip">
              <div class="chip-label">PEOPLE</div>
              <div class="chip-value">${people.length}</div>
            </div>
            <div class="chip">
              <div class="chip-label">EXPENSES</div>
              <div class="chip-value">${expenses.length}</div>
            </div>
            <div class="chip">
              <div class="chip-label">SETTLEMENTS</div>
              <div class="chip-value green">${settlements.length}</div>
            </div>
          </div>
        </div>

        <div class="body">

          <div class="section-title">EXPENSE BREAKDOWN</div>
          <div class="table-card">
            <table class="table-expenses">
              <thead>
                <tr>
                  <th style="width:4%;">#</th>
                  <th style="width:28%;">Expense</th>
                  <th style="width:18%;">Category</th>
                  <th style="width:15%;">Amount</th>
                  <th style="width:35%;">Split between</th>
                </tr>
              </thead>
              <tbody>
                ${expenseRows || `<tr><td colspan="5" style="padding:16px; text-align:center; color:#444;">No expenses recorded</td></tr>`}
              </tbody>
            </table>
          </div>

          <div class="total-bar">
            <span class="total-bar-label">GRAND TOTAL</span>
            <span class="total-bar-value">₹${grandTotal.toFixed(2)}</span>
          </div>

          <div class="section-title">CONTRIBUTOR SUMMARY</div>
          <div class="table-card">
            <table class="table-contributors">
              <thead>
                <tr>
                  <th style="width:35%;">Name</th>
                  <th style="width:20%;">Paid</th>
                  <th style="width:20%;">Share</th>
                  <th style="width:25%;">Balance</th>
                </tr>
              </thead>
              <tbody>
                ${contributorRows || `<tr><td colspan="4" style="padding:16px; text-align:center; color:#444;">No contributors</td></tr>`}
              </tbody>
            </table>
          </div>

          ${
            settlements.length > 0
              ? `
            <div class="section-title">SETTLEMENT PLAN</div>
            <div class="settlement-card">
              <div class="settlement-header">
                <div class="settle-dot"></div>
                <span class="settle-header-label">WHO PAYS WHOM</span>
              </div>
              <table class="table-settlement">
                <thead>
                  <tr>
                    <th>From</th>
                    <th style="width:40px;"></th>
                    <th>To</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>${settlementRows}</tbody>
              </table>
            </div>
          `
              : ""
          }
        </div>

        <div class="footer">
          <div class="footer-brand">Generated by <span>Contro</span> · Expense Settlement App</div>
          <div class="footer-note">This is a computer-generated document.</div>
        </div>
      </body>
    </html>
  `;
};

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function InvoiceScreen({ route, navigation }) {
  const {
    controName = "",
    expenses = [],
    people = [],
    balances = [],
    settlements = [],
  } = route.params || {};

  const grandTotal = expenses.reduce(
    (s, e) => s + (parseFloat(e.amount) || 0),
    0,
  );
  const totalSettled = settlements.reduce(
    (s, st) => s + parseFloat(st.amount || 0),
    0,
  );
  const totalPending = grandTotal - totalSettled;

  const handleExport = async () => {
    try {
      const logoBase64 = await getLogoBase64();
      const html = generateHTML({
        controName,
        expenses,
        people,
        balances,
        settlements,
        logoBase64,
      });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Contro PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Export failed", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
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
          <Text style={styles.screenTitle}>Invoice</Text>
          <TouchableOpacity onPress={handleExport} style={styles.iconBtn}>
            <Text style={{ color: "#7c6ff7", fontSize: 16 }}>↑</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroName}>
                {controName || "Expense Report"}
              </Text>
              <Text style={styles.heroDate}>
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {" · "}
                {people.length} {people.length === 1 ? "person" : "people"}
              </Text>
            </View>
            <View style={styles.invoiceIdBadge}>
              <Text style={styles.invoiceIdText}>INVOICE</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              label="TOTAL SPENT"
              value={`₹${grandTotal.toFixed(2)}`}
              valueColor="#a89bf9"
            />
            <StatCard label="EXPENSES" value={String(expenses.length)} />
            <StatCard
              label="SETTLED"
              value={`₹${totalSettled.toFixed(2)}`}
              valueColor="#3dcfa0"
            />
            <StatCard
              label="PENDING"
              value={`₹${totalPending.toFixed(2)}`}
              valueColor="#f5b94e"
            />
          </View>
        </View>

        {/* ── Contributors ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>CONTRIBUTORS</Text>
        </View>

        {people.map((p, i) => {
          const paid = parseFloat(p.paid) || 0;
          const share = parseFloat(p.share) || 0;
          const balance = paid - share;
          const owes = balance < 0;
          const balanced = balance === 0;

          // Collect which expenses this person is part of
          const expenseLabels = expenses
            .filter((e) => e.participants?.includes(i))
            .map((e) => e.title)
            .filter(Boolean)
            .join(", ");

          return (
            <View key={p.id ?? i} style={styles.personCard}>
              <Avatar name={p.name} index={i} size={38} />
              <View style={styles.personMid}>
                <Text style={styles.personName}>{p.name}</Text>
                {expenseLabels ? (
                  <Text style={styles.personExpenseHint} numberOfLines={1}>
                    {expenseLabels}
                  </Text>
                ) : null}
              </View>
              <View style={styles.personRight}>
                <Text style={styles.personPaid}>₹{paid.toFixed(2)}</Text>
                <Text
                  style={[
                    styles.personBalance,
                    {
                      color: owes ? "#f5b94e" : balanced ? "#555" : "#3dcfa0",
                    },
                  ]}
                >
                  {owes
                    ? `owes ₹${Math.abs(balance).toFixed(2)}`
                    : balanced
                      ? "settled"
                      : `+₹${balance.toFixed(2)}`}
                </Text>
              </View>
            </View>
          );
        })}

        {/* ── Settlement Plan ── */}
        {settlements.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>SETTLEMENT PLAN</Text>
            </View>
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
          </>
        )}

        {/* ── Export CTA ── */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleExport}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaIcon}>⬇</Text>
          <Text style={styles.ctaText}>Download PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  root: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },

  // Top bar
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

  // Hero card
  heroCard: {
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.4,
  },
  heroDate: { fontSize: 12, color: MUTED, marginTop: 4 },
  invoiceIdBadge: {
    backgroundColor: "rgba(124,111,247,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,247,0.25)",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  invoiceIdText: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#0f0f14",
    borderWidth: 0.5,
    borderColor: "#1c1c26",
    borderRadius: 12,
    padding: 12,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#444",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },

  // Section header
  sectionHeader: { marginTop: 20, marginBottom: 10 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#444",
    letterSpacing: 0.9,
  },

  // Person card
  personCard: {
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
  personMid: { flex: 1 },
  personName: { fontSize: 14, fontWeight: "700", color: "#ddd" },
  personExpenseHint: { fontSize: 11, color: MUTED, marginTop: 2 },
  personRight: { alignItems: "flex-end" },
  personPaid: { fontSize: 15, fontWeight: "800", color: "#fff" },
  personBalance: { fontSize: 11, marginTop: 2 },

  // Settlement card
  settlementCard: {
    backgroundColor: "#0c1812",
    borderWidth: 0.5,
    borderColor: "#1a2e22",
    borderRadius: 16,
    overflow: "hidden",
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

  // CTA
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 24,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: PURPLE,
          shadowOpacity: 0.4,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
        }
      : { elevation: 8 }),
  },
  ctaIcon: { fontSize: 18, color: "#fff" },
  ctaText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
  },
});
