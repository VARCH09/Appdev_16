import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';


const Bar = styled.View`flex-direction:row; height:72px; background-color:#3a3a36; align-items:center; justify-content:space-around; padding-bottom:12px;`;
const TabBtn = styled.TouchableOpacity`flex:1; align-items:center; justify-content:center;`;
const TabText = styled.Text`${{color:'#e7d479'}}`;


export default function BottomTabBar({ state, descriptors, navigation }) {
return (
<Bar>
{state.routes.map((route, idx) => {
const focused = state.index === idx;
return (
<TabBtn key={route.key} onPress={() => navigation.navigate(route.name)}>
<Text style={{ color: focused ? '#e7d479' : '#b9b39a' }}>{route.name}</Text>
</TabBtn>
);
})}
</Bar>
);
}