import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [collaborator, setCollaborator] = useState(null);

  const storeToken = async (newToken) => {
    try {
      console.log("=== Storing Token ===");
      if (newToken) {
        await AsyncStorage.setItem("access_token", newToken);
        console.log(`Token stored: ${newToken}`);
      } else {
        await AsyncStorage.removeItem("access_token");
        console.log("Token removed from storage");
      }
      setToken(newToken);

      // Log current storage state after operation
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      console.log("=== Updated AsyncStorage Contents ===");
      for (const [key, value] of items) {
        console.log(`- ${key}: ${value}`);
      }
      console.log("====================================");
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      setToken(storedToken);
      return storedToken;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const storeUserData = async (user, collaborator) => {
    try {
      console.log("Storing user data and collaborator data...");
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
      await AsyncStorage.setItem(
        "collaborator_data",
        JSON.stringify(collaborator)
      );
      console.log("User data and collaborator data stored successfully");
      setCollaborator(collaborator);

      // Log current storage state after operation
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      console.log("=== Updated AsyncStorage Contents ===");
      for (const [key, value] of items) {
        console.log(`- ${key}: ${value}`);
      }
      console.log("====================================");
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const getUserData = async () => {
    try {
      console.log("Fetching user data...");
      const user = await AsyncStorage.getItem("user_data");
      const collaborator = await AsyncStorage.getItem("collaborator_data");
      console.log("=== Retrieved User Data ===");
      console.log("user_data:");
      console.log(JSON.stringify(JSON.parse(user), null, 2));
      console.log("collaborator_data:");
      console.log(JSON.stringify(JSON.parse(collaborator), null, 2));
      console.log("===========================");
      setCollaborator(JSON.parse(collaborator));
      return { user: JSON.parse(user), collaborator: JSON.parse(collaborator) };
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  };

  const logout = () => storeToken(null);

  return (
    <UserContext.Provider
      value={{
        token,
        storeToken,
        getToken,
        logout,
        storeUserData,
        getUserData,
        collaborator,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
