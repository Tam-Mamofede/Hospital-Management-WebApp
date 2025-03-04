/* eslint-disable react/prop-types */
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { db } from "../../firebase.config";
import { useForm } from "react-hook-form";
import { useAlert } from "./AlertContext";
import { useAuth } from "./AuthContext";

const NurseContext = createContext();

function NurseProvider({ children }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const [patVitals, setPatVitals] = useState([]);
  const [formState, setFormState] = useState({
    patTemp: "",
    patHeight: "",
    patWeight: "",
    patPulse: "",
    patHeartRate: "",
    patBloodPressure: "",
  });

  const { register, handleSubmit } = useForm();
  const { showAlert } = useAlert();
  const { setIsLoading } = useAuth();

  ////////////////////////////////////////////////////

  const addVitals = async (data, patientId) => {
    if (!patientId) {
      console.error("Error: patientId is undefined in addVitals");
      showAlert("Couldn't fin this patient", "error");
      return;
    }

    setIsLoading(true);

    try {
      const patientDocRef = doc(
        db,
        "hospital/Hospital info/Patients",
        patientId,
      );
      const notesColRef = collection(patientDocRef, "Vitals");
      const newDocRef = await addDoc(notesColRef, {});

      await updateDoc(newDocRef, {
        ...data,
        id: newDocRef.id,
        patientId,
        date: today,
      });

      showAlert("Vitals added successfully", "success");
    } catch (err) {
      console.error("Firebase Error:", err);
      showAlert("Error adding vitals", "error");
    } finally {
      setIsLoading(false);
    }
  };

  ////////////////////////////////////////////////////

  const fetchVitals = (patientId) => {
    const patientDocRef = doc(db, "hospital/Hospital info/Patients", patientId);
    const vitalsColRef = collection(patientDocRef, "Vitals");

    const vitalsDocQuery = query(vitalsColRef, where("date", "==", today));
    const unsubscribe = onSnapshot(vitalsDocQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatVitals(data);
    });
    return () => unsubscribe();
  };

  return (
    <NurseContext.Provider
      value={{
        addVitals,
        register,
        handleSubmit,
        formState,
        setFormState,
        fetchVitals,
        patVitals,
        today,
      }}
    >
      {children}
    </NurseContext.Provider>
  );
}

function useNurseData() {
  const context = useContext(NurseContext);
  if (context === undefined) {
    throw new Error("useNurseData was used outside NurseProvider");
  }
  return context;
}

export { NurseProvider, useNurseData };
