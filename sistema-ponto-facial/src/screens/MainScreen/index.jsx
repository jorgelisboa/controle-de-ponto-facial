import { StyleSheet, View } from "react-native";
import { height, width } from "../../constants/measures";
import SimpleList from "../../components/SimpleList";
import { useState } from "react";
// import HeatMap from "../../components/HeatMap";
import Header from "../../components/Header";
import Notification from "../../components/Notification/Notification";
import NotificationsList from "../../components/NotificationsList/NotificationsList";

import PunchClockFAB from "../../components/PunchClockFAB";
import HeatMap from "../../components/HeatMap";

export default function MainScreen({navigation}) {
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

  const exampleNotifications = [
    {
      id: '1',
      title: 'Atualização de Sistema',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    },
    {
      id: '2',
      title: 'Nova Mensagem',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    },
    {
      id: '3',
      title: 'Novo Pedido',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec.",
    }
  ];


  return (
    <View style={styles.container}>
      <Header userName={'Jonathan'} userImage={'https://avatars.githubusercontent.com/u/113566274?v=4'} navigation={navigation}/>
      {/* <NotificationsList notifications={exampleNotifications}/> */}
      <HeatMap />
      <PunchClockFAB />
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
