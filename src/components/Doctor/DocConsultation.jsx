import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useConsultation } from "../../contexts/ConsultationContext";

function DocConsultation() {
  const { currentStaff } = useAuth();
  const { patConsultation, today, handleEdit, handleBlur, editableData } =
    useConsultation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = patConsultation.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const nextPage = () => {
    if (indexOfLastItem < patConsultation.length)
      setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mx-4">
      <h1 className="my-4 text-lg font-extrabold text-blue-600">
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
            {currentConsultations.length > 0 ? (
              currentConsultations.map((consultation) => {
                const isEditable =
                  consultation.attendingDoc === currentStaff?.staffLastName &&
                  consultation.date === today;

                return (
                  <tr
                    key={`${consultation.patientId}-${consultation.id}`}
                    className="text-center"
                  >
                    <td className="border p-2">{consultation.date}</td>
                    <td className="border p-2">{consultation.patientId}</td>
                    <td className="border p-2">{consultation.attendingDoc}</td>
                    <td className="border p-2">
                      {isEditable ? (
                        <input
                          type="text"
                          className="w-full border-none p-1 text-center focus:ring focus:ring-blue-300"
                          value={
                            editableData[
                              `${consultation.patientId}-${consultation.id}`
                            ]?.notes || consultation.notes
                          }
                          onChange={(e) =>
                            handleEdit(
                              consultation.patientId,
                              consultation.id,
                              "notes",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            handleBlur(
                              consultation.patientId,
                              consultation.id,
                              "notes",
                            )
                          }
                        />
                      ) : (
                        consultation.notes
                      )}
                    </td>

                    {/* Prescription */}
                    <td className="border p-2">{consultation.prescription}</td>

                    {/* Tests */}
                    <td className="border p-2">
                      {isEditable ? (
                        <input
                          type="text"
                          className="w-full border-none p-1 text-center focus:ring focus:ring-blue-300"
                          value={
                            editableData[
                              `${consultation.patientId}-${consultation.id}`
                            ]?.tests || consultation.tests
                          }
                          onChange={(e) =>
                            handleEdit(
                              consultation.patientId,
                              consultation.id,
                              "tests",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            handleBlur(
                              consultation.patientId,
                              consultation.id,
                              "tests",
                            )
                          }
                        />
                      ) : (
                        consultation.tests
                      )}
                    </td>

                    {/* Procedures */}
                    <td className="border p-2">
                      {isEditable ? (
                        <input
                          type="text"
                          className="w-full border-none p-1 text-center focus:ring focus:ring-blue-300"
                          value={
                            editableData[
                              `${consultation.patientId}-${consultation.id}`
                            ]?.procedure || consultation.procedure
                          }
                          onChange={(e) =>
                            handleEdit(
                              consultation.patientId,
                              consultation.id,
                              "procedure",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            handleBlur(
                              consultation.patientId,
                              consultation.id,
                              "procedure",
                            )
                          }
                        />
                      ) : (
                        consultation.procedure
                      )}
                    </td>
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
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="rounded bg-blue-300 px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-blue-700">
          Page {currentPage} of
          {Math.ceil(patConsultation.length / itemsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={indexOfLastItem >= patConsultation.length}
          className="rounded bg-blue-300 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DocConsultation;
