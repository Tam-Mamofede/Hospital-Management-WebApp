import { useConsultation } from "../../contexts/ConsultationContext";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader";
import { useState } from "react";

function Consultations() {
  const { consultations } = useConsultation();
  const { isLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(consultations.length / itemsPerPage);

  const sortedCons = [...consultations].sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate - aDate;
  });

  const paginatedItems = sortedCons.slice(
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
    <div className="mx-4">
      <h1 className="my-6 text-2xl font-extrabold text-stone-900">
        Consultation Notes
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-blue-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Patient ID</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Prescription</th>
              <th className="border p-2">Test</th>
              <th className="border p-2">Procedures/Surgey</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <div>
                <Loader />
              </div>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((consultation) => {
                return (
                  <tr
                    key={`${consultation.patientId}-${consultation.id}`}
                    className="text-center"
                  >
                    <td className="border p-2">{consultation.date}</td>
                    <td className="border p-2">{consultation.patientId}</td>
                    <td className="border p-2">{consultation.attendingDoc}</td>
                    <td className="border p-2">{consultation.notes}</td>
                    <td className="border p-2">{consultation.prescription}</td>
                    <td className="border p-2">{consultation.tests}</td>
                    <td className="border p-2">{consultation.procedure}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="border p-2 text-center">
                  No consultations found.
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
      </div>
    </div>
  );
}

export default Consultations;
