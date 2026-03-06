import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator onLogout={handleLogout} />
    </NavigationContainer>
  );
}
