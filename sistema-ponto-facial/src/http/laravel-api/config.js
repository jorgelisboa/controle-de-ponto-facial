import { Platform } from "react-native";

const isWeb = Platform.OS === "web" ? true : false;

export default {
  localBaseUrl: "localhost/api",
  serverBaseUrl: "localhost/api",
  header: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": isWeb ? "ponto-web" : "ponto-app",
    "ngrok-skip-browser-warning": undefined,
  },
};
