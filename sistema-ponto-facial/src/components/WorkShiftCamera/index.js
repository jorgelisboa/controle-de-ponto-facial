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
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true, mute: true }); // Mute the shutter sound

      // Compress the image
      const compressedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: photo.width * 0.5, height: photo.height * 0.5 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Prepare the file to send
      const formData = new FormData();
      formData.append("collaborator_document", collaborator.document);
      formData.append("image", {
        uri: compressedPhoto.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      try {
        const response = await fetch(`${localhost}/shifts`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
        const result = response.json();
        console.log("Foto enviada com sucesso:", result);
        onClose(); // Close the camera on successful response
      } catch (error) {
        console.error("Erro ao enviar foto:", error);
        Alert.alert("Erro", "Tente novamente mais tarde"); // Show alert on error
      }
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
