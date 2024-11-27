import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { UserContext } from "../../context/UserContext";
import { login } from "../../http/api/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { storeToken, storeUserData } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      const data = await response.json();
      if (response.ok && data.access_token) {
        await storeToken(data.access_token);
        await storeUserData(data.user, data.collaborator);

        if (data.user.role === "admin") {
          navigation.navigate("AdminTabs");
        } else {
          navigation.navigate("Main", {
            user: data.user,
            collaborator: data.collaborator,
            token: data.access_token,
          });
        }
      } else {
        setErrorMessage(data.message || "Credenciais inválidas");
      }
    } catch (error) {
      console.log("Login erro:", error);
      setErrorMessage(
        "Ocorreu um erro. Por favor, tente novamente mais tarde."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PONTO.AI</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        theme={{ colors: { primary: "black", underlineColor: "transparent" } }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        theme={{ colors: { primary: "black", underlineColor: "transparent" } }}
      />
      <Button mode="text" onPress={() => {}} style={styles.forgotPassword}>
        Forgot Password?
      </Button>
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    textAlign: "left",
    marginBottom: 32,
    fontFamily: "monospace",
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
    color: "black",
  },
  loginButton: {
    backgroundColor: "black",
  },
  error: {
    color: "red",
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#FFE8E8",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF0000",
  },
});
