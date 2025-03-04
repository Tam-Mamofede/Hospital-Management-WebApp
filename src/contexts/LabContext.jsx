/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from "react";
import { db } from "../../firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";

const LabContext = createContext();

function LabProvider({ children }) {
  const inventoryRef = collection(db, "Tests List");

  const [testList, setTestList] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openResultInput, setOpenResultInput] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [salePrice, setSalePrice] = useState(0);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
  });
  const [testResults, setTestResults] = useState([
    { testName: "", testResult: "" },
  ]);
  const { curMonth, setCurMonth, setIsLoading } = useAuth();
  const { showAlert } = useAlert();
  //////////////////////////////////
  // INVENTORY
  const handleSelectItem = (id) => {
    if (!id) return;

    const existingItem = selectedItems.find((item) => item.id === id);
    if (existingItem) {
      return existingItem;
    }

    const newItem = items.find((item) => item.id === id);
    if (newItem) {
      setSelectedItems([...selectedItems, { ...newItem }]);
      return newItem;
    }
    return null;
  };

  ////////////////////////////////////////////////

  const handleAddMoreTestResult = () => {
    setTestResults([...testResults, { testName: "", testResult: "" }]);
  };
  // Handle changes in individual test result fields
  const handleTestChange = (index, field, value) => {
    const updatedTestResults = testResults.map((test, i) =>
      i === index ? { ...test, [field]: value } : test,
    );
    setTestResults(updatedTestResults);
  };

  // Handle form submission
  const handleSetTestResult = async (e, patientId, testsId) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const testsDocRef = doc(
        db,
        `hospital/Hospital info/Patients/${patientId}/Consultations/${testsId}`,
      );

      await updateDoc(testsDocRef, {
        testResults,
        completed: true,
        completedAt: new Date().toISOString(),
      });

      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === testsId && test.patientId === patientId
            ? {
                ...test,
                completed: true,
                completedAt: new Date().toISOString(),
              }
            : test,
        ),
      );

      showAlert("Test results added successfully.", "success");
    } catch (error) {
      console.error("Error adding test results:", error);
      showAlert("Failed to add test results.", "error");
    } finally {
      setIsLoading(false);
      setOpenResultInput(false);
    }
  };

  const handleCompleteTest = (test) => {
    setSelectedTest(test);
  };

  const completeTests = async (patientId, testsId) => {
    setIsLoading(true);
    try {
      const testsDocRef = doc(
        db,
        `hospital/Hospital info/Patients/${patientId}/Consultations/${testsId}`,
      );

      await updateDoc(testsDocRef, {
        fulfilled: true,
        fulfilledAt: new Date().toISOString(),
      });

      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === testsId && test.patientId === patientId
            ? {
                ...tests,
                completed: true,
                completedAt: new Date().toISOString(),
              }
            : tests,
        ),
      );

      showAlert("Prescription marked as fulfilled!", "success");
    } catch (error) {
      console.error("Error fulfilling prescription:", error);
      showAlert("Failed to fulfill prescription.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////////////////////////

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price,
    0,
  );

  const addItem = async () => {
    if (
      !newItem.name.trim() ||
      isNaN(newItem.price <= 0) ||
      newItem.price <= 0
    ) {
      showAlert("Please fill all fields with valid data.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const docRef = await addDoc(inventoryRef, newItem);
      await updateDoc(docRef, { id: docRef.id });
      setItems([...items, { ...newItem, id: docRef.id }]);
      setTestList([...testList, { ...newItem }]);
      setNewItem({ name: "", price: "" });
    } catch (err) {
      console.error("Error adding item:", err);
      showAlert("Failed to add item.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id, field, value) => {
    setIsLoading(true);
    try {
      const itemDoc = doc(db, "Tests List", id);
      await updateDoc(itemDoc, { [field]: value });
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
      showAlert("Successfully updated item.", "success");
    } catch (error) {
      console.error("Error updating item:", error);
      showAlert("Failed to update item.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    {
      await deleteDoc(doc(db, "Tests List", id));
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateIncome = async () => {
    try {
      const newIncome = {
        incomeCategory: "Test",
        incomeAmount: salePrice,
        createdAt: new Date(),
      };

      const monthDocRef = doc(db, "Accounts", curMonth);

      const incomeRef = collection(monthDocRef, "Income");

      await addDoc(incomeRef, newIncome);
      alert("Income updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update income");
    }
  };

  //////////////////////////////////////////////////////////

  const fulfillTest = async (patientId, consultationId) => {
    try {
      const testDocRef = doc(
        db,
        `hospital/Hospital info/Patients/${patientId}/Consultations/${consultationId}`,
      );

      const testDocSnap = await getDoc(testDocRef);
      if (testDocSnap.exists() && testDocSnap.data().completed) {
        alert("This test is already marked as completed.");
        return;
      }

      await updateDoc(testDocRef, {
        completed: true,
        completedAt: new Date().toISOString(),
      });

      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === consultationId && test.patientId === patientId
            ? {
                ...test,
                completed: true,
                completedAt: new Date().toISOString(),
              }
            : test,
        ),
      );

      alert("Test marked as completed!");
    } catch (error) {
      console.error("Error completing test:", error);
      alert("Failed to mark test as complete.");
    }
  };

  //Fetch all tests
  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        const patientsRef = collection(db, "hospital/Hospital info/Patients");
        const patientsSnapshot = await getDocs(patientsRef);

        const allTests = [];
        for (const patientDoc of patientsSnapshot.docs) {
          const consultationsRef = collection(
            db,
            `hospital/Hospital info/Patients/${patientDoc.id}/Consultations`,
          );
          const testsSnapshot = await getDocs(consultationsRef);
          const testsData = testsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            patientId: patientDoc.id,
          }));
          allTests.push(...testsData);
        }

        setTests(allTests);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchAllTests();
  }, []);
  //////////////////////////

  const getCurrentMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonthIndex = new Date().getMonth();
    return months[currentMonthIndex];
  };

  useEffect(() => {
    setCurMonth(getCurrentMonth());
  }, []);

  useEffect(() => {
    const inventoryQuery = query(inventoryRef, limit(50));
    const unsubscribe = onSnapshot(inventoryQuery, (snapshot) => {
      const updatedItems = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(updatedItems);
    });
    return () => unsubscribe();
  }, [inventoryRef]);

  // Fetch Inventory Data from Firestore
  useEffect(() => {
    const fetchTestList = async () => {
      if (!inventoryRef) return;
      try {
        const testListSnapshot = await getDocs(inventoryRef);
        const allTests = testListSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTestList(allTests);
      } catch (err) {
        console.error("Fetching test list error:", err);
      }
    };

    fetchTestList();
  }, [inventoryRef]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "hospital/Hospital info/Patients"),
      (patientsSnapshot) => {
        const allTestsPromises = patientsSnapshot.docs.map(
          async (patientDoc) => {
            const consultationsRef = collection(
              db,
              `hospital/Hospital info/Patients/${patientDoc.id}/Consultations`,
            );
            const testsSnapshot = await getDocs(consultationsRef);
            return testsSnapshot.docs.map((doc) => ({
              id: doc.id,
              patientId: patientDoc.id,
              ...doc.data(),
            }));
          },
        );

        Promise.all(allTestsPromises).then((results) => {
          const allTests = results.flat();
          setTests(allTests);
        });
      },
    );

    return () => unsubscribe();
  }, [setTests]);
  ///////////////////////////////////////

  useEffect(() => {
    setSalePrice(totalPrice);
  }, [selectedItems, totalPrice]);

  return (
    <LabContext.Provider
      value={{
        deleteItem,
        updateItem,
        addItem,
        newItem,
        setNewItem,
        items,
        setItems,
        handleSelectItem,
        totalPrice,
        selectedItems,
        setSelectedItems,
        tests,
        fulfillTest,
        updateIncome,
        testList,
        testResults,
        handleAddMoreTestResult,
        handleTestChange,
        handleSetTestResult,
        handleCompleteTest,
        completeTests,
        selectedTest,
        openResultInput,
        setOpenResultInput,
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

function useLab() {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error("useLab was used outside LabProvider");
  }
  return context;
}
export { LabProvider, useLab };
