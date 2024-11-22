
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterInput from "../screens/RegisterCollaborator";

const Stack = createStackNavigator();

export default function WebRouter() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegisterInput" component={RegisterInput} />
    </Stack.Navigator>
  );
}