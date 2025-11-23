import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import styled from "styled-components/native";
import { signIn } from "../services/auth";

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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert("Login failed", e.message);
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

      <Btn onPress={handleLogin}>
        <BtnText>Login</BtnText>
      </Btn>

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#b9b39a" }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{ color: "#e7d479", marginLeft: 8 }}>Create one</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
