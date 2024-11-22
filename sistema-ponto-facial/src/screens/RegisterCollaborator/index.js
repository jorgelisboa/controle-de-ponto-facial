import { Button, TextInput } from "react-native-paper";
import Header from "../../components/Header/Header";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import FileInput from "../../components/FileInput";

export default function RegisterCollaborator() {
  const [collaboratorInfo, setCollaboratorInfo] = useState({
    full_name: "",
    document: "",
    email: "",
    role: "",
    hourly_value: "",
    estimated_journey: "40",
    profile_photo_path: "",
    password: "",
  });
  const [collboratorsCsv, setCollaboratorsCsv] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

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

  function registerCollabs() {}

  function handleFileRegister() {}

  return (
    <View style={styles.container}>
      <Header
        userName={"Jonathan"}
        userImage={"https://avatars.githubusercontent.com/u/113566274?v=4"}
      />
      <View style={styles.topRight}>
        <FileInput
          fileName={collboratorsCsv}
          setFileName={setCollaboratorsCsv}
          acceptedTypes="text/csv"
          buttonText="Importar colaboradores via CSV"
        />
      </View>
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
          value={collaboratorInfo.full_name}
          onChangeText={(text) => changeCollaboratorField("full_name", text)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "5%",
    width: "100%",
    height: "100%",
  },
  topRight: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  baseView: {
    width: "90%",
    maxWidth: 600,
    alignItems: "center",
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
