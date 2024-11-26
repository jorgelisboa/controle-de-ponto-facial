import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function EditWorkshift() {
  const [userData, setUserData] = useState({ name: "", photo: "" });

  useEffect(() => {
    async function loadUserData() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.name,
          photo: user.profile_photo_url || "https://via.placeholder.com/48",
        });
      }
    }
    loadUserData();
  }, []);

  return (
    <>
      <Header userName={userData.name} userImage={userData.photo} />
      <View style={styles.content}>
        <Text>Edit Workshift Screen</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});