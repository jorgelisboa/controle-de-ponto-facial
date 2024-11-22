
import React, { createContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ token: null, email: null });
  const navigation = useNavigation();

  useEffect(() => {
    if (!user.token) {
      navigation.navigate("LoginScreen");
    } else {
      navigation.navigate("MainScreen");
    }
  }, [user, navigation]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};