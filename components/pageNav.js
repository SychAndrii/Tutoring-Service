import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, StyleSheet } from "react-native";
import Screen1 from "../screens/screen1";
import Screen2 from "../screens/screen2";
import Reservations from "../screens/Reservations";
import Screen4 from "../screens/screen4";
import LogOutPressable from "./logOutPressable";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 *
 * @param onSignOut logs the user out
 * @param userData the user's data from the database
 * @param updateUserData function that updates the user data state
 * @returns
 */
export default function PageNav({ onSignOut, userData, updateUserData }) {
  const StackContainerComponent = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "royalblue" },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="First Screen"
          component={Screen1}
          options={{
            headerRight: () => {
              return <LogOutPressable onSignOut={onSignOut} />;
            },
          }}
        />
        <Stack.Screen
          name="Second Screen"
          component={Screen2}
          options={{
            headerRight: () => {
              return <LogOutPressable onSignOut={onSignOut} />;
            },
          }}
        />
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "royalblue" },
          headerTintColor: "white",
        }}
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
          name="Home Screen"
          component={Screen4}
          options={{
            headerRight: () => {
              return <LogOutPressable onSignOut={onSignOut} />;
            },
          }}
        />
        <Tab.Screen
          name="ABC"
          component={StackContainerComponent}
          options={{
            headerShown: false,
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
