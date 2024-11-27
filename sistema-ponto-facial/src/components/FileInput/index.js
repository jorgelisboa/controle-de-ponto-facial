import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

function FileInput({ fileName, setFileName, acceptedTypes, buttonText }) {
  async function pickDocument() {
    let result = await DocumentPicker.getDocumentAsync({
      type: acceptedTypes,
    });
    if (result.type === "success") {
      setFileName(result.name);
    } else if (acceptedTypes.includes("image/*")) {
      let imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType[acceptedTypes.split("/")[0]],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!imageResult.cancelled) {
        setFileName(imageResult.uri.split('/').pop());
      }
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
