import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
       const token = await AsyncStorage.getItem('sf_token');
       if (token) setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  const handleLogin = async (user) => {
    if (user && user.token) {
        await AsyncStorage.setItem('sf_token', user.token);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('sf_token');
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
