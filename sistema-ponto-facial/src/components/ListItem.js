import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { width } from "../constants/measures";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ListItem(props) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.title}>{props.data.title ?? "Item title"}</Text>
      <Text style={styles.description}>
        {props.data.description ?? "Description of the item"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start", // Align items to the left
    width: width * 0.9,
    height: "100%",
    marginBottom: 12,
    borderWidth: 2,
    padding: 16,
    borderRadius: 8,
    display: "flex",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    marginVertical: 8,
    color: "#DDD",
  },
});
