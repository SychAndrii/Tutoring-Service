import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { getDocs, collection, where, query } from "firebase/firestore";
import MapView from "react-native-maps";
import TutorMarker from "../components/TutorMarker";
import * as Location from "expo-location";
import TutorInfo from "../components/TutorInfo";

export default function BrowseTutors({ userData, updateUserData }) {
  const [tutors, setTutors] = useState([]);
  const isFocused = useIsFocused();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [tutorInfo, setTutorInfo] = useState(null);
  const [currLocation, setLocation] = useState(null);

  // Request location permissions necessary in Android only
  const requestPermissions = async () => {
    try {
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();

      setPermissionGranted(permissionsObject.granted);
    } catch (err) {
      console.log(err);
    }
  };

  const retrieveLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log(`The current location is:`);
      console.log(location);

      setLocation(location);

      // alert(JSON.stringify(location))
    } catch (err) {
      console.log(err);
    }
  };

  // Retrieves all the tutors from the tutors collection
  const getAllTutors = async () => {
    const q = query(collection(db, "tutors"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => doc.data());
    setTutors(data);

    // console.log(data);
    // console.log("Retrieved Tutors");
  };

  useEffect(() => {
    if (isFocused === true && tutors) {
      getAllTutors();
      retrieveLocation();
    }

    if (!permissionGranted) {
      requestPermissions();
    }
  }, [isFocused]);

  return (
    <View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          // latitude: currLocation.coords.latitude,
          // longitude: currLocation.coords.longitude,
          latitude: 43.7076,
          longitude: -79.3924,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {tutors.map((tutor, index) => (
          <TutorMarker tutor={tutor} key={index} setTutorInfo={setTutorInfo} />
        ))}
      </MapView>

      <TutorInfo
        tutor={tutorInfo}
        setTutorInfo={setTutorInfo}
        userData={userData}
        updateUserData={updateUserData}
      />
    </View>
  );
}
