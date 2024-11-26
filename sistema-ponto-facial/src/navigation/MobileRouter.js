import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";
import MainScreen from "../screens/MainScreen";
import Login from "../screens/Login";
import RegisterInput from "../screens/RegisterCollaborator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function MobileRouter() {
  const { token, getToken } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      // Debug AsyncStorage contents
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        console.log('=== AsyncStorage Contents ===');
        items.forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log('==========================');
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }

      await getToken();
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="RegisterInput" component={RegisterInput} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}