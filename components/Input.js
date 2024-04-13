import { TextInput, StyleSheet, View, Text } from "react-native";

const Input = ({ text, setText, label, clue }) => {
  return (
    <View >
      <View>{label}</View>
      {text !== null && (
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder={clue}
          
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    borderColor: "#E6E6E6",
    borderWidth: 2,
    padding: 10,
    height: 40,
  },
  label: {
    fontWeight: "700",
    fontSize: 20,
  },
  clue: {
    fontWeight: "600",
    fontSize: 15,
    color: "#AFAFAF",
  },
});

export default Input;
