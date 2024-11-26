import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import Header from "../../components/Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function Audit() {
  const [userData, setUserData] = useState({ name: "", photo: "" });
  const [collaborators, setCollaborators] = useState([]);

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
    // Simulação de carregamento de colaboradores
    setCollaborators([
      { id: "1", name: "Colaborador 1" },
      { id: "2", name: "Colaborador 2" },
      // Adicione mais colaboradores conforme necessário
    ]);
  }, []);

  const handleEdit = (id) => {
    console.log(`Editando colaborador com ID: ${id}`);
    // Lógica para editar colaborador
  };

  const handleDelete = (id) => {
    console.log(`Deletando colaborador com ID: ${id}`);
    // Lógica para deletar colaborador
  };

  return (
    <View style={styles.container}>
      <Header userName={userData.name} userImage={userData.photo} />
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
                  onPress={() => handleEdit(item.id)}
                  style={styles.button}
                >
                  Editar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleDelete(item.id)}
                  style={styles.button}
                >
                  Deletar
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