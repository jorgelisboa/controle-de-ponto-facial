import { StyleSheet, View } from "react-native";
import { height, width } from "../../constants/measures";
import SimpleList from "../../components/SimpleList";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      {/* TOP AREA pra mensagem */}

      <SimpleList
        title="Histórico de pontos"
        data={[
          {
            id: "1",
            title: "Ponto 1",
            description: "27/09/21 - 10:00 / 27/09/21 - 16:00",
          },
          {
            id: "2",
            title: "Ponto 2",
            description: "28/09/21 - 10:30 / 27/09/21 - 16:30",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
});
