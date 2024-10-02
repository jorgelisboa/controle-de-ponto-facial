import { StyleSheet  } from "react-native";

export default styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: "5%"
  },
  helloContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hello: {
    fontSize: 16,
    color: 'rgba(34, 34, 34, 0.6)',
  },
  fastActionBtnContainer: {
    display: "flex",
    flexDirection: "row",
  },
  userNameText: {
    fontSize: 20,
    lineHeight: 18,
    color: 'rgba(34, 34, 34, 1)',
    fontWeight: "500",
  },
});