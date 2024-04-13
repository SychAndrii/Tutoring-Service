import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({ onLoginSuccessful }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      console.log(email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      onLoginSuccessful(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  return (
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

      <Pressable style={styles.pressableButton} onPress={onSubmit}>
        <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
          Log In
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginForm;

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
