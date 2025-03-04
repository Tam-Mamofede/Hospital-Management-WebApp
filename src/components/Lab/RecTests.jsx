import { useState } from "react";
import { usePatientData } from "../../contexts/PatientDataContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLab } from "../../contexts/LabContext";

function RecTests() {
  const { setCurrentPat } = usePatientData();
  const { isLoading } = useAuth();
  const {
    tests,
    handleCompleteTest,
    handleSetTestResult,
    testResults,
    handleTestChange,
    handleAddMoreTestResult,
    selectedTest,
  } = useLab();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(tests.length / itemsPerPage);

  const paginatedItems = tests.slice(
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
        Recommended Tests
      </h1>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full table-auto border-collapse border border-blue-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-4 text-left">Date</th>
              <th className="border p-4 text-left">Patient ID</th>
              <th className="border p-4 text-left">Attending Doctor</th>
              <th className="border p-4 text-left">Tests</th>
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
                .map((test) => (
                  <tr
                    key={test.id}
                    className="text-center transition duration-200 hover:bg-blue-50"
                  >
                    <td className="border p-4">
                      {test.date
                        ? new Date(test.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      className="border p-4 hover:cursor-pointer hover:text-blue-500"
                      onClick={() => setCurrentPat(test.patLastName)}
                    >
                      {test.patientId || "N/A"}
                    </td>
                    <td className="border p-4">
                      {test.attendingDoc || "Unknown"}
                    </td>
                    <td className="border p-4">{test.tests || ""}</td>
                    <td
                      className={`border p-4 ${test.fulfilled ? "bg-green-200" : "bg-yellow-200"}`}
                    >
                      {test.fulfilled ? "Completed" : "Pending"}
                    </td>
                    <td className="border p-4">
                      {!test.fulfilled && (
                        <button
                          onClick={() => handleCompleteTest(test)}
                          disabled={isLoading}
                          className="rounded-xl bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600 disabled:bg-gray-300 disabled:text-stone-900"
                        >
                          Complete
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
                  No tests found.
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
        <div>
          {selectedTest && (
            <form
              onSubmit={(e) =>
                handleSetTestResult(e, selectedTest.patientId, selectedTest.id)
              }
            >
              {testResults.map((test, index) => (
                <div key={index}>
                  <label>Test conducted</label>
                  <input
                    type="text"
                    value={test.testName}
                    name={`testName-${index}`}
                    onChange={(e) =>
                      handleTestChange(index, "testName", e.target.value)
                    }
                  />
                  <label>Test results</label>
                  <input
                    type="text"
                    value={test.testResult}
                    name={`testResult-${index}`}
                    onChange={(e) =>
                      handleTestChange(index, "testResult", e.target.value)
                    }
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddMoreTestResult}>
                Add More Test Results
              </button>
              <input type="submit" value="Submit" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecTests;
