import React from "react";
import styled from "styled-components/native";
import { Image } from "react-native";

const HeaderContainer = styled.View`
  width: 100%;
  padding: 18px 18px 10px 8px;
  background-color: #2f2f2d;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #3a3a36;
`;

const Logo = styled.Image`
  width: 380px;
  height: 100px;
  resize-mode: contain;
`;

export default function AppHeader() {
  return (
    <HeaderContainer>
      <Logo source={require("../../assets/logo_jebb.png")} />
    </HeaderContainer>
  );
}
