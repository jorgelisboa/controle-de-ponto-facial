import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RegisterInput from "../screens/RegisterCollaborator";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="RegisterInput" component={RegisterInput} />
    </Stack.Navigator>
  );
}

export default function WebRouter() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
