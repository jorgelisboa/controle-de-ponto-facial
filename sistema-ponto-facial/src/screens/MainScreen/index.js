import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { height, width } from "../../constants/measures";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Heatmap from "../../../Heatmap";
import Header from "../../components/Header/Header";
import WorkShiftCamera from "../../components/WorkShiftCamera";
import BaterPonto from "../../components/BaterPonto";
import { fetchUserData, getColabWorkShift } from "../../http/api/colabs";
import { logout } from "../../http/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainScreen({ navigation, route }) {
  const [user, setUser] = useState(route.params?.user || {});
  const [collaborator, setCollaborator] = useState(route.params?.collaborator || {});
  const [workShifts, setWorkShifts] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, getUserData } = useContext(UserContext);
  const [workedTime, setWorkedTime] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data for MainScreen...");
        setIsLoading(true);
        const { user, workShifts, workedTime } = await fetchUserData(
          getToken,
          getUserData
        );
        console.log("Fetched user data:", user);
        console.log("Fetched work shifts:", workShifts);
        console.log("Fetched worked time:", workedTime);
        setUser(user);
        setCollaborator(collaborator);
        setWorkShifts(workShifts);
        setWorkedTime(workedTime);
        console.log("Data fetched successfully for MainScreen");
      } catch (error) {
        console.error("Error fetching data:", error);
        setWorkShifts({});
        setWorkedTime([]);
      } finally {
        setIsLoading(false);
      }
    }
    if (!route.params?.user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [route.params?.user]);

  const handleLogout = async () => {
    const token = await getToken();
    logout(token);
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  const handleExtractReport = async () => {
    try {
      const token = await getToken();
      const { collaborator } = await getUserData();
      await getColabWorkShift({
        collaboratorDocument: collaborator.document,
        isPdf: true,
        token,
      });
      Alert.alert("Relatório PDF extraído com sucesso!");
    } catch (error) {
      console.error("Error extracting PDF report:", error);
      Alert.alert("Erro ao extrair relatório PDF.");
    }
  };

  const handleSettings = (option) => {
    if (option === "logout") {
      handleLogout();
    } else if (option === "extractReport") {
      handleExtractReport();
    }
  };

  function openCamera() {
    setIsCameraOpen(true);
  }

  function closeCamera() {
    setIsCameraOpen(false);
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <WorkShiftCamera onClose={closeCamera} />
      ) : (
        <View style={styles.content}>
          <Header
            userName={user?.name}
            userImage={user?.profile_photo_url}
            onSettingsPress={() =>
              Alert.alert(
                "Configurações",
                "Escolha uma opção",
                [
                  { text: "Sair", onPress: () => handleSettings("logout") },
                  {
                    text: "Extrair Relatório PDF",
                    onPress: () => handleSettings("extractReport"),
                  },
                  { text: "Cancelar", style: "cancel" },
                ],
                { cancelable: true }
              )
            }
          />
          <View
            style={{
              width: width,
              height: height,
              flex: 1,
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {workShifts && Object.keys(workShifts).length > 0 && (
              <FlatList
                data={workedTime}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Text style={styles.text}>Date: {item.date}</Text>
                    <Text style={styles.text}>
                      Worked:{" "}
                      {Array.isArray(item.worked)
                        ? item.worked.join(", ")
                        : "No data"}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.text}>
                      Você ainda não registrou nenhum ponto
                    </Text>
                  </View>
                }
              />
            )}
          </View>
          <Heatmap />
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
  text: {
    fontSize: 20,
    fontFamily: "monospace",
    textAlign: "center",
  },
});
