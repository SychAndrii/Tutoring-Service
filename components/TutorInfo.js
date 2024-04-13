import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebaseConfig";
import {
  updateDoc,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

import * as Location from "expo-location";

/**
 *
 * @param {*} time time in HH:MM format
 * @param {*} hours integer dictating number of hours to increase from given time
 * @returns time + hours in time HH:MM format
 */
function incrementTime(time, hours) {
  let [hour, minute] = time.split(":").map(Number);
  hour += hours; // Increment the hour

  // Adjust for day rollover
  if (hour >= 24) {
    hour -= 24;
  }

  // Ensure two-digit formatting
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

/**
 *
 * @param {*} tutor tutors information
 * @param {*} setTutorInfo function to set the tutor information
 * @param {*} userData logged in tutee's data
 * @param {*} updateUserData function to update the logged in tutee's data
 */
export default function TutorInfo({
  tutor,
  setTutorInfo,
  userData,
  updateUserData,
}) {
  if (!tutor) {
    return null;
  }

  const [infoMode, setInfoMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("1");
  const [remote, setRemote] = useState("No");
  const [address, setAddress] = useState("");

  async function translateAddress(location) {
    try {
      // create the coordinates object
      const coords = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      // returns an array of LocationGeocodedAddress objects
      const postalAddresses = await Location.reverseGeocodeAsync(coords, {});
      const result = postalAddresses[0];

      console.log(`Street: ${result.street}`);
      console.log(`City: ${result.city}`);
      console.log(`Province/State: ${result.region}`);
      console.log(`Country: ${result.country}`);

      const outputString = `${result.city}, ${result.region}, ${result.country}`;
      setAddress(outputString);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (tutor && tutor.location) {
      translateAddress(tutor.location);
    }
  }, [tutor]);

  /**
   * Simple constructing function to create a booking object for the tutee
   *
   * @returns object containing booking information for the tutee
   */
  const constructTuteeBooking = (code) => {
    return {
      bookingStatus: "CONFIRMED",
      hours: parseInt(hours),
      id: code,
      remote: remote == "Yes" ? true : false,
      service:
        selectedLanguage.length > 0 ? selectedLanguage : tutor.technologies[0],
      timeSlot: {
        date: date,
        from: time,
        to: incrementTime(time, parseInt(hours)),
      },
      total: parseInt(hours) * tutor.fee,
      tutorEmail: tutor.email,
      tutorName: {
        first: tutor.name.first,
        last: tutor.name.last,
      },
      tutorPhoto: tutor.photo,
    };
  };

  /**
   * Simple constructing function to create a booking object for the tutor
   *
   * @returns object containing booking information for the tutor
   */
  const constructTutorBooking = (code) => {
    return {
      bookingStatus: "CONFIRMED",
      id: code,
      customerEmail: userData.email,
      customerName: {
        first: userData.name.first,
        last: userData.name.last,
      },
      customerPhoto: userData.photo,
      hours: parseInt(hours),
      remote: remote == "Yes" ? true : false,
      service:
        selectedLanguage.length > 0 ? selectedLanguage : tutor.technologies[0],
      timeSlot: {
        date: date,
        from: time,
        to: incrementTime(time, parseInt(hours)),
      },
      total: parseInt(hours) * tutor.fee,
    };
  };

  /**
   * Validates the date from UI input if it is in the correct format and is a future date
   *
   * Format: MM-DD-YYYY
   *
   * Throws an error if the date is not in the correct format or is in the past
   */
  const validateDate = () => {
    // Regex to check for MM-DD-YYYY format where all parts are numeric
    const isValidFormat = /^\d{2}-\d{2}-\d{4}$/.test(date);

    if (!isValidFormat) {
      setTime("");
      throw new Error(
        "Date must be in MM-DD-YYYY format with all numeric values."
      );
    } else {
      const [month, day, year] = date.split("-").map(Number);
      const now = new Date();
      const inputDate = new Date(year, month - 1, day);

      if (month < 1 || month > 12 || day < 1 || day > 31 || inputDate < now) {
        setTime("");
        throw new Error(
          "Invalid Date format, date cannot be today or in the past."
        );
      }
    }
  };

  /**
   * Validates the time from UI input if it is in the correct format
   *
   * Format: MM-HH
   *
   * Throws an error if the time is not in the correct format
   */
  const validateTime = () => {
    // Regex to check for HH:MM format where both parts are numeric
    const isValidFormat = /^\d{2}:\d{2}$/.test(time);

    if (!isValidFormat) {
      setTime("");
      throw new Error("Time must be in HH:MM format with all numeric values.");
    }
  };

  /**
   * Updates local states with updated information for tutor and tutee
   *
   * Updates tutee and tutor booking data in the database
   *
   * Closes the tutor popup once done.
   */
  const bookSession = useCallback(async () => {
    try {
      validateDate();
      validateTime();

      const code = Math.floor(Math.random() * (99999 - 1000) + 1000);

      const tuteebooking = constructTuteeBooking(code);

      const tutorbooking = constructTutorBooking(code);

      let updatedUserInfo = { ...userData };
      let updatedTutorInfo = { ...tutor };

      updatedUserInfo.bookings.push(tuteebooking);
      //tuteebooking;

      updatedTutorInfo.bookings.push(tutorbooking);

      const tuteesCollection = collection(db, "tutees");
      const tutorsCollection = collection(db, "tutors");

      const tutees_q = query(
        tuteesCollection,
        where("email", "==", userData.email)
      );
      const tutors_q = query(
        tutorsCollection,
        where("email", "==", tutor.email)
      );

      const tuteesSnapshot = await getDocs(tutees_q);
      const tutorsSnapshot = await getDocs(tutors_q);

      if (!tuteesSnapshot.empty && !tutorsSnapshot.empty) {
        const tuteeToUpdate = tuteesSnapshot.docs[0].ref;
        await updateDoc(tuteeToUpdate, updatedUserInfo);

        const tutorToUpdate = tutorsSnapshot.docs[0].ref;
        await updateDoc(tutorToUpdate, updatedTutorInfo);

        updateUserData(updatedUserInfo);
        alert(
          `Booked session with ${tutor.name.first} ${tutor.name.last}. Await confirmation.`
        );
        setTutorInfo(null);
      } else {
        alert("Error updating user information.");
      }

      console.log(updatedUserInfo);
    } catch (err) {
      alert(err);
    }
  }, [date, time, hours, remote, userData, tutor]);

  return (
    <View style={styles.customView}>
      {infoMode && (
        <View
          style={{
            flex: 0.6,
            paddingRight: 20,
            justifyContent: "space-evenly",
          }}
        >
          <Text>
            <Text style={{ fontWeight: "bold" }}>Tutor Name: </Text>
            {tutor.name.first} {tutor.name.last}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>School: </Text>
            {tutor.schoolName}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Tutor Fee: </Text>${tutor.fee}
            /hr
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Tutor Address: </Text>
            {address}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Tutor Experience: </Text>
            {tutor.experience} years
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Info: </Text>
            {tutor.description}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Remote: </Text>
            {tutor.remote ? "Yes" : "No"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Languages: </Text>
            {tutor.technologies.join(", ")}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Portfolio: </Text>
            {tutor.portfolio.join(", ")}
          </Text>
        </View>
      )}
      {!infoMode && (
        <View
          style={{
            flex: 0.6,
            paddingRight: 20,
            justifyContent: "space-evenly",
            alignContent: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Choose a language
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                width: "80%",
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
              >
                {tutor.technologies.map((tech) => (
                  <Picker.Item label={tech} value={tech} key={tech} />
                ))}
              </Picker>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Date</Text>

              <TextInput
                style={[
                  styles.dateinput,
                  { width: "100%", borderWidth: 1, borderRadius: 5 },
                ]}
                onChangeText={setDate}
                value={date}
                placeholder="MM-DD-YYYY"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Time</Text>

              <TextInput
                style={[
                  styles.dateinput,
                  { width: "100%", borderWidth: 1, borderRadius: 5 },
                ]}
                onChangeText={setTime}
                value={time}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Hours
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "52%",
                  justifyContent: "center",
                }}
              >
                <Picker
                  selectedValue={hours}
                  onValueChange={(itemValue) => setHours(itemValue)}
                >
                  <Picker.Item label={"1"} value={"1"} key={"1h"} />
                  <Picker.Item label={"2"} value={"2"} key={"2h"} />
                </Picker>
              </View>
            </View>
            {tutor.remote == true && (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Remote
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    width: "52%",
                    justifyContent: "center",
                  }}
                >
                  <Picker
                    selectedValue={remote}
                    onValueChange={(itemValue) => setRemote(itemValue)}
                  >
                    <Picker.Item label={"Yes"} value={"Yes"} key={"Yes"} />
                    <Picker.Item label={"No"} value={"No"} key={"No"} />
                  </Picker>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
      <View
        style={{
          flex: 0.4,
          justifyContent: "space-evenly",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: tutor.photo }}
          style={{ width: 150, height: 150, borderRadius: 75 }}
        />
        <Pressable
          style={styles.pressableButton}
          onPress={() => {
            setInfoMode(!infoMode);
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            {infoMode ? "Book" : "Info"}
          </Text>
        </Pressable>
        {!infoMode && (
          <Pressable style={styles.pressableButton} onPress={bookSession}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              Confirm
            </Text>
          </Pressable>
        )}
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            setTutorInfo(null);
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Close
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableButton: {
    backgroundColor: "royalblue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "75%",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "75%",
  },
  customView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    padding: 20,
    borderTopColor: "royalblue",
    borderTopWidth: 4,
  },
  dateinput: {
    height: 40,
    padding: 10,
  },
});
