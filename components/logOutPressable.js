import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { Pressable, StyleSheet, Text } from "react-native";

export default function LogOutPressable({ onSignOut }) {
  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      onSignOut();
    } catch (error) {
      console.error("Couldn't sign out user: ", error);
    }
  };

  return (
    <Pressable style={styles.logOutButton} onPress={signOutUser}>
      <Text style={styles.logOutText}>Log Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logOutButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginRight: 12.5,
    borderColor: "white",
    borderWidth: 2,
  },
  logOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});
