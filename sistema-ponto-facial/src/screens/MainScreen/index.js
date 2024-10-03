import { StyleSheet, View } from "react-native";
import { height, width } from "../../constants/measures";
import { useState } from "react";
import Header from "../../components/Header/Header";
import BaterPonto from "../../components/BaterPonto";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
  
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

  async function baterPonto() {
    // Get current Location

    // Get user document

    // Make api request

    // Deal with response
  }

  return (
    <View style={styles.container}>
      <Header userName={'Jonathan'} userImage={'https://avatars.githubusercontent.com/u/113566274?v=4'} />
      <NotificationsList notifications={exampleNotifications}/>

      <BaterPonto action={() => BaterPonto()}/>
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
