import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const Item = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.header}>
      <Image source={{ uri: item.photo }} style={styles.photo} />
      <View style={styles.headerText}>
        <Text style={styles.name}>
          {item.name.first} {item.name.last}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
    <Text>Experience: {item.experience} years</Text>
    <Text>Fee: ${item.fee} per hour</Text>
    <Text>Remote: {item.isRemote ? "Yes" : "No"}</Text>
    <Text style={styles.sectionHeader}>Technologies:</Text>
    <Text>{item.technologies.join(", ")}</Text>
    <Text style={styles.sectionHeader}>Portfolio:</Text>
    {item.portfolio.map((project, index) => (
      <Text key={index}>{project}</Text>
    ))}
  </View>
);

const AllTutors = ({ tutors }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tutors}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    flex: 1,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  headerText: {
    marginLeft: 15,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  email: {
    color: "gray",
  },
  sectionHeader: {
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default AllTutors;
