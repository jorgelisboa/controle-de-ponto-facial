import { Button, TextInput, Snackbar } from "react-native-paper";
import { View, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import FileInput from "../../components/FileInput";
import { register, logout, getColabWorkShift } from "../../http/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header/Header";

export default function RegisterCollaborator() {
  const [userData, setUserData] = useState({ name: "", photo: "" });
  const [collaboratorInfo, setCollaboratorInfo] = useState({
    name: "", // Changed from name to full_name
    document: "",
    email: "",
    role: "",
    hourly_value: "",
    estimated_journey: "40",
    profile_photo_path: "",
    password: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

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

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  function changeCollaboratorField(key, value) {
    setCollaboratorInfo((prevFormInfo) => ({
      ...prevFormInfo,
      [key]: value,
    }));
  }

  async function registerCollabs() {
    try {
      if (!profilePhoto) {
        setSnackbarMessage("Por favor, selecione uma foto de perfil");
        setSnackbarError(true);
        setSnackbarVisible(true);
        return;
      }

      const formData = new FormData();
      
      // Append all collaborator info except photo
      Object.keys(collaboratorInfo).forEach(key => {
        if (key !== 'profile_photo_path') {
          formData.append(key, collaboratorInfo[key]);
        }
      });

      // Append the image file with correct structure
      const photoFile = {
        uri: Platform.OS === 'android' ? profilePhoto.uri : profilePhoto.uri.replace('file://', ''),
        type: 'image/jpeg',
        name: 'profile_photo.jpg'
      };
      
      formData.append('profile_photo_path', photoFile);

      // Log FormData for debugging
      console.log('FormData contents:', formData);

      const response = await register(formData);

      if (response.ok) {
        setSnackbarMessage("Colaborador cadastrado com sucesso!");
        setSnackbarError(false);
        // Reset form
        setCollaboratorInfo({
          name: "",
          document: "",
          email: "",
          role: "",
          hourly_value: "",
          estimated_journey: "40",
          profile_photo_path: "",
          password: "",
        });
        setProfilePhoto(null);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSnackbarMessage("Erro ao cadastrar colaborador: " + error.message);
      setSnackbarError(true);
    } finally {
      setSnackbarVisible(true);
    }
  }

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
      <View style={styles.baseView}>
        <View style={styles.baseInput}>
          <FileInput
            fileName={profilePhoto}
            setFileName={setProfilePhoto}
            acceptedTypes="image/*"
            buttonText="Inserir foto de perfil"
          />
        </View>
        <TextInput
          mode="outlined"
         style={styles.baseInput}
          label="Nome completo do colaborador"
          accessibilityHint="Insira o nome completo do colaborador"
          keyboardType="default"
          value={collaboratorInfo.name}
          onChangeText={(text) => changeCollaboratorField("name", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Documento do colaborador"
          accessibilityHint="Insira o documento do colaborador"
          keyboardType="default"
          value={collaboratorInfo.document}
          onChangeText={(text) => changeCollaboratorField("document", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Cargo do colaborador"
          accessibilityHint="Insira o cargo do colaborador"
          keyboardType="default"
          value={collaboratorInfo.role}
          onChangeText={(text) => changeCollaboratorField("role", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Valor hora do colaborador"
          accessibilityHint="Insira o valor hora do colaborador"
          keyboardType="default"
          value={collaboratorInfo.hourly_value}
          onChangeText={(text) => changeCollaboratorField("hourly_value", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Jornada mensal estimada do colaborador"
          accessibilityHint="Insira a jornada mensal do colaborador"
          keyboardType="default"
          value={collaboratorInfo.estimated_journey}
          onChangeText={(text) =>
            changeCollaboratorField("estimated_journey", text)
          }
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Email do colaborador"
          accessibilityHint="Insira o email do colaborador"
          keyboardType="email-address"
          value={collaboratorInfo.email}
          onChangeText={(text) => changeCollaboratorField("email", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Senha do colaborador"
          accessibilityHint="Insira a senha do colaborador"
          keyboardType="default"
          secureTextEntry
          value={collaboratorInfo.password}
          onChangeText={(text) => changeCollaboratorField("password", text)}
          theme={{ colors: { text: "#000", primary: "#000" } }}
        />
        <Button
          style={styles.button}
          mode="contained"
          onPress={registerCollabs}
          labelStyle={styles.buttonText}
        >
          Criar colaborador
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: snackbarError ? "red" : "green" }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  baseView: {
    width: "90%",
    maxWidth: 600,
    alignItems: "center",
    paddingTop: 20,
  },
  baseInput: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  button: {
    width: "100%",
    backgroundColor: "#FFF",
  },
  buttonText: {
    color: "#000",
  },
});
