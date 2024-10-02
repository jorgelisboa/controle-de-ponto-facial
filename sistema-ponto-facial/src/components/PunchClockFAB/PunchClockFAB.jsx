import { FAB } from "react-native-paper";
// import { API_URL } from "react-native-dotenv";
import styles from "./PunchClockFAB.styles";

export default function PunchClockFAB() {
  const baterPonto = () => {
    console.log(process.env.EXPO_PUBLIC_API_URL + "/shifts");
    fetch(process.env.API_URL + "/shifts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": undefined,
      },
      body: JSON.stringify({
        collaborator_document: "11111111111",
      }),
    }).catch((e) => {
      console.log(e.message);
    });
  };
  return (
    <FAB
      icon="plus"
      label="Bater ponto"
      accessibilityLabel="Bater ponto"
      style={styles.fab}
      onPress={baterPonto}
      variant="surface"
    />
  );
}
