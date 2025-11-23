import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecordsScreen from '../screens/RecordsScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import AccountsScreen from '../screens/AccountsScreen';
import BottomTabBar from '../components/BottomTabBar';


const Tab = createBottomTabNavigator();


export default function MainTabs() {
return (
<Tab.Navigator 
  tabBar={(props)=> <BottomTabBar {...props} />}
  screenOptions={{ headerShown: false }}
>
<Tab.Screen name="Records" component={RecordsScreen} />
<Tab.Screen name="Analysis" component={AnalysisScreen} />
<Tab.Screen name="Accounts" component={AccountsScreen} />
</Tab.Navigator>
);
}