/* eslint-disable react/prop-types */

import { useEffect, useRef, useState, useMemo } from "react";
import { db } from "../../../firebase.config";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "../../contexts/AuthContext";
import { usePatientData } from "../../contexts/PatientDataContext";
import { useAcct } from "../../contexts/AcctContext";
import Loader from "../Loader";

const Invoice = ({ patientId }) => {
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const { currentPat } = usePatientData();
  const { currentStaff } = useAuth();
  const { invoiceId, allBills, setAllBills, totalAmount, totalAmountPharm } =
    useAcct();

  const getInvoiceTitle = useMemo(() => {
    switch (currentStaff.role) {
      case "Pharmacist":
        return `PHARMACY-${currentPat}`;
      case "Lab":
        return `Laboratory-${currentPat}`;
      default:
        return `Invoice-${currentPat}`;
    }
  }, [currentStaff.role, currentPat, invoiceId]);

  useEffect(() => {
    if (!patientId) return;

    setLoading(true);

    const patBillColRef = collection(
      db,
      `hospital/Hospital info/Patients/${patientId}/Billing`,
    );

    const unsubscribe = onSnapshot(
      patBillColRef,
      (snapshot) => {
        if (snapshot.empty) {
          setAllBills([]);
        } else {
          const newBills = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAllBills((prev) =>
            JSON.stringify(prev) !== JSON.stringify(newBills) ? newBills : prev,
          );
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching billing data:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [patientId]);

  useEffect(() => {
    console.log("Invoice Id updated:", invoiceId);
    console.log("Invoice Title:", getInvoiceTitle);
  }, [invoiceId]);

  const handleDeleteEntry = async (billId) => {
    try {
      const patRef = doc(db, "hospital/Hospital info/Patients", patientId);
      const patBillDocRef = doc(patRef, "Billing", billId);

      await deleteDoc(patBillDocRef);
      alert("Entry deleted successfully");
      setAllBills((prevBills) =>
        prevBills.filter((bill) => bill.id !== billId),
      );
    } catch (error) {
      console.error("Error deleting entry: ", error);
      alert("Failed to delete entry");
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    if (!totalAmount) {
      setLoading(false);
      return null;
    }

    try {
      const noPrintElements = document.querySelectorAll(".no-print");
      noPrintElements.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${patientId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setLoading(false);

      document
        .querySelectorAll(".no-print")
        .forEach((el) => (el.style.display = ""));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredBills = allBills.filter((bill) => {
    if (bill.date == today) {
      const billDate = bill.date;
      const billDept = bill.staffRole === currentStaff.role;
      return billDate && billDept;
    }
    if (!bill.date) return;
  });

  return (
    <div className="mt-2 flex justify-center">
      <div className="max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div ref={printRef} className="mx-2 mb-16 py-2">
          <h2 className="my-2 text-center text-2xl font-bold">
            Surecare Specialist Hospital Invoice
          </h2>
          <h3 className="my-2 text-center text-lg font-bold">
            {getInvoiceTitle}
          </h3>
          <p className="ml-8 text-xs"> Date: {today}</p>
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : filteredBills.length === 0 ? (
            <p className="text-center text-blue-500">
              No bills available for this patient today.
            </p>
          ) : (
            <div className="mx-16 my-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-blue-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-blue-300 px-4 py-2 text-left">
                      Item Name
                    </th>
                    {currentStaff.role == "Pharmacist" && (
                      <>
                        <th className="border border-blue-300 px-4 py-2 text-left">
                          Code
                        </th>
                        <th className="border border-blue-300 px-4 py-2 text-right">
                          Quantity
                        </th>
                      </>
                    )}
                    <th className="border border-blue-300 px-4 py-2 text-right">
                      Price (₦)
                    </th>
                    {currentStaff.role == "Pharmacist" && (
                      <th className="border border-blue-300 px-4 py-2 text-right">
                        Total (₦)
                      </th>
                    )}
                    <th className="no-print border border-blue-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-blue-50">
                      <td className="border border-blue-300 px-4 py-2">
                        {bill.itemName}
                      </td>
                      {currentStaff.role == "Pharmacist" && (
                        <>
                          <td className="border border-blue-300 px-4 py-2">
                            {bill.itemCode}
                          </td>
                          <td className="border border-blue-300 px-4 py-2 text-right">
                            {bill.quantity}
                          </td>{" "}
                        </>
                      )}
                      <td className="border border-blue-300 px-4 py-2 text-right">
                        {parseFloat(bill.price).toFixed(2)}
                      </td>
                      {currentStaff.role == "Pharmacist" && (
                        <td className="border border-blue-300 px-4 py-2 text-right">
                          {(bill.price * bill.quantity).toFixed(2)}
                        </td>
                      )}

                      <td className="no-print border border-blue-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteEntry(bill.id)}
                          className="no-print rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    {currentStaff.role !== "Pharmacist" ? (
                      <td
                        colSpan="1"
                        className="border border-blue-300 px-4 py-2 text-right font-bold"
                      >
                        Total:
                      </td>
                    ) : (
                      <td
                        colSpan="4"
                        className="border border-blue-300 px-4 py-2 text-right font-bold"
                      >
                        Total:
                      </td>
                    )}
                    <td className="border border-blue-300 px-4 py-2 text-right font-bold">
                      ₦
                      {currentStaff.role == "Pharmacist"
                        ? totalAmountPharm.toFixed(2)
                        : totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className={`w-full rounded px-4 py-2 font-bold text-white ${
            loading
              ? "cursor-not-allowed bg-blue-500"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default Invoice;
