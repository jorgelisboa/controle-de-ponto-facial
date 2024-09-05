import { View, StyleSheet, Image, Text } from "react-native";
import { height, width } from "../constants/measures";
import { Avatar } from "react-native-paper";

export default function TopArea() {
  const image = require("../../assets/fake-face.jpg");

  return (
    <View style={styles.container}>
      <Avatar.Image size={52} source={image} />
      <Text style={styles.hello}>Nome do usuário</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: width,
    height: height * 0.1,
    padding: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hello: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
