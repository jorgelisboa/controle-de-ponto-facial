import { StyleSheet, View } from "react-native";
import { height, width } from "../../constants/measures";
import SimpleList from "../../components/SimpleList";
import { useState } from "react";
import HeatMap from "../../components/HeatMap";
import Header from "../../components/Header/Header";
import Notification from "../../components/Notification/Notification";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
import WorkShiftCamera from "../../components/WorkShiftCamera";
import BaterPonto from "../../components/BaterPonto";

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

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const exampleNotifications = [
    {
      id: "1",
      title: "Atualização de Sistema",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    },
    {
      id: "2",
      title: "Nova Mensagem",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    },
    {
      id: "3",
      title: "Novo Pedido",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    },
  ];

  function openCamera() {
    setIsCameraOpen(true);
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <WorkShiftCamera />
      ) : (
        <View style={styles.content}>
          <Header
            userName={"Jonathan"}
            userImage={"https://avatars.githubusercontent.com/u/113566274?v=4"}
          />
          <NotificationsList notifications={exampleNotifications} />
          <HeatMap />
          <BaterPonto action={openCamera} />
        </View>
      )}
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
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const option = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    paddingTop: "auto",
    width: width,
    height: height,
  },
});
