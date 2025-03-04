/* eslint-disable react/prop-types */
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { useAuth } from "./AuthContext";
import { usePatientData } from "./PatientDataContext";
import { useAlert } from "./AlertContext";

const AppointmentContext = createContext();

function AppointmentProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [appList, setAppList] = useState([]);
  const [patWithApp, setPatWithApp] = useState("");

  const { showAlert } = useAlert();
  const { currentStaff, setIsLoading } = useAuth();
  const { patList } = usePatientData();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setMessage("");
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  //Submit Appointment
  const handleSubmit = async (e, patientId) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedDoctor) {
      showAlert("Please fill out all fields.", "warning");
      setIsLoading(false);
      return;
    }

    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
    const selected = new Date(selectedDate);
    if (selected < today) {
      showAlert("You cannot book an appointment for a past date.", "warning");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const newAppointment = {
        date: selectedDate,
        time: selectedTime,
        doctor: selectedDoctor,
        createdAt: new Date(),
        patientId,
      };

      const docRef = await addDoc(
        collection(
          doc(db, "hospital/Hospital info/Patients", patientId),
          "Appointments",
        ),
        newAppointment,
      );
      setAppList((prev) => [...prev, { id: docRef.id, ...newAppointment }]);
      showAlert("Your appointment has been booked successfully!", "success");
      setSelectedDate("");
      setSelectedTime("");
      setSelectedDoctor("");
    } catch (error) {
      console.error("Error booking appointment: ", error);
      showAlert("Failed to book appointment. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  ////////////////////////////////////////

  const getPatientNameById = (id) => {
    setIsLoading(true);
    try {
      const patient = patList.find((pat) => pat.patientId === id);

      return patient
        ? `${patient.patLastName} ${patient.patFirstName}`
        : "Unknown";
    } catch (err) {
      console.error("Error fetching patient name by Id:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientLastNameById = (id) => {
    setIsLoading(true);
    try {
      const patient = patList.find((pat) => pat.patientId === id);

      return patient ? patient.patLastName : "Unknown";
    } catch (err) {
      console.error("Error fetching patient last name by Id:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientById = (id) => {
    const patient = patList.find((pat) => pat.patientId === id);

    return patient || null;
  };

  // Generate available times
  const generateAvailableTimes = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (currentTime <= endTime) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      times.push(`${formattedHours}:${minutes} ${period}`);
      currentTime = new Date(currentTime.getTime() + 5 * 60000);
    }

    return times;
  };

  const availableTimes = generateAvailableTimes("09:00", "18:00");

  useEffect(() => {
    const fetchAllDocApps = async () => {
      if (!currentStaff?.staffLastName) {
        return;
      }
      setIsLoading(true);
      try {
        const patientsCollectionRef = collection(
          db,
          "hospital/Hospital info/Patients",
        );
        const patientsSnapshot = await getDocs(patientsCollectionRef);

        const patientDocs = patientsSnapshot.docs;
        const patientNames = [];

        const allAppsPromises = patientDocs.map(async (patientDoc) => {
          const pat = patientDoc.data();
          const patName = `${pat.patLastName} ${pat.patFirstName}`;
          const appsCollectionRef = collection(patientDoc.ref, "Appointments");

          const appQuery = query(
            appsCollectionRef,
            where("doctor", "==", currentStaff.staffLastName),
          );

          const appsSnapshot = await getDocs(appQuery);
          const patientApps = appsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (patientApps.length > 0) {
            patientNames.push(patName);
          }

          return patientApps;
        });

        const allAppsArray = await Promise.all(allAppsPromises);
        const allApps = allAppsArray.flat();

        setPatWithApp(patientNames);
        setAppList(allApps);
      } catch (err) {
        console.error("Error fetching doctor-specific appointments:", err);
        showAlert(
          `Could find appointments for Dr. ${currentStaff.staffLastName}.`,
          "info",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDocApps();
  }, [currentStaff, selectedDoctor]);

  return (
    <AppointmentContext.Provider
      value={{
        availableTimes,
        handleSubmit,
        handleTimeChange,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        message,
        setMessage,
        handleDateChange,
        setSelectedDoctor,
        selectedDoctor,
        appList,
        patWithApp,
        getPatientNameById,
        getPatientLastNameById,
        getPatientById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider",
    );
  }
  return context;
}

export { AppointmentProvider, useAppointment };
