import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { auth, db } from "../services/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import AppHeader from "../components/AppHeader";
import { analyzeSpending } from "../services/api";

const Container = styled.View`
  flex: 1;
  background-color: #2f2f2d;
  padding: 16px;
`;

export default function AnalysisScreen() {
  const [transactions, setTransactions] = useState([]);
  const [aiText, setAiText] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "transactions");

    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(list);
    });

    return unsub;
  }, []);

  // Summaries
  const categoryTotals = {};
  let totalExpense = 0;
  let totalIncome = 0;

  transactions.forEach((t) => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
    categoryTotals[t.category] += t.amount;

    if (t.type === "expense") totalExpense += t.amount;
    if (t.type === "income") totalIncome += t.amount;
  });

  const generateAiAnalysis = async () => {
    setLoadingAi(true);

    const reportText = `
Here is the spending data:

Total Income: ₹${totalIncome}
Total Expense: ₹${totalExpense}

Category Breakdown:
${Object.keys(categoryTotals)
      .map((c) => `• ${c}: ₹${categoryTotals[c]}`)
      .join("\n")}
    
Give a concise analysis of where I spend the most, patterns, and suggestions.
    `;

    const response = await analyzeSpending(reportText);
    setAiText(response);
    setLoadingAi(false);
  };

  return (
    <Container>
      <AppHeader />

      <Text style={{ color: "#e9e4b6", fontSize: 22, marginTop: 10 }}>
        Spending Analysis
      </Text>

      {/* Category Breakdown */}
      <ScrollView style={{ marginTop: 20 }}>
        <Text style={{ color: "#e7d479", fontSize: 18, marginBottom: 10 }}>
          Category Summary
        </Text>

        {Object.keys(categoryTotals).map((cat) => (
          <View
            key={cat}
            style={{
              padding: 12,
              borderBottomWidth: 0.3,
              borderColor: "#444",
            }}
          >
            <Text style={{ color: "#e9e4b6", fontSize: 16 }}>{cat}</Text>
            <Text style={{ color: "#b9b39a" }}>₹{categoryTotals[cat]}</Text>
          </View>
        ))}

        {/* Generate AI Analysis */}
        <TouchableOpacity
          onPress={generateAiAnalysis}
          style={{
            backgroundColor: "#e7d479",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <Text style={{ color: "#222", fontSize: 16, fontWeight: "700" }}>
            Generate AI Analysis
          </Text>
        </TouchableOpacity>

        {/* AI Output */}
        {loadingAi ? (
          <ActivityIndicator size="large" color="#e7d479" />
        ) : (
          aiText.length > 0 && (
            <View
              style={{
                backgroundColor: "#3a3a36",
                padding: 14,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "#e9e4b6", fontSize: 16 }}>{aiText}</Text>
            </View>
          )
        )}
      </ScrollView>
    </Container>
  );
}
