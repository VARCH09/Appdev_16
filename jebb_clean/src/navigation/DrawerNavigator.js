import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './MainTabs';
import ProfileScreen from '../screens/ProfileScreen';
import DrawerContent from '../components/DrawerContent';


const Drawer = createDrawerNavigator();


export default function DrawerNavigator() {
return (
<Drawer.Navigator
screenOptions={{ headerShown: false }}
drawerContent={(props) => <DrawerContent {...props} />}
>
<Drawer.Screen name="HomeTabs" component={MainTabs} />
<Drawer.Screen name="Profile" component={ProfileScreen} />
</Drawer.Navigator>
);
}