import { useState } from "react";
import { useAppointment } from "../../contexts/AppointmentContext";
import { usePatientData } from "../../contexts/PatientDataContext";
import Loader from "../Loader";
import { useAuth } from "../../contexts/AuthContext";

function DocAppointments() {
  const { appList, getPatientNameById, getPatientLastNameById } =
    useAppointment();
  const { setCurrentPat } = usePatientData();
  const { isLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(appList.length / itemsPerPage);

  const sortedAppointments = [...appList].sort(
    (a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time),
  );

  const paginatedItems = sortedAppointments.slice(
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
    <div className="inset-0 flex items-center justify-center rounded-xl border-2 px-6 shadow-lg">
      <div className="mx-3 my-4 w-full overflow-x-auto rounded-lg">
        <h2 className="my-6 text-2xl font-bold">Appointments</h2>

        <table className="w-full border border-blue-300">
          <thead>
            <tr className="bg-blue-200">
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr
                colSpan="3"
                className="flex w-full items-center justify-center"
              >
                <td>
                  <Loader />
                </td>
              </tr>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((app) => (
                <tr key={app.id} className="text-center">
                  <td
                    className="border p-2 hover:cursor-pointer"
                    onClick={() =>
                      setCurrentPat(getPatientLastNameById(app.patientId))
                    }
                  >
                    {getPatientNameById(app.patientId)}
                  </td>
                  <td className="border p-2">{app.date}</td>
                  <td className="border p-2">{app.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center">
                  No appointments scheduled.
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

export default DocAppointments;
