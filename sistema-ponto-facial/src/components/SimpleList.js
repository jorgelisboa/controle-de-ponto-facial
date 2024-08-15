import { FlatList, StyleSheet, Text, View } from "react-native";
import { height, width } from "../constants/measures";
import ListItem from "./ListItem";

export default function SimpleList({ data, title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? "Lista"}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem style={styles.item} data={item}></ListItem>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  item: {
    fontSize: 18,
    marginVertical: 8,
  },
});
