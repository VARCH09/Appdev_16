import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import styled from "styled-components/native";
import { signUp } from "../services/auth";
import { auth, db } from "../services/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Container = styled.View`
  flex: 1;
  background-color: #2f2f2d;
  padding: 24px;
  justify-content: center;
`;

const Input = styled.TextInput`
  background-color: #3a3a36;
  color: #e9e4b6;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
`;

const Btn = styled.TouchableOpacity`
  background-color: #e7d479;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const BtnText = styled.Text`
  color: #222;
  font-weight: 700;
  font-size: 16px;
`;

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      // 1. Create the auth user
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // 2. Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created!");
    } catch (e) {
      Alert.alert("Signup failed", e.message);
    }
  };

  return (
    <Container>

      {/* LOGO */}
      <Image
        source={require("../../assets/wallet.png")}
        style={{
          width: 120,
          height: 120,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 30,
        }}
      />

      <Input
        placeholder="Username"
        placeholderTextColor="#b9b39a"
        value={username}
        onChangeText={setUsername}
      />

      <Input
        placeholder="Email"
        placeholderTextColor="#b9b39a"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Password"
        placeholderTextColor="#b9b39a"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Input
        placeholder="Confirm Password"
        placeholderTextColor="#b9b39a"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <Btn onPress={handleSignup}>
        <BtnText>Sign Up</BtnText>
      </Btn>

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#b9b39a" }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "#e7d479", marginLeft: 8 }}>Login</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
