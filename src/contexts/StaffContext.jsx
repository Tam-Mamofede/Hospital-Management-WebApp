/* eslint-disable react/prop-types */
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { useAuth } from "./AuthContext";
import { usePatientData } from "./PatientDataContext";
import { useAlert } from "./AlertContext";

const StaffContext = createContext();

function StaffProvider({ children }) {
  const { currentPat } = usePatientData();
  const { currentStaff, isAuthenticated, setIsLoading } = useAuth();
  const { showAlert } = useAlert();

  const [docList, setDocList] = useState([]);
  const [staffList, setStaffLIst] = useState([]);
  const [showConNotes, setShowConNotes] = useState(false);
  const [allowEditConNotes, setAllowEditConNotes] = useState(false);
  const [openPatDD, setOpenPatDD] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [editingField, setEditingField] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filterRole, setFilterRole] = useState("");

  ///////////////////////////////////////////////////////

  const toggleShowPatList = () => {
    openPatDD ? setOpenPatDD(false) : setOpenPatDD(true);
  };

  ///////////////////////////////////////////////

  const toggleConNotes = () => {
    setShowConNotes(!showConNotes);
    handleDisplayConNotes();
  };

  ///////////////////////////////////////////////

  const handleDisplayConNotes = async () => {
    if (!currentPat) {
      console.error("Current patient is not set or is empty.");
      return;
    }

    if (!currentStaff || !currentStaff.staffLastName) {
      console.error("Current staff information is not available.");
      return;
    }

    setIsLoading(true);

    try {
      const hospitalRef = doc(db, "hospital", "Hospital info");
      const patientColRef = collection(hospitalRef, "Patients");
      const allPatSnapshot = await getDocs(patientColRef);

      const patients = allPatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const patient = patients.find((pat) => pat.patLastName === currentPat);

      if (!patient) {
        console.error("Patient not found for currentPat:", currentPat);
        return;
      }

      const patientId = `${patient.patLastName}_${patient.id}`;
      const patDocRef = doc(patientColRef, patientId);
      const appColRef = collection(patDocRef, "Appointments");

      const docQuery = query(
        appColRef,
        where("doctor", "==", currentStaff.staffLastName),
      );

      const querySnapshot = await getDocs(docQuery);

      if (!querySnapshot.empty) {
        setAllowEditConNotes(true);
      } else {
        console.log("No matching appointments found for the current doctor.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  ///////////////////////////////////

  // Handle edit start
  const handleEdit = (staffId, field, value) => {
    setEditingField({ staffId, field });
    setInputValue(value);
  };

  ///////////////////////////////////

  // Handle save
  const handleSave = async (staffId) => {
    if (!editingField || !editingField.field) return;

    const staffRef = doc(db, "hospital", "Hospital info", "Staff", staffId);

    setIsLoading(true);

    try {
      await updateDoc(staffRef, { [editingField.field]: inputValue });
      setEditingField({});
    } catch (err) {
      console.error("Error updating field:", err);
      showAlert("Failed to update field.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////

  useEffect(() => {
    const fetchDocList = async () => {
      try {
        const hospitalRef = doc(db, "hospital", "Hospital info");
        const staffColRef = collection(hospitalRef, "Staff");

        const doctorQuery = query(staffColRef, where("role", "==", "Doctor"));
        const allDocSnapshot = await getDocs(doctorQuery);

        const doctors = allDocSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocList(doctors);
      } catch (err) {
        console.error("Error fetching doctor list:", err);
      }
    };

    fetchDocList();
  }, [currentStaff, isAuthenticated]);

  ///////////////////////////////////

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const hospitalRef = doc(db, "hospital", "Hospital info");
        const staffColRef = collection(hospitalRef, "Staff");
        const allStaffSnapshot = await getDocs(staffColRef);

        const staff = allStaffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffLIst(staff);
        setFilteredStaff(staff);
      } catch (err) {
        console.error(err);
        console.error("Error fetching staff list:", err);
      }
    };
    fetchStaffList();
  });

  ///////////////////////////////////

  return (
    <StaffContext.Provider
      value={{
        docList,
        handleDisplayConNotes,
        allowEditConNotes,
        showConNotes,
        toggleShowPatList,
        openPatDD,
        setOpenPatDD,
        toggleConNotes,
        staffList,
        editingId,
        setEditingId,
        handleSave,
        handleEdit,
        editingField,
        inputValue,
        editedValue,
        setEditedValue,
        setInputValue,
        filteredStaff,
        setFilteredStaff,
        filterRole,
        setFilterRole,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}
function useStaffData() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("usePatientData was used outside PatientDataProvider");
  }
  return context;
}

export { StaffProvider, useStaffData };
