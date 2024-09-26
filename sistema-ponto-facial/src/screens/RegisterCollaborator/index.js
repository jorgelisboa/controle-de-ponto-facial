import { Button, TextInput } from "react-native-paper";
import Header from "../../components/Header/Header";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { height, width } from "../../constants/measures";
import FileInput from "../../components/FileInput";

export default function RegisterCollaborator() {
  const [collaboratorInfo, setCollaboratorInfo] = useState({
    full_name: "",
    document: "",
    email: "",
    role: "",
    hourly_value: "",
    estimated_journey: "40",
  });
  const [collboratorsCsv, setCollaboratorsCsv] = useState(null);

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
      <View style={styles.baseView}>
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Insira o nome completo do colaborador"
          accessibilityHint="Insira o nome completo do colaborador"
          keyboardType="default"
          value={collaboratorInfo.full_name}
          onChangeText={(text) => changeCollaboratorField("full_name", text)}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Insira o documento do colaborador"
          accessibilityHint="Insira o documento do colaborador"
          keyboardType="default"
          value={collaboratorInfo.document}
          onChangeText={(text) => changeCollaboratorField("document", text)}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Insira o cargo do colaborador"
          accessibilityHint="Insira o cargo do colaborador"
          keyboardType="default"
          value={collaboratorInfo.role}
          onChangeText={(text) => changeCollaboratorField("role", text)}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Insira o valor hora do colaborador"
          accessibilityHint="Insira o valor hora do colaborador"
          keyboardType="default"
          value={collaboratorInfo.hourly_value}
          onChangeText={(text) => changeCollaboratorField("hourly_value", text)}
        />
        <TextInput
          mode="outlined"
          style={styles.baseInput}
          label="Insira a jornada mensal estimada do colaborador"
          accessibilityHint="Insira a jornada mensal do colaborador"
          keyboardType="default"
          value={collaboratorInfo.estimated_journey}
          onChangeText={(text) =>
            changeCollaboratorField("estimated_journey", text)
          }
        />
        <View style={styles.baseInput}>
          <FileInput
            fileName={collboratorsCsv}
            setFileName={setCollaboratorsCsv}
          />
        </View>
        <Button
          style={styles.baseInput}
          mode="contained"
          onPress={registerCollabs}
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
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: "5%",
    width: width,
    height: height,
  },
  baseView: {
    width: width,
  },
  baseInput: {
    width: width * 0.8,
    marginHorizontal: "auto",
    maxWidth: "300px",
    marginBottom: 16,
  },
});
