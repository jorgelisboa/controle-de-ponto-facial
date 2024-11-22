import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "./src/screens/MainScreen";
import SimpleList from "./src/screens/Login";

import RegisterInput from "./src/screens/RegisterCollaborator"; // Assuming RegisterInput is in this path
import { SafeAreaView, StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  const initialRouteName =
    Platform.OS === "web" ? "RegisterInput" : "SimpleList";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="SimpleList" component={SimpleList} />
            <Stack.Screen name="RegisterInput" component={RegisterInput} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
