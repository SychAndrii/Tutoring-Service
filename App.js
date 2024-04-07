import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import PageNav from "./components/pageNav";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { db } from "./firebaseConfig";
import {
  doc,
  query,
  where,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const onSignOut = () => {
    setLoggedIn(false);
  };

  const updateUserData = (userData) => {
    setUserData(userData);
  };

  const logInUser = async () => {
    try {
      console.log("Email: ", email);
      console.log("Password: ", password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User: ", userCredential.user.email);

      // Verify if someone is a tutee or a tutor
      const q = query(collection(db, "tutees"), where("email", "==", email));

      const querySnapshot = await getDocs(q);

      // console.log("QuerySnapshot result size: ", querySnapshot.size);

      if (querySnapshot.size === 0) {
        alert("This email is registered as a tutor.");
      } else {
        const data = querySnapshot.docs[0].data();
        // console.log(data);
        setUserData(data);
        // create object of user data
        setLoggedIn(true);
        alert("Login complete!");
      }
    } catch (err) {
      alert("Invalid login credentials. Please try again.");
      console.error("Error logging in: ", err);
    }
  };

  return (
    <>
      {loggedIn ? (
        <PageNav
          onSignOut={onSignOut}
          userData={userData}
          updateUserData={updateUserData}
        />
      ) : (
        <View style={styles.logInContainer}>
          <View style={{ flex: 0.15 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              Mastery
            </Text>
          </View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.inputStyle}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <Pressable style={styles.pressableButton} onPress={logInUser}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              Log In
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  logInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    width: "60%",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  pressableButton: {
    backgroundColor: "royalblue",
    padding: 10,
    borderRadius: 5,
    width: "25%",
    marginTop: 10,
  },
});
