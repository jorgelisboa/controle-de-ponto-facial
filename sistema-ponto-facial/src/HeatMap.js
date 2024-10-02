import { StyleSheet, View } from "react-native";
import { height, width } from "../constants/measures";
import HeatMap from "react-native-heatmap-chart";

export default function CustomHeatMap({
  numberOfLines = 5,
  values = [
    0, 4, 6, 1, 7, 3, 0, 8, 6, 2, 0, 10, 20, 12, 0, 0, 10, 0, 17, 8, 0, 6, 0, 6,
    10, 23, 0, 4, 6, 1, 7, 3, 0, 8, 6, 2, 0, 10, 20, 12, 0, 0, 10, 0, 17, 8, 0,
    6, 0, 6, 10, 23,
  ],
  onBlockPress = () => console.log("aaaaaaaaaaaaaa"),
}) {
  return (
    <View style={styles.container}>
      {/* <HeatMap
        numberOfLines={numberOfLines}
        values={values}
        onBlockPress={onBlockPress}
      /> */}
      <View style={styles.description}>
        {/* <HeatMap
          numberOfLines={1}
          values={[0, 1, 6, 100]}
          onBlockPress={onBlockPress}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  description: {
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FFF",
    fontWeight: "bold",
    width: width,
    height: 32,
    marginVertical: 16,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  }
});
