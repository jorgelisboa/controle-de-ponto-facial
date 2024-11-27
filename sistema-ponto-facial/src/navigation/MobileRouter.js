import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserContext } from "../context/UserContext";
import MainScreen from "../screens/MainScreen";
import Login from "../screens/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Audit from "../screens/Audit";
import EditWorkshift from "../screens/EditWorkshift";
import RegisterCollaborator from "../screens/RegisterCollaborator";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="RegisterCollaborator"
        component={RegisterCollaborator}
        options={{
          tabBarLabel: "Cadastrar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-plus"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Audit"
        component={Audit}
        options={{
          tabBarLabel: "Auditoria",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document-edit"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EditWorkshift"
        component={EditWorkshift}
        options={{
          tabBarLabel: "Editar Turno",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-edit"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator({ token, userData }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen
          name="Main"
          component={userData?.role === "admin" ? AdminNavigator : MainScreen}
        />
      )}
    </Stack.Navigator>
  );
}

export default function MobileRouter() {
  const { token, getToken, userData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      // Debug AsyncStorage contents
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        console.log("=== AsyncStorage Contents ===");
        items.forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log("==========================");
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
      }

      await getToken();
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <RootNavigator token={token} userData={userData} />;
}
