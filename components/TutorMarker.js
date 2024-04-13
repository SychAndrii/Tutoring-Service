import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { useIsFocused } from "@react-navigation/native";

export default function TutorMarker({ tutor, setTutorInfo }) {
  const [location, setLocation] = useState(null);
  const isFocused = useIsFocused();

  const showTutor = () => {
    setTutorInfo(tutor);
  };

  const translateAddress = async () => {
    setLocation(tutor.location);
    console.log("Tutor Address: ", tutor.location);
  };

  useEffect(() => {
    if (isFocused === true && tutor && tutor.location) {
      translateAddress();
    }
  }, [isFocused]);

  return (
    <View>
      {location && location.longitude && location.latitude && (
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
