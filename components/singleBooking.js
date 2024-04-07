import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

/**
 * Renders a single booking for the user

 * @param booking a Tutor booking
 * @returns
 */
export default function SingleBooking({ booking }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.1 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {booking.tutorName.first} {booking.tutorName.last} - {booking.service}
        </Text>
      </View>
      <View
        style={{
          flex: 0.9,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <View style={{ flex: 0.4, justifyContent: "center" }}>
          <Image
            source={{ uri: booking.tutorPhoto }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        </View>
        <View style={{ flex: 0.4, justifyContent: "center" }}>
          <Text>
            <Text style={styles.infoTitle}>Status:</Text>{" "}
            {booking.bookingStatus}
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Hours:</Text> {booking.hours}
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Remote:</Text>{" "}
            {booking.remote ? "Yes" : "No"}
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Date:</Text> {booking.timeSlot.date}
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Time:</Text> {booking.timeSlot.from}{" "}
            to {booking.timeSlot.to}
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Total paid:</Text> {booking.total}$
          </Text>
          <Text>
            <Text style={styles.infoTitle}>Code:</Text> {booking.id}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    fontWeight: "bold",
  },
});
