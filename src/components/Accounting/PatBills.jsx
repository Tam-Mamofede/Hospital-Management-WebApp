/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePatientData } from "../../contexts/PatientDataContext";
import Loader from "../Loader";

const PatBills = ({ patientId, fetchPatientBillings }) => {
  const { isLoading } = useAuth();
  const { billing } = usePatientData();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(billing.length / itemsPerPage);
  const paginatedItems = billing.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  // Pagination Controls
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (!patientId) return;

    (async () => {
      await fetchPatientBillings(patientId);
    })();
  }, [patientId, fetchPatientBillings]);

  return (
    <div className="mx-auto mt-6 max-w-lg p-4">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Patient Billing
      </h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : billing.length > 0 ? (
        <div className="space-y-2">
          {paginatedItems.map((bill) => (
            <div
              key={bill.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
            >
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">
                  {bill.itemName}
                </span>
                <span className="text-gray-600">${bill.price}</span>
              </div>
              <p className="text-sm text-gray-500">Date: {bill.date}</p>
              {bill.staffRole === "Pharmacist" && (
                <p className="text-sm text-gray-500">
                  Quantity: {bill.quantity}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Staff Role: {bill.staffRole}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No billing records found.</p>
      )}
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="rounded bg-blue-300 px-4 py-2 hover:bg-blue-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="rounded bg-blue-300 px-4 py-2 hover:bg-blue-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatBills;
