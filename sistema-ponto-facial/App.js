import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MobileRouter from "./src/navigation/MobileRouter";
import { UserContextProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <UserContextProvider>
          <NavigationContainer>
            <MobileRouter />
          </NavigationContainer>
        </UserContextProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
