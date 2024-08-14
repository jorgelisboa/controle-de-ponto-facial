import { FlatList, StyleSheet, Text, View } from "react-native";

export default function SimpleList({ data, title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title ?? "Lista"}</Text>
      <FlatList
        data={props.data}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
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
  },
  item: {
    fontSize: 18,
    marginVertical: 8,
  },
});
