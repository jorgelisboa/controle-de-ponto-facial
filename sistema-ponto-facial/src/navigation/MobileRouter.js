
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../screens/MainScreen";
import SimpleList from "../screens/Login";
import RegisterInput from "../screens/RegisterCollaborator";

const Stack = createStackNavigator();

export default function MobileRouter() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="SimpleList" component={SimpleList} />
      <Stack.Screen name="RegisterInput" component={RegisterInput} />
    </Stack.Navigator>
  );
}