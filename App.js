import { StyleSheet, View } from "react-native";
import AddTutor from "./screens/AddTutor";
import AllTutors from "./screens/AllTutors";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import AuthGuard from "./auth/AuthGuard";
import { db } from "./firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc
} from "firebase/firestore";
import AllBookings from "./screens/AllBookings";

const fetchSchool = async (email) => {
  const docRef = doc(db, "schools", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // handle the case where there is no document with the given ID
    console.log("No such document!");
    return null;
  }
};

const fetchSchoolTutors = async (schoolName) => {
  const tutorsRef = collection(db, "tutors");
  const q = query(tutorsRef, where("schoolName", "==", schoolName));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } else {
    // handle the case where the query found no documents
    console.log("No matching documents.");
    return [];
  }
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [tutors, setTutors] = useState([]);
  const [school, setSchool] = useState(null);

  const onLoggedIn = async (user) => {
    const s = await fetchSchool(user.email);
    setSchool(s.schoolName);
    const tutors = await fetchSchoolTutors(s.schoolName);
    setTutors(tutors);
  };

  const onAddedTutor = async (tutor) => {
    try {
      const tutorWithSchool = {
        ...tutor,
        schoolName: school,
      };

      console.log(tutorWithSchool);

      const docRef = await addDoc(collection(db, "tutors"), tutorWithSchool);
      console.log("Document written with ID: ", docRef.id);
      setTutors((prevTutors) => [
        ...prevTutors,
        { ...tutorWithSchool, id: docRef.id },
      ]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onBookingCancelled = async (tutorId, bookingId, newStatus) => {
    const tutorRef = doc(db, "tutors", tutorId);
  
    try {
      // Fetch the current document
      const docSnap = await getDoc(tutorRef);
  
      if (docSnap.exists()) {
        // Get the current data
        const tutorData = docSnap.data();
        const bookings = tutorData.bookings;
  
        // Map through the bookings and update the status of the target booking
        const updatedBookings = bookings.map((booking) => {
          if (booking.id === bookingId) {
            return { ...booking, bookingStatus: newStatus };
          }
          return booking;
        });
  
        // Update the document with the new bookings array
        await updateDoc(tutorRef, {
          bookings: updatedBookings,
        });
  
        console.log("Booking status updated successfully!");
  
        // Update local state
        setTutors((prevTutors) => prevTutors.map(tutor => {
          if (tutor.id === tutorId) {
            return { ...tutor, bookings: updatedBookings };
          }
          return tutor;
        }));
  
      } else {
        console.log("No tutor found with the given ID.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <AuthGuard onLoggedIn={onLoggedIn}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Tutors">
            <Tab.Screen name="Tutors">
              {() => <AllTutors tutors={tutors} />}
            </Tab.Screen>
            <Tab.Screen name="Add Tutor">
              {() => <AddTutor onTutorAdded={onAddedTutor} />}
            </Tab.Screen>
            <Tab.Screen name="Bookings">
              {() => <AllBookings tutors={tutors} onBookingCancelled={onBookingCancelled} />}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </AuthGuard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
