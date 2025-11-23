import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { auth, db } from '../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import AppHeader from "../components/AppHeader";
import { Image } from "react-native";

const Container = styled.View`flex:1; background-color:#2f2f2d;`;
const Header = styled.View`
  padding:16px;
  flex-direction:row;
  align-items:center;
  justify-content:space-between;
`;
const TitleButton = styled.TouchableOpacity`padding:4px 8px;`;
const Title = styled.Text`color:#e9e4b6; font-size:20px;`;
const SummaryRow = styled.View`flex-direction:row; justify-content:space-around; padding:12px;`;
const SummaryItem = styled.View`align-items:center`;
const Fab = styled.TouchableOpacity`
  position:absolute;
  right:18px;
  bottom:88px;
  background-color:#3f3e3b;
  width:64px;
  height:64px;
  border-radius:32px;
  align-items:center;
  justify-content:center;
`;

export default function RecordsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  // Month selection
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthModal, setMonthModal] = useState(false);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "transactions");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, snap => {
      let all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // filter by month
      const filtered = all.filter(t => {
        if (!t.createdAt) return false;
        const date = t.createdAt.toDate();
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });

      setTransactions(filtered);
    });

    return unsub;
  }, [selectedMonth, selectedYear]);

  // Totals
  let expense = 0, income = 0;
  transactions.forEach(t => {
    if (t.type === "expense") expense += t.amount;
    if (t.type === "income") income += t.amount;
  });
  let total = income - expense;

  // DELETE FUNCTION
  const deleteTransaction = async (id) => {
    const user = auth.currentUser;
    await deleteDoc(doc(db, "users", user.uid, "transactions", id));
  };

  return (
    <Container>
      <AppHeader />

      {/* HEADER */}
      <Header>
        <TitleButton onPress={() => setMonthModal(true)}>
          <Title>{monthNames[selectedMonth]}, {selectedYear} ▼</Title>
        </TitleButton>

        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={{ color: "#e7d479", fontSize: 28 }}>≡</Text>
        </TouchableOpacity>
      </Header>

      {/* Summary */}
      <SummaryRow>
        <SummaryItem>
          <Text style={{color:'#b9b39a'}}>EXPENSE</Text>
          <Text style={{color:'#ff8a80'}}>₹{expense.toFixed(2)}</Text>
        </SummaryItem>

        <SummaryItem>
          <Text style={{color:'#b9b39a'}}>INCOME</Text>
          <Text style={{color:'#60c08f'}}>₹{income.toFixed(2)}</Text>
        </SummaryItem>

        <SummaryItem>
          <Text style={{color:'#b9b39a'}}>TOTAL</Text>
          <Text style={{color:'#e9e4b6'}}>₹{total.toFixed(2)}</Text>
        </SummaryItem>
      </SummaryRow>

      {/* No data */}
      {transactions.length === 0 ? (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#b9b39a'}}>No records for this month.</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{
              padding:16,
              borderBottomWidth:0.3,
              borderColor:"#444",
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between"
            }}>
              
              {/* LEFT SIDE */}
              <View>
                <Text style={{color:"#e9e4b6", fontSize:16}}>
                  {item.type.toUpperCase()} – ₹{item.amount}
                </Text>
                <Text style={{color:"#b9b39a", fontSize:12}}>
                  {item.category}
                </Text>
              </View>

              {/* DELETE BUTTON */}
              <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                <Image
                  source={require("../../assets/bin.png")}
                  style={{
                  width: 26,
                  height: 26,
                  tintColor: "tomato",   // applies theme color
                  }}
                />
              </TouchableOpacity>


            </View>
          )}
        />
      )}

      {/* Add Transaction */}
      <Fab onPress={() => navigation.navigate("AddTransaction")}>
        <Text style={{ fontSize:32, color:"#e7d479" }}>+</Text>
      </Fab>

      {/* MONTH MODAL */}
      <Modal transparent visible={monthModal} animationType="fade">
        <View style={{
          flex:1,
          backgroundColor:"rgba(0,0,0,0.6)",
          justifyContent:"center",
          padding:20
        }}>

          <View style={{
            backgroundColor:"#2f2f2d",
            borderRadius:12,
            padding:16
          }}>

            <Text style={{color:"#e7d479", fontSize:18, marginBottom:12}}>
              Select Month
            </Text>

            <FlatList
              data={monthNames.map((m, i) => ({label: m, index: i}))}
              keyExtractor={item => item.label}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    padding:12,
                    borderBottomWidth:0.3,
                    borderColor:"#555"
                  }}
                  onPress={() => {
                    setSelectedMonth(item.index);
                    setMonthModal(false);
                  }}
                >
                  <Text style={{color:"#e9e4b6"}}>
                    {item.label} {selectedYear}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setMonthModal(false)}
              style={{
                marginTop:12,
                padding:12,
                backgroundColor:"#e7d479",
                borderRadius:8,
                alignItems:"center"
              }}
            >
              <Text style={{color:"#222"}}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </Container>
  );
}
