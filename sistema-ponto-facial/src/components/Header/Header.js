import { View, StyleSheet, Image, Text, Alert } from "react-native";
import React, { useEffect, useState } from 'react';
import RoundedImageButton from "../RoundedImageButton/RoundedImageButton";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header({ userName, userImage, onSettingsPress }) {
  const [timeGreeting, setTimeGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    
    if (now.getHours() >= 0 && now.getHours() < 12) {
      setTimeGreeting('Bom dia 👋');
    } else if (now.getHours() >= 12 && now.getHours() < 18) {
      setTimeGreeting('Boa tarde 👋');
    } else if (now.getHours() >= 18 && now.getHours() < 24) {
      setTimeGreeting('Boa noite 👋');
    }
  })

  const handlePress = (buttonName) => {
    Alert.alert(
      "Configurações",
      `Você clicou em ${buttonName}`,
      [
        { text: "OK", onPress: () => console.log(`${buttonName} clicked`) },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image source={{ uri: userImage }} style={{ width: 48, height: 48, borderRadius: 10 }} />
        <View style={styles.helloContainer}>
          <Text style={styles.hello}>{timeGreeting}</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
      </View>
      <View style={styles.fastActionBtnContainer}>
        <RoundedImageButton onPress={() => handlePress("Notificações")}>
          <Ionicons name="notifications-outline" size={24} color="rgba(34, 34, 34, 0.4)" />
        </RoundedImageButton>
        <RoundedImageButton onPress={() => handlePress("Mensagens")}>
          <Ionicons name="mail-outline" size={24} color="rgba(34, 34, 34, 0.4)" />
        </RoundedImageButton>
        <RoundedImageButton style={styles.lastChildActionButton} onPress={onSettingsPress || (() => handlePress("Configurações"))}>
          <Ionicons name="settings-outline" size={24} color="rgba(34, 34, 34, 0.4)" />
        </RoundedImageButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: "5%"
  },
  helloContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hello: {
    fontSize: 16,
    color: 'rgba(34, 34, 34, 0.6)',
  },
  fastActionBtnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  userNameText: {
    fontSize: 20,
    lineHeight: 18,
    color: 'rgba(34, 34, 34, 1)',
    fontWeight: "500",
  },
});
