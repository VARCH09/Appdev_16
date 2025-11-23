import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';
import { observeAuth } from '../services/auth';
import { ActivityIndicator, View } from 'react-native';
import AppStack from './AppStack';


export default function AppNavigator() {
const [user, setUser] = React.useState(null);
const [loading, setLoading] = React.useState(true);


React.useEffect(() => {
const unsub = observeAuth((u) => {
setUser(u);
setLoading(false);
});
return unsub;
}, []);


if (loading) return (
<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
<ActivityIndicator size="large" />
</View>
);


return (
<NavigationContainer>
    {user ? <AppStack /> : <AuthStack />}
  </NavigationContainer>
);
}