import { View, StyleSheet, Image, Text } from "react-native";
import React, { useEffect, useState } from 'react';
import { height, width } from "../../constants/measures";
import { Avatar } from "react-native-paper";
import RoundedImageButton from "../RoundedImageButton/RoundedImageButton";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Header({ userName, userImage }) {
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
        <RoundedImageButton style={styles.lastChildActionButton}>
          <MaterialCommunityIcons name="timer-outline" size={24} color="rgba(34, 34, 34, 0.4)" />
        </RoundedImageButton>
        <RoundedImageButton style={styles.lastChildActionButton}>
          <AntDesign name="bells" size={24} color="rgba(34, 34, 34, 0.4)" />
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
  },
  userNameText: {
    fontSize: 20,
    lineHeight: 18,
    color: 'rgba(34, 34, 34, 1)',
    fontWeight: "500",
  },
});
