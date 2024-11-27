import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useContext } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import { height, width } from "../../constants/measures";
import * as ImageManipulator from "expo-image-manipulator";
import { Button as PaperButton } from "react-native-paper";
import { localhost } from "../../http/api";
import { UserContext } from "../../context/UserContext";

export default function App({ onClose }) {
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const { collaborator } = useContext(UserContext);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function baterPonto() {
    if (!cameraRef.current) {
      console.error("Erro: Referência da câmera não está disponível.");
      Alert.alert("Erro", "Câmera não está disponível.");
      return;
    }

    try {
      // Captura a foto
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true, mute: true });
      console.log("Foto capturada com sucesso:", photo.uri);

      // Comprime a imagem
      const compressedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: photo.width * 0.5, height: photo.height * 0.5 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("Foto comprimida com sucesso:", compressedPhoto.uri);

      // Prepara o arquivo para envio
      const formData = new FormData();
      formData.append("collaborator_document", collaborator.document);
      formData.append("image", {
        uri: compressedPhoto.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // Envia a foto para o servidor
      const response = await fetch(`${localhost}/shifts`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Foto enviada com sucesso:", result);
      Alert.alert("Sucesso", "Ponto registrado com sucesso!");
      onClose(); // Fecha a câmera após o envio bem-sucedido
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      Alert.alert("Erro", "Tente novamente mais tarde"); // Mostra alerta em caso de erro
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <PaperButton
            style={{ width: width*0.8, marginHorizontal: 'auto' }}
            mode="contained"
            onPress={baterPonto}
          >
            Bater Ponto
          </PaperButton>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    backgroundColor: "transparent",
  },
});
