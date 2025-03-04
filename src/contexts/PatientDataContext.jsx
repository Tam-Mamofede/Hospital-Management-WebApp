/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { db } from "../../firebase.config";
import { schema } from "../utils/patientSchema";
import { useForm } from "react-hook-form";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { debounce } from "lodash";
import { useAlert } from "./AlertContext";
import { useAuth } from "./AuthContext";

const PatientDataContext = createContext();

function PatientDataProvider({ children }) {
  const [formState, setFormState] = useState({
    patFirstName: "",
    patLastName: "",
    patDOB: null,
    patAge: "",
    patGender: "",
    patAddress: "",
    patEmail: "",
    patMaritalStatus: "",
    patOccupation: "",
    patPhone: 0,
    patAllergies: "",
    patBloodGroup: "",
    patMedicalHistory: "",
    patCurrentMeds: "",
    emergencyContactName: "",
    emergencyContactNumber: 0,
    patFatherName: "",
    patMotherName: "",
    patStatus: "",
    primaryDoc: "",
    emergency: "",
    healthIns: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patList, setPatList] = useState([]);
  const [currentPat, setCurrentPat] = useState("");
  const [editingField, setEditingField] = useState({});
  const [patDocId, setPatDocId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patStats, setPatStats] = useState("");
  const [billing, setBilling] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { setIsLoading, currentStaff } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  //////////////////////////////////////////

  const searchedPatients = useMemo(() => {
    return patList.filter((patient) =>
      `${patient.patFirstName} ${patient.patLastName} ${patient.id}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [patList, searchQuery]);
  ///////////////////////////////

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query);
      }, 300),
    [],
  );

  const filteredPatients = patList.filter((p) => p.patLastName === currentPat);

  ////////////////////////////////////////////////

  function calculateAge(dateOfBirth) {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (e) {
      console.error("Error calculating age:", e);
      showAlert("Could not calculate age", "error");
    }
  }

  ///////////////////////////////////////

  const toggleEdit = (id, field) => {
    setEditingField((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: !prev[id]?.[field] },
    }));
  };

  ///////////////////////////////////////

  const handleInputChange = (id, field, value) => {
    setEditingField((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  ////////////////////////////////
  const handleSetCurrentPat = (e) => {
    setIsLoading(true);
    try {
      const selectedPat = e.target.value;
      setCurrentPat(selectedPat);
    } catch (err) {
      console.error("Error setting current patient:", err);
      showAlert("Could not open patient file.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////////
  const handleNavPats = () => {
    setIsLoading(true);
    try {
      navigate("/patients");
    } catch (e) {
      console.error("Error navigating to patients:", e);
      showAlert(
        "An error occurred while navigating to patients page.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  ////////////////////////////////////////
  const handleAddPat = () => {
    setIsLoading(true);

    try {
      navigate("/patient-reg");
    } catch (error) {
      console.error("Error navigating to patient registration:", error);
      showAlert(
        "An error occurred while navigating to patient registration.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  ////////////////////////////////////////////////////

  const updatePatientField = async (docId, field, value) => {
    const patientDocRef = doc(db, "hospital/Hospital info/Patients", docId);

    setIsLoading(true);

    try {
      await updateDoc(patientDocRef, { [field]: value });
      alert(`Field "${field}" updated successfully!`);

      setEditingField((prev) => ({
        ...prev,
        [docId]: { ...prev[docId], [field]: false },
      }));
    } catch (error) {
      console.error("Error updating field:", error);
      showAlert("An error occurred while updating the patient file.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  ////////////////////////////////////////////////////

  const submitData = async (data) => {
    data.patAge = calculateAge(data.patDOB);

    if (!data.patDOB) {
      showAlert("Date of Birth is required.", "warning");
      return;
    }

    if (!data.patAge || isNaN(data.patAge) || data.patAge < 0) {
      showAlert("Invalid Date of Birth.", "warning");
      return;
    }

    if (isNaN(Number(data.patPhone))) {
      showAlert("Invalid phone number.", "warning");
      return;
    }

    if (isNaN(Number(data.emergencyContactNumber))) {
      showAlert("Invalid emergency contact number.", "warning");
      return;
    }

    data.patPhone = Number(data.patPhone);
    data.emergencyContactNumber = Number(data.emergencyContactNumber);

    try {
      const hospitalRef = doc(db, "hospital", "Hospital info");
      const patientColRef = collection(hospitalRef, "Patients");
      const counterDocRef = doc(db, "Counters", "patientIdCounter");

      const emailQuery = query(
        patientColRef,
        where("patEmail", "==", data.patEmail),
      );
      const patientSnapshot = await getDocs(emailQuery);

      if (!patientSnapshot.empty) {
        console.log("⚠️ Patient already registered.");
        showAlert("This patient has already been registered.", "info");
        return;
      }

      const counterSnapshot = await getDoc(counterDocRef);
      let currentId = counterSnapshot.exists()
        ? counterSnapshot.data().currentId + 1
        : 1;

      const patientDocId = `${data.patLastName}_${currentId}`;

      await setDoc(doc(patientColRef, patientDocId), {
        ...data,
        id: currentId,
        patientId: patientDocId,
        createdAt: serverTimestamp(),
      });

      await setDoc(counterDocRef, { currentId });

      setIsSubmitted(true);
      showAlert("Patient data submitted successfully!");
      navigate("/patients");
    } catch (err) {
      console.error("🔥 Error submitting data:", err);
      showAlert("An error occurred while submitting the form.", "error");
    }
  };

  const fetchAppointments = (patientId) => {
    if (!patientId) {
      console.error("fetchAppointments: patientId is required.");
      return;
    }

    setIsLoading(true);

    try {
      const appointmentsRef = collection(
        db,
        `hospital/Hospital info/Patients/${patientId}/Appointments`,
      );

      const unsubscribe = onSnapshot(
        appointmentsRef,
        (snapshot) => {
          if (snapshot.empty) {
            setAppointments([]);
          } else {
            const newAppointments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setAppointments((prev) =>
              JSON.stringify(prev) !== JSON.stringify(newAppointments)
                ? newAppointments
                : prev,
            );
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching appointments:", error);
          showAlert("An error occurred while fetching appointments.", "error");
          setIsLoading(false);
        },
      );

      return unsubscribe;
    } catch (e) {
      console.error("Error fetching appointments:", e);
      showAlert("An error occurred while fetching appointments.", "error");
      setIsLoading(false);
    }
  };

  //////////////////////////////////////////////////////////

  useEffect(() => {
    if (!currentPat) return;

    const selectedPatient = patList.find((p) => p.patLastName === currentPat);
    if (selectedPatient) {
      setPatDocId(selectedPatient.patientId);
      setPatStats(selectedPatient.patStatus);

      fetchAppointments(selectedPatient.patientId);
    } else {
      console.warn("Patient not found:", currentPat);
    }
  }, [currentPat, patList]);

  //////////////////////////////////////////////////

  //Fetch PatList
  useEffect(() => {
    const hospitalRef = doc(db, "hospital", "Hospital info");
    const patientColRef = collection(hospitalRef, "Patients");
    const unsubscribe = onSnapshot(patientColRef, (snapshot) => {
      const patients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatList(patients);
    });

    return () => unsubscribe();
  }, [setPatList, currentStaff, currentPat]);

  /////////////////////////////////////////////

  useEffect(() => {
    if (formState.patDOB) {
      const age = calculateAge(formState.patDOB);
      setFormState((prev) => ({ ...prev, patAge: age }));
    }
  }, [formState.patDOB]);

  /////////////////////////////////////////

  useEffect(() => {
    if (patList.length === 0 || !currentPat) return; // Prevent running when data is not ready

    const patient = patList.find((pat) => pat.patLastName === currentPat);

    if (patient) {
      setPatDocId(patient.patientId);
      console.log("Setting patDocId:", patient.patientId);
    } else {
      console.error("Patient not found:", currentPat);
    }
  }, [patList, currentPat]);

  ///////////////////////////////////////////////

  return (
    <PatientDataContext.Provider
      value={{
        submitData,
        calculateAge,
        register,
        handleSubmit,
        errors,
        formState,
        setFormState,
        isSubmitted,
        patList,
        setIsSubmitted,
        currentPat,
        setCurrentPat,
        updatePatientField,
        editingField,
        setEditingField,
        toggleEdit,
        handleInputChange,
        handleSetCurrentPat,
        handleNavPats,
        handleAddPat,
        patDocId,
        patStats,
        setSearchQuery,
        filteredPatients,
        searchedPatients,
        appointments,
        setAppointments,
        billing,
        debouncedSearch,
        setBilling,
        invoiceData,
        setInvoiceData,
      }}
    >
      {children}
    </PatientDataContext.Provider>
  );
}

function usePatientData() {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error("usePatientData was used outside PatientDataProvider");
  }
  return context;
}

export { PatientDataProvider, usePatientData };
