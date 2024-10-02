import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { width, height } from "../../constants/measures";
import { login } from "../../constants/i18n/portuguese";

export default function Login({navigation, props}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props?.title ?? login.login}</Text>
      <TextInput label={login.username} style={styles.input} />
      <TextInput label={login.password} style={styles.input} />
      <Button style={styles.button}>{login.login}</Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    marginBottom: 16,
  },
  button: {
    marginVertical: 16,
  },
});
