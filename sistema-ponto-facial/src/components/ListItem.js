export default function ListItem(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title ?? "Item title"}</Text>
      <Text style={styles.description}>
        {props.description ?? "Description of the item"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.2,
    height: height * 0.2,
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
