import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./src/screens/MainScreen";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <SafeAreaView>
          <Stack.Screen name="Home" component={MainScreen} />
        </SafeAreaView>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
