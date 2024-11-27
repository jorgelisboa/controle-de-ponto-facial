import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import Header from "../../components/Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getAllCollaborators } from "../../http/api/colabs";

export default function Audit() {
  const [userData, setUserData] = useState({ name: "", photo: "" });
  const [collaborators, setCollaborators] = useState([]);
  const { getToken } = useContext(UserContext);

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
    async function loadCollaborators() {
      try {
        const token = await getToken();
        const collaboratorsData = await getAllCollaborators(token);
        setCollaborators(collaboratorsData);
      } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de colaboradores");
      }
    }
    loadUserData();
    loadCollaborators();
  }, [getToken]);

  const handleAudit = (id) => {
    Alert.alert(
      "Auditar Colaborador",
      `Você está prestes a auditar o colaborador com ID: ${id}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "OK", onPress: () => console.log(`Auditando colaborador com ID: ${id}`) },
      ],
      { cancelable: true }
    );
  };

  const handleSettings = (option) => {
    if (option === "logout") {
      handleLogout();
    } else if (option === "extractReport") {
      handleExtractReport();
    }
  };

  const handleLogout = async () => {
    const token = await getToken();
    logout(token);
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  const handleExtractReport = async () => {
    try {
      const token = await getToken();
      const { collaborator } = await getUserData();
      await getColabWorkShift({
        collaboratorDocument: collaborator.document,
        isPdf: true,
        token,
      });
      Alert.alert("Relatório PDF extraído com sucesso!");
    } catch (error) {
      console.error("Error extracting PDF report:", error);
      Alert.alert("Erro ao extrair relatório PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        userName={userData.name}
        userImage={userData.photo}
        onSettingsPress={() =>
          Alert.alert(
            "Configurações",
            "Escolha uma opção",
            [
              { text: "Sair", onPress: () => handleSettings("logout") },
              {
                text: "Extrair Relatório PDF",
                onPress: () => handleSettings("extractReport"),
              },
              { text: "Cancelar", style: "cancel" },
            ],
            { cancelable: true }
          )
        }
      />
      <View style={styles.content}>
        <FlatList
          data={collaborators}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.name}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleAudit(item.id)}
                  style={styles.button}
                >
                  Auditar
                </Button>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 8,
    backgroundColor: "black",
  },
});