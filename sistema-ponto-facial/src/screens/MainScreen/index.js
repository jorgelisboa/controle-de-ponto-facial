import { StyleSheet, View, Text } from "react-native";
import { height, width } from "../../constants/measures";
import { useState, useEffect } from "react";
import Heatmap from "../../../Heatmap"; // Add this line
import Header from "../../components/Header/Header";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
import WorkShiftCamera from "../../components/WorkShiftCamera";
import BaterPonto from "../../components/BaterPonto";
import { getColab, getColabWorkShift } from "../../http/api/colabs"; // Import the getColab and getColabWorkShift functions

export default function MainScreen() {
  const [user, setUser] = useState(null);
  const [workShifts, setWorkShifts] = useState([]); // Add state for work shifts
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

  useEffect(() => {
    async function fetchData() {
      const { collaborators } = await getColab();
      const randomColab = collaborators[0];
      console.log(randomColab);
      setUser(randomColab);

      const worked_time = await getColabWorkShift({
        collaboratorDocument: randomColab.document,
        isPdf: false,
      });
      console.log(worked_time);
      setWorkShifts(worked_time);
    }
    fetchData();
  }, []);

  function openCamera() {
    setIsCameraOpen(true);
  }

  function closeCamera() {
    setIsCameraOpen(false);
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <WorkShiftCamera onClose={closeCamera} />
      ) : (
        <View style={styles.content}>
          <Header
            userName={user?.full_name}
            userImage="https://avatars.githubusercontent.com/u/113566274?v=4"
          />
          <NotificationsList notifications={exampleNotifications} />
          <Heatmap />
          <BaterPonto action={openCamera} />
          <View style={{ width: width, height: height }}>
            {workShifts &&
              Object.entries(workShifts).map(([month, data], index) => (
                <View key={index}>
                  <Text>{month}</Text>
                  <Text>Total Worked: {data.total_worked}</Text>
                  {data.days &&
                    data.days.map(
                      (
                        day,
                        dayIndex // Add check for data.days
                      ) => (
                        <View key={dayIndex}>
                          <Text>Date: {day.date}</Text>
                          <Text>Worked: {day.worked.join(", ")}</Text>
                        </View>
                      )
                    )}
                </View>
              ))}
          </View>
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
