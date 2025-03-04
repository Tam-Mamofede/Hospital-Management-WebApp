import { useState } from "react";
import { usePatientData } from "../../contexts/PatientDataContext";
import { usePharm } from "../../contexts/PharmContext";
import { useAuth } from "../../contexts/AuthContext";
import PatFile from "../PatFile";

function AllPrescriptions() {
  const { setCurrentPat, currentPat } = usePatientData();
  const { prescriptions, fulfillPrescription } = usePharm();
  const { isLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  const paginatedItems = prescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-extrabold text-blue-600">
        PRESCRIPTIONS
      </h1>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full table-auto border-collapse border border-blue-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-4 text-left">Date</th>
              <th className="border p-4 text-left">Patient ID</th>
              <th className="border p-4 text-left">Attending Doctor</th>
              <th className="border p-4 text-left">Prescription</th>
              <th className="border p-4 text-left">Status</th>
              <th className="border p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems
                .slice()
                .sort((a, b) => {
                  if (a.fulfilled !== b.fulfilled) {
                    return a.fulfilled ? 1 : -1;
                  }

                  return (
                    new Date(b.createdAt || b.date) -
                    new Date(a.createdAt || a.date)
                  );
                })
                .map((prescription) => (
                  <tr
                    key={prescription.id}
                    className="text-center transition duration-200 hover:bg-blue-50"
                  >
                    <td className="border p-4">
                      {prescription.date
                        ? new Date(prescription.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      className="border p-4 hover:cursor-pointer hover:text-blue-500"
                      onClick={() => setCurrentPat(prescription.patLastName)}
                    >
                      {prescription.patientId || "N/A"}
                    </td>
                    <td className="border p-4">
                      {prescription.attendingDoc || "Unknown"}
                    </td>
                    <td className="border p-4">
                      {prescription.prescription || ""}
                    </td>
                    <td
                      className={`border p-4 ${prescription.fulfilled ? "bg-green-200" : "bg-yellow-200"}`}
                    >
                      {prescription.fulfilled ? "Fulfilled" : "Pending"}
                    </td>
                    <td className="border p-4">
                      {!prescription.fulfilled && (
                        <button
                          disabled={isLoading}
                          onClick={() =>
                            fulfillPrescription(
                              prescription.patientId,
                              prescription.id,
                            )
                          }
                          className="rounded-xl bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600 disabled:bg-gray-300 disabled:text-stone-900"
                        >
                          Fulfill
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border p-4 text-center text-gray-500"
                >
                  No prescriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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

        {/* EXTRA CONTENT */}
        {currentPat && <PatFile />}
      </div>
    </div>
  );
}

export default AllPrescriptions;
