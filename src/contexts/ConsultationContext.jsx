/* eslint-disable react/prop-types */
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { usePatientData } from "./PatientDataContext";
import { db } from "../../firebase.config";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";

const ConsultationContext = createContext();

function ConsultationProvider({ children }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const [editableData, setEditableData] = useState({});
  const [conNotes, setConNotes] = useState("");
  const [conPrescription, setConPrescription] = useState("");
  const [conTests, setConTests] = useState("");
  const [conProcedure, setConProcedure] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [patConsultation, setPatConsultation] = useState([]);

  const { currentPat, patDocId, setInvoiceData } = usePatientData();
  const { currentStaff, setIsLoading } = useAuth();
  const { showAlert } = useAlert();

  //////////////////////////////////////////////////

  const submitConNotes = async (docId) => {
    if (!currentPat) {
      return alert("No patient selected.");
    }
    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];

      const newConsultation = {
        attendingDoc: currentStaff?.staffLastName || "Unknown",
        notes: conNotes,
        prescription: conPrescription,
        tests: conTests,
        patientId: docId,
        procedure: conProcedure,
        date: currentDate,
      };

      if (conPrescription || conTests || conProcedure) {
        const items = [];

        if (conPrescription) {
          items.push({
            type: "Prescription",
            details: conPrescription,
          });
        }

        if (conTests) {
          items.push({
            type: "Tests",
            details: conTests,
          });
        }

        if (conProcedure) {
          items.push({
            type: "Procedure",
            details: conProcedure,
          });
        }

        setInvoiceData({
          patientName: `${docId.patLastName} ${docId.patFirstName}`,
          date: currentDate,
          doctor: currentStaff?.staffLastName || "Unknown",
          items: items,
        });
      }

      const patientDocRef = doc(db, "hospital/Hospital info/Patients", docId);
      const conNotesColRef = collection(patientDocRef, "Consultations");

      const newDocRef = await addDoc(conNotesColRef, {});
      await updateDoc(newDocRef, { ...newConsultation, id: newDocRef.id });

      setPatConsultation((prev) => [
        ...prev,
        { id: newDocRef.id, ...newConsultation },
      ]);
      showAlert("Consultation notes recorded successfully.", "success");
    } catch (err) {
      console.error("Error recording consultation notes:", err);
      showAlert(
        "Failed to record consultation notes. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patientId, consultationId, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [`${patientId}-${consultationId}`]: {
        ...prev[`${patientId}-${consultationId}`],
        [field]: value,
      },
    }));
  };

  const handleBlur = async (patientId, consultationId, field) => {
    const updatedValue =
      editableData[`${patientId}-${consultationId}`]?.[field];

    if (updatedValue !== undefined) {
      try {
        const consultationRef = doc(
          db,
          `hospital/Hospital info/Patients/${patientId}/Consultations/${consultationId}`,
        );

        await updateDoc(consultationRef, { [field]: updatedValue });

        setConsultations((prevConsultations) =>
          prevConsultations.map((consultation) =>
            consultation.id === consultationId &&
            consultation.patientId === patientId
              ? { ...consultation, [field]: updatedValue }
              : consultation,
          ),
        );
      } catch (error) {
        console.error("Error updating consultation:", error);
        showAlert("Failed to update consultation.", "error");
      }
    }
  };

  const fetchConsultations = async (docId) => {
    if (!docId) return;

    setIsLoading(true);
    try {
      const patientDocRef = doc(db, "hospital/Hospital info/Patients", docId);
      const conNotesColRef = collection(patientDocRef, "Consultations");
      const snapshot = await getDocs(conNotesColRef);

      if (!snapshot.empty) {
        const consultationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatConsultation(consultationsData);
      } else {
        console.log("No consultations found for patient:", docId);
        setPatConsultation([]);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
      showAlert("Failed to fetch consultations.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllConsultations = async () => {
    setIsLoading(true);
    try {
      const patientsCollectionRef = collection(
        db,
        "hospital/Hospital info/Patients",
      );
      const patientsSnapshot = await getDocs(patientsCollectionRef);

      const consultationsPromises = patientsSnapshot.docs.map(
        async (patientDoc) => {
          const patientId = patientDoc.id;
          const consultationsCollectionRef = collection(
            patientDoc.ref,
            "Consultations",
          );
          const consultationsSnapshot = await getDocs(
            consultationsCollectionRef,
          );

          return consultationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            patientId,
            ...doc.data(),
          }));
        },
      );

      const allConsultationsArray = await Promise.all(consultationsPromises);
      const allConsultations = allConsultationsArray.flat();

      setConsultations(allConsultations);
    } catch (err) {
      console.error("Error fetching all consultations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patDocId) {
      fetchConsultations(patDocId);
    } else {
      fetchAllConsultations();
    }
  }, [patDocId]);

  useEffect(() => {
    setEditableData({});
  }, [currentPat]);

  return (
    <ConsultationContext.Provider
      value={{
        submitConNotes,
        conNotes,
        setConNotes,
        conPrescription,
        setConPrescription,
        conTests,
        setConTests,
        consultations,
        fetchConsultations,
        fetchAllConsultations,
        conProcedure,
        setConProcedure,
        handleEdit,
        handleBlur,
        editableData,
        setEditableData,
        today,
        patConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error(
      "useConsultation must be used within a ConsultationProvider",
    );
  }
  return context;
}

export { ConsultationProvider, useConsultation };
