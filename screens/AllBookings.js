import React from "react";
import { View, Text, StyleSheet, FlatList, Image, Button, Alert } from "react-native";

// Individual booking item
const BookingItem = ({ booking, onCancel }) => (
  <View style={styles.bookingItem}>
    <View style={styles.userSection}>
      <Image source={{ uri: booking.customerPhoto }} style={styles.photo} />
      <Text style={styles.name}>{booking.customerName.first} {booking.customerName.last}</Text>
    </View>
    <Text>Service: {booking.service}</Text>
    <Text>Status: {booking.bookingStatus}</Text>
    <Text>Confirmation Code: {booking.id}</Text>
    <Text>Total Cost: ${booking.total}</Text>
    {booking.bookingStatus !== 'CANCELED' && (
      <Button
        title="Cancel Booking"
        onPress={() => onCancel(booking.id)}
        color="#FF6347"
      />
    )}
  </View>
);

// Displays all bookings for a single tutor
const TutorBookings = ({ tutor }) => (
  <View style={styles.tutorBookings}>
    <Text style={styles.tutorName}>{tutor.name.first} {tutor.name.last}'s Bookings</Text>
    <FlatList
      data={tutor.bookings}
      renderItem={({ item }) => <BookingItem booking={item} onCancel={() => console.log("Cancel function to implement")} />}
      keyExtractor={(item, index) => item.id}
      ListHeaderComponent={() => <Text style={styles.sectionHeader}>Bookings:</Text>}
    />
  </View>
);

// Manages bookings across all tutors
const ManageBookings = ({ tutors }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tutors.filter(t => t.bookings.length > 0)}
        renderItem={({ item }) => <TutorBookings tutor={item} />}
        keyExtractor={(item, index) => item.id}
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
  tutorBookings: {
    marginBottom: 20,
  },
  bookingItem: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tutorName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default ManageBookings;
