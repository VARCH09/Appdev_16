import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { signUserOut } from "../services/auth";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AppHeader from "../components/AppHeader";

const Container = styled.View`
  flex: 1;
  background-color: #2f2f2d;
  padding: 24px;
`;

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Set email
      setEmail(user.email);

      // Load username from Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUsername(snap.data().username || "User");
      }
    };

    loadUserData();
  }, []);

  return (
    <Container>
      {/* HEADER */}
      <AppHeader />

      {/* USERNAME */}
      <Text style={{ color: "#e9e4b6", fontSize: 26, marginTop: 20, fontWeight: "bold" }}>
        {username}
      </Text>

      {/* EMAIL */}
      <Text style={{ color: "#b9b39a", fontSize: 18, marginTop: 8 }}>
        {email}
      </Text>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        onPress={() => signUserOut()}
        style={{ marginTop: 30 }}
      >
        <Text style={{ color: "#e7d479", fontSize: 18 }}>Logout</Text>
      </TouchableOpacity>
    </Container>
  );
}
