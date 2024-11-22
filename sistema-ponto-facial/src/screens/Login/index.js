import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PONTO.AI</Text>
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: 'black', underlineColor: 'transparent' } }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: 'black', underlineColor: 'transparent' } }}
      />
      <Button mode="text" onPress={() => {}} style={styles.forgotPassword}>
        Forgot Password?
      </Button>
      <Button mode="contained" onPress={() => {}} style={styles.loginButton}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    textAlign: 'left', // changed from 'center' to 'left'
    marginBottom: 32,
    fontFamily: 'monospace', // added to use a rectangular font
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: 'black',
  },
  loginButton: {
    backgroundColor: 'black',
  },
});