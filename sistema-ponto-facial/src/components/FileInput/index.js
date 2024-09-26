import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { width } from "../../constants/measures";

function FileInput({ fileName, setFileName }) {
  async function pickDocument() {
    let result = await DocumentPicker.getDocumentAsync({
      type: "text/csv", // Ensures only CSV files are allowed
    });
    if (result.type === "success") {
      setFileName(result.name);
    }
  }

  return (
    <View style={{ width: "100%" }}>
      <Button
        icon="upload"
        mode="contained"
        onPress={pickDocument}
        style={{
          borderRadius: 4,
          width: "100%",
          backgroundColor: fileName ? "#4CAF50" : "#6200ee", // Change color when file is selected
        }}
      >
        {fileName ? fileName : "Importar colaboradores via CSV"}
      </Button>
    </View>
  );
}

export default FileInput;
