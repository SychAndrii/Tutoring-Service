import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import SingleBooking from "../components/singleBooking";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { getDocs, collection, where, query } from "firebase/firestore";

/**
 * User reservation screen
 *
 * @param userData the user's data from the database
 * @param updateUserData function that updates the user data state
 * @returns
 */
export default function Reservations({ userData, updateUserData }) {
  const [bookings, setBookings] = useState(userData.bookings);
  const isFocused = useIsFocused();

  const refreshData = async () => {
    const q = query(
      collection(db, "tutees"),
      where("email", "==", userData.email)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 1) {
      const data = querySnapshot.docs[0].data();
      setBookings(data.bookings);
      updateUserData(data);
      // console.log("Refreshed Data");
    }
  };

  useEffect(() => {
    if (isFocused === true && bookings) {
      refreshData();
    }
  }, [isFocused]);

  return (
    <>
      <FlatList
        style={{ marginTop: 20 }}
        data={bookings}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item }) => {
          return <SingleBooking booking={item} />;
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.separatorView}></View>;
        }}
      ></FlatList>
    </>
  );
}

const styles = StyleSheet.create({
  separatorView: {
    marginTop: 20,
    marginBottom: 20,
    height: 1,
    width: "100%",
    backgroundColor: "black",
  },
});
