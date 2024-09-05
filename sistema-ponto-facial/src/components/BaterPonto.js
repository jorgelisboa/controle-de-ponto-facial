import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export default function BaterPonto() {
  return (
    <FAB
      icon="plus"
      label="Bater ponto"
      accessibilityLabel="Bater ponto"
      style={styles.fab}
      onPress={() => console.log("Pressed")}
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
