import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
// import { API_URL } from "react-native-dotenv";

export default function BaterPonto({action}) {
  return (
    <FAB
      icon="plus"
      label="Bater ponto"
      accessibilityLabel="Bater ponto"
      style={styles.fab}
      onPress={action}
      variant="surface"
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 20,
  },
});
