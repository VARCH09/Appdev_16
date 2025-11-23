import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme/theme';


export default function App(){
return (
<SafeAreaProvider>
<ThemeProvider theme={theme}>
<AppNavigator />
</ThemeProvider>
</SafeAreaProvider>
);
}