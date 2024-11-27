import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, Modal, TextInput } from "react-native";
import { Text, Button } from "react-native-paper";
import Header from "../../components/Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/UserContext";
import { getColab, createAudit } from "../../http/api/colabs";

export default function Audit() {
  const [userData, setUserData] = useState({ name: "", photo: "" });
  const [collaborators, setCollaborators] = useState([]);
  const { getToken, getUserData } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCollaboratorDocument, setSelectedCollaboratorDocument] = useState("");

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
        if (!token) {
          throw new Error("Token não encontrado");
        }
        const response = await getColab(token);
        if (response && response.message === "success") {
          setCollaborators(response.collaborators);
        } else {
          throw new Error("Resposta inválida do servidor");
        }
      } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        Alert.alert("Erro", `Não foi possível carregar a lista de colaboradores: ${error.message}`);
      }
    }
    loadUserData();
    loadCollaborators();
  }, [getToken]);

  const handleAudit = (id) => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const { collaborator } = await getUserData();

      const response = await fetch('http://98.84.198.179/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          created_by: collaborator.document,
          assigned_to: selectedCollaboratorDocument || collaborator.document,
          record_type: subtitle || "Default Record Type",
          description: description || "Default Description",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro ao criar auditoria:', errorData);
        return;
      }

      const result = await response.json();
      console.log('Audit Created Successfully:', result);
      setModalVisible(false);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
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
          keyExtractor={(item) => item.document}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.user.name}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleAudit(item.document)}
                  style={styles.button}
                >
                  Auditar
                </Button>
              </View>
            </View>
          )}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>O que aconteceu?</Text>
            <TextInput
              style={styles.input}
              placeholder="Subtítulo"
              maxLength={16}
              value={subtitle}
              onChangeText={setSubtitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição"
              maxLength={120}
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.buttonRow}>
              <Button mode="contained" onPress={handleSubmit} style={styles.modalButton}>
                Enviar
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalButton}>
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: '80%',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 5,
  },
  textArea: {
    height: 80,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});