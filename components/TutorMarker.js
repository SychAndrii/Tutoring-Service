import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { useIsFocused } from "@react-navigation/native";

import * as Location from "expo-location";

/**
 *
 * @param {*} address Human readable address ex: "125 Redpath Avenue, Toronto"
 * @returns object containing longitutde and latitude
 */
const forwardGeocode = async (address) => {
  try {
    const geocodedLocation = await Location.geocodeAsync(address);
    // console.log(geocodedLocation); // array of possible locations

    const result = geocodedLocation[0];
    if (result === undefined) {
      alert("No coordinates found");
      return;
    }

    // console.log(result);
    // console.log(`Latitude: ${result.latitude}`);
    // console.log(`Longitude: ${result.longitude}`);

    return result;
  } catch (err) {
    console.log(err);
  }
};

const constructAddress = (tutor) => {
  return `${tutor.location.address.streetNo} ${tutor.location.address.streetName}, ${tutor.location.city}`;
};

export default function TutorMarker({ tutor, setTutorInfo }) {
  const [location, setLocation] = useState(null);
  const isFocused = useIsFocused();

  const showTutor = () => {
    setTutorInfo(tutor);
  };

  const translateAddress = async () => {
    const address = constructAddress(tutor);
    const res = await forwardGeocode(address);
    setLocation(res);
    // console.log("Address: ", address);
    // console.log("Forward Geocoded: ", res);
  };

  useEffect(() => {
    if (isFocused === true && tutor && tutor.location) {
      translateAddress();
    }
  }, [isFocused]);

  return (
    <View>
      {location && (
        <>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={showTutor}
          >
            <View style={styles.MarkerDisplay}>
              <Text style={{ textAlign: "center" }}>${tutor.fee}/hr</Text>

              <Text style={{ textAlign: "center" }}>
                {tutor.name.first} {tutor.name.last}
              </Text>
            </View>
          </Marker>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  MarkerDisplay: {
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    padding: 5,
    borderColor: "royalblue",
  },
  customView: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white", // Choose a background color
  },
});
