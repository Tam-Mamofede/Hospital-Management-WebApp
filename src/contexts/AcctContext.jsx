/* eslint-disable react/prop-types */
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  getDoc,
  increment,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { db } from "../../firebase.config";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { usePatientData } from "./PatientDataContext";

const AcctContext = createContext();

function AcctProvider({ children }) {
  const [expense, setExpense] = useState({ category: "", amount: 0 });
  const [income, setIncome] = useState({ category: "", amount: 0 });
  const [selectedMonth, setSelectedMonth] = useState(false);
  const [allExp, setAllExp] = useState([]);
  const [allIncome, setAllIncome] = useState([]);
  const [editOpt, setEditOpt] = useState("");
  const [popInvoice, setPopInvoice] = useState(false);
  const [submitBill, setSubmitBill] = useState(false);
  const [patBillForInvoice, setPatBillForInvoice] = useState([]);
  const [allBills, setAllBills] = useState([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [bill, setBill] = useState({
    name: "",
    amt: "",
    quantity: "",
    itemCode: "",
  });
  ///////////////////////////////////

  const today = new Date().toISOString().split("T")[0];

  const { curMonth, setCurMonth, setIsLoading, currentStaff, isLoading } =
    useAuth();
  const { showAlert } = useAlert();
  const { setBilling } = usePatientData();
  ////////////////////////////////////

  const totalAmountPharm = useMemo(
    () =>
      allBills.reduce((total, bill) => {
        if (!bill || !bill.price || !bill.quantity) {
          return total;
        }

        if (bill.date != today) {
          return;
        }

        const price = parseFloat(bill.price) || 0;
        if (bill.quantity > 1) {
          const quantity = parseInt(bill.quantity, 10) || 0;
          const sum = Number(total) + Number(price) * Number(quantity);
          return sum;
        } else {
          const sum = Number(total) + Number(price);
          return sum;
        }
      }, 0),
    [allBills],
  );

  const totalAmount = useMemo(
    () =>
      allBills.reduce((total, bill) => {
        if (!bill || !bill.price || bill.date !== today) {
          return total;
        }

        const price = parseFloat(bill.price) || 0;
        return total + price;
      }, 0),
    [allBills],
  );

  //////////////////////////////////////

  const monthList = useMemo(
    () => [
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
    ],
    [],
  );
  ////////////////////////
  const handleSelectMonth = useCallback(
    (e) => {
      const selectedValue = e.target.value;
      setCurMonth(selectedValue);
      setSelectedMonth(true);
    },
    [setCurMonth],
  );
  ////////////////////////////////////////

  const handleShowInvoice = useCallback(async () => {
    const invoiceCounterRef = doc(db, "Counters", "invoiceCounter");
    const invoiceCounterSnap = await getDoc(invoiceCounterRef);

    let newInvoiceId = 1;
    if (invoiceCounterSnap.exists()) {
      newInvoiceId = invoiceCounterSnap.data().currentInvoiceId + 1;
    }
    await setDoc(invoiceCounterRef, { currentInvoiceId: newInvoiceId });
    setPopInvoice(true);
    setInvoiceId(newInvoiceId);
    console.log("New Invoice ID set:", newInvoiceId);
  }, []);
  ////////////////////////////////////////////////

  const saveInvoice = useCallback(
    async (patientId, invoiceData) => {
      try {
        const invoiceRef = doc(
          db,
          "hospital/Hospital info/Patients",
          patientId,
          "invoices",
          String(invoiceData.invoiceId),
        );
        await setDoc(invoiceRef, { ...invoiceData, invoiceId, patientId });
      } catch (error) {
        console.error("Error saving invoice: ", error);
      }
    },
    [invoiceId],
  );

  ///////////////////////////////////////////

  // Increment Invoice ID
  const incrementInvoiceId = async () => {
    const counterRef = doc(db, "counters", "invoiceId");
    await updateDoc(counterRef, {
      current: increment(1),
    });
  };

  //SET BILLING
  const setBillingForPat = async (patientId) => {
    setIsLoading(true);
    if (!patientId) {
      if (isLoading) setIsLoading(false);

      return;
    }
    try {
      const newBill = {
        itemName: bill.name,
        price: bill.price,
        date: today,
        staffRole: currentStaff.role,
      };

      const batch = writeBatch(db);

      const newBillRef = doc(
        collection(db, `hospital/Hospital info/Patients/${patientId}/Billing`),
      );
      batch.set(newBillRef, newBill);
      await batch.commit();
      // await addDoc(patBillColRef, newBill);
      setSubmitBill(true);
      showAlert("Bill submitted successfully", "success");
    } catch (error) {
      console.error("Error setting bill for patient: ", error);
      showAlert("Could not submit bill", "error");
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  ////////////////////////////////////////////////

  //LAB BILLING
  const setLabBillingForPat = async (patientId) => {
    setIsLoading(true);
    if (!patientId) {
      if (isLoading) setIsLoading(false);

      return;
    }
    try {
      const newBill = {
        itemName: bill.name,
        price: bill.price,
        date: today,
        staffRole: bill.staffRole,
      };

      const batch = writeBatch(db);

      const newBillRef = doc(
        collection(db, `hospital/Hospital info/Patients/${patientId}/Billing`),
      );

      batch.set(newBillRef, newBill);
      await batch.commit();

      setSubmitBill(true);
      showAlert("Bill submitted successfully", "success");
    } catch (error) {
      console.error("Error setting bill for patient: ", error);
      showAlert("Could not submit bill", "error");
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  //////////////////////////////////////////

  const setPharmBillingForPat = async (patientId, items) => {
    setIsLoading(true);
    if (!patientId) {
      if (isLoading) setIsLoading(false);
      return;
    }

    try {
      const batch = writeBatch(db);

      for (const bill of items) {
        const newBillRef = doc(
          collection(
            db,
            `hospital/Hospital info/Patients/${patientId}/Billing`,
          ),
        );
        const newBill = {
          itemName: bill.name,
          price: bill.price,
          quantity: bill.quantityToSell,
          itemCode: bill.code,
          date: today,
          staffRole: bill.staffRole,
        };
        batch.set(newBillRef, newBill);
      }

      await batch.commit();

      setSubmitBill(true);
      showAlert("Bill submitted successfully", "success");
    } catch (error) {
      console.error("Error setting bill for patient: ", error);
      showAlert("Could not submit bill", "error");
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  /////////////////////////////////////////

  //Submit Expense
  const handleSubmitExpense = async () => {
    if (expense.category == "" || expense.amount == "") {
      showAlert("Please fill in all fields", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const newExpense = {
        expenseCategory: expense.category,
        expenseAmount: expense.amount,
        createdAt: new Date(),
        label: "expense",
      };

      const monthDocRef = doc(db, "Accounts", curMonth);

      await addDoc(collection(monthDocRef, "Expenses"), newExpense);

      showAlert("Expense documented successfully", "success");
      setSelectedMonth(false);
    } catch (err) {
      console.error(err);
      showAlert("Could not document expense", "error");
    } finally {
      if (isLoading) setIsLoading(false);

      setExpense((prev) => ({ ...prev, category: "", amount: "" }));
    }
  };

  ///////////////////////////////////////////////////

  //Submit Income
  const handleSubmitIncome = async () => {
    if (income.category == "" || income.amount == "") {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const newIncome = {
        incomeCategory: income.category,
        incomeAmount: income.amount,
        createdAt: new Date(),
        label: "income",
      };

      const monthDocRef = doc(db, "Accounts", curMonth);
      await addDoc(collection(monthDocRef, "Income"), newIncome);

      showAlert("Income documented successfully", "success");
      setSelectedMonth(false);
    } catch (err) {
      console.error(err);
      showAlert("Could not document income", "error");
    } finally {
      if (isLoading) setIsLoading(false);

      setIncome((prev) => ({ ...prev, category: "", amount: "" }));
    }
  };

  // Reusable function for fetching expenses and income
  const fetchData = useCallback(
    async (type, stateSetter) => {
      if (!curMonth) return;

      setIsLoading(true);
      try {
        const monthDocRef = doc(db, "Accounts", curMonth);
        const colRef = collection(monthDocRef, type);
        const docsSnapshot = await getDocs(colRef);

        if (!docsSnapshot.empty) {
          const data = docsSnapshot.docs.map((doc) => doc.data());
          stateSetter(data);
        } else {
          console.log(`No ${type.toLowerCase()} found for the selected month.`);
        }
      } catch (error) {
        console.error(`Error fetching ${type.toLowerCase()}:`, error);
      } finally {
        if (isLoading) setIsLoading(false);
      }
    },
    [curMonth],
  );

  ///////////////////////////////////////////

  const fetchPatientBillings = useCallback((patientId) => {
    if (!patientId) {
      console.error("fetchPatientBillings: patientId is required.");
      return;
    }

    setIsLoading(true);

    const patBillColRef = collection(
      db,
      `hospital/Hospital info/Patients/${patientId}/Billing`,
    );

    const unsubscribe = onSnapshot(
      patBillColRef,
      (snapshot) => {
        if (snapshot.empty) {
          console.log(`No billings found for patient ${patientId}`);
          setPatBillForInvoice([]);
          setBilling([]);
        } else {
          const billsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPatBillForInvoice((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(billsData)) {
              return billsData;
            }
            return prev;
          });

          setBilling((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(billsData)) {
              return billsData;
            }
            return prev;
          });
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching patient billings: ", error.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchData("Expenses", setAllExp);
    fetchData("Income", setAllIncome);
  }, [curMonth, fetchData]);

  return (
    <AcctContext.Provider
      value={{
        expense,
        setExpense,
        handleSubmitExpense,
        handleSubmitIncome,
        monthList,
        curMonth,
        setCurMonth,
        selectedMonth,
        setSelectedMonth,
        income,
        setIncome,
        allExp,
        allIncome,
        handleSelectMonth,
        editOpt,
        setEditOpt,
        patBillForInvoice,
        fetchPatientBillings,
        saveInvoice,
        incrementInvoiceId,
        setPharmBillingForPat,
        setLabBillingForPat,
        bill,
        setBill,
        popInvoice,
        setPopInvoice,
        handleShowInvoice,
        invoiceId,
        setInvoiceId,
        allBills,
        setAllBills,
        submitBill,
        totalAmountPharm,
        totalAmount,
        setBillingForPat,
      }}
    >
      {children}
    </AcctContext.Provider>
  );
}

function useAcct() {
  const context = useContext(AcctContext);
  if (context === undefined) {
    throw new Error("useAcct must be used within an AcctProvider");
  }
  return context;
}

export { AcctProvider, useAcct };
