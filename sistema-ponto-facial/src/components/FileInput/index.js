import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { width } from "../../constants/measures";

function FileInput({ fileName, setFileName, acceptedTypes, buttonText }) {
  async function pickDocument() {
    let result = await DocumentPicker.getDocumentAsync({
      type: acceptedTypes, // Use the acceptedTypes prop
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
        {fileName ? fileName : buttonText}
      </Button>
    </View>
  );
}

export default FileInput;
