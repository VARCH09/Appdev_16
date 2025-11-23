import React, { useState } from 'react';
import { Text, TouchableOpacity, Modal, FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalculatorPad from '../components/CalculatorPad';
import { auth, db } from '../services/firebaseConfig';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { incomeCategories, expenseCategories } from '../constants/categories';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #2f2f2d;
  padding: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TypeRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-vertical: 12px;
`;

const CalcDisplay = styled.View`
  height: 90px;
  background-color: #3a3a36;
  border-radius: 10px;
  align-items: flex-end;
  justify-content: center;
  padding: 12px;
  margin-bottom: 12px;
`;

export default function AddTransactionScreen({ navigation }) {
  const [value, setValue] = useState("0");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Select Category");
  const [categoryModal, setCategoryModal] = useState(false);

  function onKeyPress(k) {
    if (k === "C") return setValue("0");
    if (k === "DEL") return setValue(value.length > 1 ? value.slice(0, -1) : "0");
    if (k === "=") {
      try {
        let expr = value.replace(/×/g, "*").replace(/÷/g, "/");
        setValue(String(eval(expr)));
      } catch {
        setValue("0");
      }
      return;
    }
    if (value === "0") setValue(k);
    else setValue(value + k);
  }

  async function saveTransaction() {
    if (value === "0") return;
    if (category === "Select Category") return;

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      type,
      category,
      amount: parseFloat(value),
      createdAt: serverTimestamp()
    });

    navigation.goBack();
  }

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <Container edges={['top']}>

      {/* Top Row */}
      <Row>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#e7d479" }}>✕ CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={saveTransaction}>
          <Text style={{ color: "#e7d479" }}>✓ SAVE</Text>
        </TouchableOpacity>
      </Row>

      {/* Type Selector */}
      <TypeRow>
        <TouchableOpacity onPress={() => setType("income")}>
          <Text style={{ color: type === "income" ? "#e7d479" : "#e9e4b6" }}>INCOME</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setType("expense")}>
          <Text style={{ color: type === "expense" ? "#e7d479" : "#e9e4b6" }}>EXPENSE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setType("transfer")}>
          <Text style={{ color: type === "transfer" ? "#e7d479" : "#e9e4b6" }}>TRANSFER</Text>
        </TouchableOpacity>
      </TypeRow>

      {/* Category Selector */}
      <TouchableOpacity
        style={{
          backgroundColor: "#3a3a36",
          padding: 14,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={() => setCategoryModal(true)}
      >
        <Text style={{ color: "#e9e4b6" }}>{category}</Text>
      </TouchableOpacity>

      {/* Amount Display */}
      <CalcDisplay>
        <Text style={{ color: "#e9e4b6", fontSize: 36 }}>{value}</Text>
      </CalcDisplay>

      {/* Calculator Pad */}
      <CalculatorPad onPressKey={onKeyPress} />

      {/* Category Modal */}
      <Modal transparent visible={categoryModal} animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: "#000000aa",
          justifyContent: "center",
          padding: 20
        }}>
          <View style={{
            backgroundColor: "#2f2f2d",
            borderRadius: 12,
            padding: 16
          }}>
            <Text style={{ color: "#e7d479", fontSize: 18, marginBottom: 10 }}>
              Select Category
            </Text>

            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCategory(item);
                    setCategoryModal(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 0.3,
                    borderColor: "#555",
                  }}
                >
                  <Text style={{ color: "#e9e4b6" }}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setCategoryModal(false)}
              style={{
                marginTop: 10,
                padding: 12,
                backgroundColor: "#e7d479",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#222" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </Container>
  );
}
