import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WebRouter from "./src/navigation/WebRouter";
import MobileRouter from "./src/navigation/MobileRouter";

export default function App() {
  const isWeb = Platform.OS === "web";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          {isWeb ? <WebRouter /> : <MobileRouter />}
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
