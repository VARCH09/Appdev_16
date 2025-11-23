import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { signUserOut } from '../services/auth';


const Container = styled.View`flex:1; padding:24px; background-color: #2f2f2d;`;
const NameText = styled.Text`color: #e9e4b6; font-size:18px; margin-bottom:24px;`;
const Item = styled.TouchableOpacity`padding-vertical:12px;`;
const ItemText = styled.Text`color:#e9e4b6; font-size:16px`;


export default function DrawerContent({navigation}) {
return (
<Container>
<NameText>Jebb</NameText>
<Item onPress={() => navigation.navigate('Profile')}>
<ItemText>Profile</ItemText>
</Item>
<Item onPress={async () => { await signUserOut(); }}>
<ItemText>Logout</ItemText>
</Item>
</Container>
);
}