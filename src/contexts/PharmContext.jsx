/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from "react";
import { db } from "../../firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { usePatientData } from "./PatientDataContext";
import { useAlert } from "./AlertContext";

const PharmContext = createContext();

function PharmProvider({ children }) {
  const { currentStaff, setIsLoading } = useAuth();
  const { currentPat } = usePatientData();
  const { showAlert } = useAlert();

  const inventoryRef = collection(db, "pharmacyInventory");

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [salePrice, setSalePrice] = useState(0);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    code: "",
    quantity: "",
    expiration: "",
  });

  //////////////////////////////////

  const handleSelectItem = (selectedId) => {
    if (!selectedId || !items.find((item) => item.id === selectedId)) return;
    setIsLoading(true);
    try {
      const existingItem = selectedItems.find((item) => item.id === selectedId);
      if (!existingItem) {
        const newItem = items.find((item) => item.id === selectedId);

        const itemWithQuantity = {
          ...newItem,
          quantityToSell: 1,
          staffRole: currentStaff.role,
        };
        setSelectedItems((prev) => [...prev, itemWithQuantity]);
        return itemWithQuantity;
      }

      return existingItem;
    } catch (e) {
      console.error(e);
      showAlert("Error fetching item. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////

  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantityToSell: Math.max(1, Number(quantity)) }
          : item,
      ),
    );
  };

  // Calculate total price
  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantityToSell,
    0,
  );

  // Sell Items
  const handleSell = async () => {
    setIsLoading(true);
    try {
      for (let item of selectedItems) {
        const newQuantity = item.quantity - item.quantityToSell;
        if (newQuantity < 0) {
          alert(`Not enough stock for ${item.name}!`);
          return;
        }
        await updateItem(item.id, "quantity", newQuantity);
      }

      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      showAlert("Failed to create update quantity of items.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////////////

  // Add New Item
  const addItem = async () => {
    if (
      !newItem.name ||
      isNaN(newItem.price) ||
      newItem.price <= 0 ||
      isNaN(newItem.quantity) ||
      newItem.quantity <= 0 ||
      !newItem.expiration
    ) {
      showAlert("Please fill all fields with valid data.", "info");
      return;
    }
    setLoading(true);

    try {
      const docRef = await addDoc(inventoryRef, newItem);
      showAlert("Item added successfully.", "success");
      setItems([...items, { ...newItem, id: docRef.id }]);
      setNewItem({ name: "", price: "", quantity: "", expiration: "" });
    } catch (err) {
      console.error("Error adding item:", err);
      showAlert("Failed to add item. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////////////////////////////////

  // Edit Item
  const updateItem = async (id, field, value) => {
    setIsLoading(true);
    try {
      const itemDoc = doc(db, "pharmacyInventory", id);
      await updateDoc(itemDoc, { [field]: value });
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
    } catch (err) {
      console.error("Error updating item:", err);
      showAlert("Failed to update item. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////

  // Delete Item
  const deleteItem = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "pharmacyInventory", id));
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      showAlert("Failed to delete item. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////////////

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getDocs(inventoryRef);
      const fetchedItems = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const today = new Date().toISOString().split("T")[0];

      const updatedItems = fetchedItems.map((item) => ({
        ...item,
        expired: item.expiration <= today ? true : false,
      }));

      setItems((prevItems) => {
        const isSame =
          JSON.stringify(prevItems) === JSON.stringify(updatedItems);
        return isSame ? prevItems : updatedItems;
      });
    };

    fetchItems();
  }, [currentStaff]);

  useEffect(() => {
    setSalePrice(totalPrice);
  }, [selectedItems, totalPrice]);

  //////////////////////////////////////////////////////////

  //PRESCRIPTIONS

  const fulfillPrescription = async (patientId, prescriptionId) => {
    setIsLoading(true);
    try {
      const prescriptionDocRef = doc(
        db,
        `hospital/Hospital info/Patients/${patientId}/Consultations/${prescriptionId}`,
      );

      await updateDoc(prescriptionDocRef, {
        fulfilled: true,
        fulfilledAt: new Date().toISOString(),
      });

      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.map((prescription) =>
          prescription.id === prescriptionId &&
          prescription.patientId === patientId
            ? {
                ...prescription,
                fulfilled: true,
                fulfilledAt: new Date().toISOString(),
              }
            : prescription,
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

  ///////////////////////////////////////////////

  //fetch Prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      const patientsRef = collection(db, "hospital/Hospital info/Patients");

      const unsubscribe = onSnapshot(patientsRef, async (patientsSnapshot) => {
        try {
          const allPrescriptionsPromises = patientsSnapshot.docs.map(
            async (patientDoc) => {
              const consultationsRef = collection(
                db,
                `hospital/Hospital info/Patients/${patientDoc.id}/Consultations`,
              );
              const prescriptionsSnapshot = await getDocs(consultationsRef);
              return prescriptionsSnapshot.docs.map((doc) => ({
                id: doc.id,
                patientId: patientDoc.id,
                ...doc.data(),
              }));
            },
          );

          const allPrescriptionsArray = await Promise.all(
            allPrescriptionsPromises,
          );
          const allPrescriptions = allPrescriptionsArray.flat();

          setPrescriptions(allPrescriptions);
        } catch (error) {
          console.error("Error fetching prescriptions: ", error);
        }
      });

      return () => unsubscribe();
    };

    fetchPrescriptions();
  }, [currentPat]);

  return (
    <PharmContext.Provider
      value={{
        deleteItem,
        updateItem,
        addItem,
        newItem,
        setNewItem,
        items,
        setItems,
        handleSelectItem,
        handleQuantityChange,
        handleSell,
        totalPrice,
        selectedItems,
        setSelectedItems,
        prescriptions,
        fulfillPrescription,
        salePrice,
        setSalePrice,
        loading,
      }}
    >
      {children}
    </PharmContext.Provider>
  );
}

function usePharm() {
  const context = useContext(PharmContext);
  if (context === undefined) {
    throw new Error("usePharm was used outside PharmProvider");
  }
  return context;
}
export { PharmProvider, usePharm };
