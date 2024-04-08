import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Reservations from "../screens/Reservations";
import BrowseTutors from "../screens/BrowseTutors";
import LogOutPressable from "./logOutPressable";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

/**
 *
 * @param onSignOut logs the user out
 * @param userData the user's data from the database
 * @param updateUserData function that updates the user data state
 * @returns
 */
export default function PageNav({ onSignOut, userData, updateUserData }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name == "Reservations") {
              return (
                <Ionicons name="newspaper-sharp" size={24} color="black" />
              );
            }
            if (route.name === "Browse Tutors") {
              return <Entypo name="book" size={24} color="black" />;
            }
          },
          tabBarActiveTintColor: "royalblue",
          headerStyle: { backgroundColor: "royalblue" },
          headerTintColor: "white",
        })}
        initialRouteName="Home Screen"
      >
        <Tab.Screen
          name="Reservations"
          children={() => (
            <Reservations userData={userData} updateUserData={updateUserData} />
          )}
          options={{
            headerRight: () => {
              return <LogOutPressable onSignOut={onSignOut} />;
            },
          }}
        />
        <Tab.Screen
          name="Browse Tutors"
          children={() => (
            <BrowseTutors userData={userData} updateUserData={updateUserData} />
          )}
          options={{
            headerRight: () => {
              return <LogOutPressable onSignOut={onSignOut} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
