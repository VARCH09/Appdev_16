import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import { auth, db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import AppHeader from "../components/AppHeader";

const ScreenContainer = styled.View`
  flex: 1;
  background-color: #2f2f2d;
`;

const Container = styled.View`
  flex: 1;
  background-color: #2f2f2d;
  padding: 16px;
`;

const AccountBox = styled.View`
  background-color: #3a3a36;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  background-color: #3a3a36;
  color: #e9e4b6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);

  const [newAccountName, setNewAccountName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newBalance, setNewBalance] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = collection(db, "users", user.uid, "accounts");

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAccounts(items);
    });

    return unsub;
  }, []);

  async function addAccount() {
    const user = auth.currentUser;
    if (!user || newAccountName.trim() === "") return;

    await addDoc(collection(db, "users", user.uid, "accounts"), {
      name: newAccountName.trim(),
      balance: 0,
    });

    setNewAccountName("");
    setAddModal(false);
  }

  async function saveBalance() {
    const user = auth.currentUser;
    if (!user || !selectedAccount) return;

    await updateDoc(
      doc(db, "users", user.uid, "accounts", selectedAccount.id),
      {
        balance: parseFloat(newBalance) || 0,
      }
    );

    setNewBalance("");
    setBalanceModal(false);
  }

  return (
      
    <Container>
        <AppHeader />
      <TouchableOpacity
        onPress={() => setAddModal(true)}
        style={{
          backgroundColor: "#e7d479",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text style={{ color: "#222", fontWeight: "700" }}>+ Add Account</Text>
      </TouchableOpacity>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountBox>
            <Text style={{ color: "#e9e4b6", fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: "#b9b39a", marginBottom: 10 }}>
              Balance: ₹{item.balance}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedAccount(item);
                setBalanceModal(true);
              }}
              style={{
                backgroundColor: "#e7d479",
                padding: 8,
                borderRadius: 6,
                width: 120,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#222" }}>Set Balance</Text>
            </TouchableOpacity>
          </AccountBox>
        )}
      />

      {/* Add Account Modal */}
      <Modal transparent visible={addModal} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000aa",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#2f2f2d",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#e7d479", fontSize: 18, marginBottom: 10 }}>
              New Account
            </Text>

            <Input
              placeholder="Account Name"
              placeholderTextColor="#777"
              value={newAccountName}
              onChangeText={setNewAccountName}
            />

            <TouchableOpacity
              onPress={addAccount}
              style={{
                backgroundColor: "#e7d479",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#222" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAddModal(false)}
              style={{
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#e9e4b6" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Set Balance Modal */}
      <Modal transparent visible={balanceModal} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000aa",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#2f2f2d",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#e7d479", fontSize: 18, marginBottom: 10 }}>
              Set Balance for {selectedAccount?.name}
            </Text>

            <Input
              placeholder="Balance Amount"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={newBalance}
              onChangeText={setNewBalance}
            />

            <TouchableOpacity
              onPress={saveBalance}
              style={{
                backgroundColor: "#e7d479",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#222" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setBalanceModal(false)}
              style={{
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#e9e4b6" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
