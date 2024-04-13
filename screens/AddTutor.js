import React from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import Input from "../components/Input";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const AddTutor = ({onTutorAdded}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [tech, setTech] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [location, setLocation] = useState(null);

  const isRemoteToggler = () => {
    setLocation(location === null ? "" : null);
  };

  const requestPermissions = async () => {
    try {
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();
      if (permissionsObject.status === "granted") {
        alert("Permission granted!");
      } else {
        alert("Permission denied or not provided");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const doFwdGeocode = async (addressFromUI) => {
    console.log(`Geocoding the address ${addressFromUI}`);
    try {
      const geocodedLocation = await Location.geocodeAsync(addressFromUI);
      console.log(geocodedLocation); // array of possible locations

      const result = geocodedLocation[0];
      if (result === undefined) {
        alert("No coordinates found");
        return;
      }

      console.log(result);
      console.log(`Latitude: ${result.latitude}`);
      console.log(`Longitude: ${result.longitude}`);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const validateInputs = () => {
    if (!name.includes(" ")) {
      alert("Please enter both first and last name.");
      return false;
    }
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return false;
    }
    if (
      isNaN(experience) ||
      experience.trim() === "" ||
      parseInt(experience) <= 0
    ) {
      alert("Experience must be a positive number.");
      return false;
    }
    if (isNaN(price) || price.trim() === "" || parseFloat(price) <= 0) {
      alert("Fee must be a positive number.");
      return false;
    }
    if (photo.trim() === "") {
      alert("Please enter a valid URL for the tutor photo.");
      return false;
    }
    if (tech.trim() === "" || tech.split(",").length === 0) {
      alert("Please enter at least one technology, separated by commas.");
      return false;
    }
    if (portfolio.trim() === "" || portfolio.split(",").length === 0) {
      alert("Please enter at least one portfolio item, separated by commas.");
      return false;
    }
    if (!location && !isRemoteToggler) {
      alert("Please specify a location or set as remote.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (validateInputs()) {
      const splitName = name.split(" ");
      let locationData = null;

      // Check if the location needs to be remote or geocoded
      if (location) {
        // Assuming `isRemoteToggler` toggles a boolean state or similar
        const geoposition = await doFwdGeocode(location);
        if (geoposition) {
          locationData = {
            latitude: geoposition.latitude,
            longitude: geoposition.longitude,
          };
        } else {
          alert("Failed to get geoposition. Setting location as remote.");
          locationData = null;
        }
      }

      const formattedData = {
        name: {
          first: splitName[0],
          last: splitName[1],
        },
        email: email.trim(),
        description: desc.trim(),
        experience: parseInt(experience, 10),
        fee: parseFloat(price),
        photo: photo.trim(),
        portfolio: portfolio.split(",").map((item) => item.trim()),
        remote: locationData === null,
        technologies: tech.split(",").map((item) => item.trim()),
        location: locationData,
        bookings: []
      };
      onTutorAdded(formattedData)
    } else {
      console.log("Some inputs are invalid!");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inputContainer}>
        <Input
          text={name}
          setText={setName}
          clue={"e.g. John Smith"}
          label={<Text style={styles.label}>Name</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={email}
          setText={setEmail}
          clue={"e.g. john.smith@myseneca.ca"}
          label={<Text style={styles.label}>Email</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={desc}
          setText={setDesc}
          clue={"e.g. I provide lessons in Web Technologies."}
          label={<Text style={styles.label}>Description</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={tech}
          setText={setTech}
          clue={"Separated by comma (no spaces) e.g. C#,PHP,C++"}
          label={<Text style={styles.label}>Technologies</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={portfolio}
          setText={setPortfolio}
          clue={"Separated by comma (no spaces) e.g. TodoListApp"}
          label={<Text style={styles.label}>Portfolio</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={experience}
          setText={setExperience}
          clue={"e.g. 3"}
          label={<Text style={styles.label}>Years of experience</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={photo}
          setText={setPhoto}
          clue={"e.g. https://upload.wikimedia.org/wikipedia..."}
          label={<Text style={styles.label}>Tutor photo</Text>}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          text={price}
          setText={setPrice}
          clue={"e.g. 20.0"}
          label={<Text style={styles.label}>Fee per hour</Text>}
        />
      </View>
      <View style={[styles.inputContainer, { marginBottom: 20 }]}>
        <Input
          text={location}
          setText={setLocation}
          clue={"e.g. 1760 Finch Ave East, Toronto, Ontario, Canada"}
          label={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.label}>Location</Text>
              <Pressable
                onPress={isRemoteToggler}
                style={{
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: location === null ? "green" : "white",
                }}
              >
                <Text>{location === null ? "Remote" : "Set Location"}</Text>
              </Pressable>
            </View>
          }
        />
      </View>
      <Pressable style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 10, // Apply vertical spacing here
  },
  label: {
    fontWeight: "700",
    fontSize: 20,
  },
  submitButton: {
    borderWidth: 1,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
  },
});

export default AddTutor;
