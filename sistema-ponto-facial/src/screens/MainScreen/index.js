import { StyleSheet, View } from "react-native";
import { height, width } from "../../constants/measures";
import SimpleList from "../../components/SimpleList";
import { useState } from "react";

export default function MainScreen() {

  const [data, setData] = useState([
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
  ]);


  return (
    <View style={styles.container}>
      {/* TOP AREA pra mensagem */}

      <SimpleList
        title="Histórico de pontos"
        data={data}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
});
