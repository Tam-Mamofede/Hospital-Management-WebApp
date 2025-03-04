/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useLab } from "../../contexts/LabContext";
import { usePatientData } from "../../contexts/PatientDataContext";

const PatientTestResults = ({ patientId }) => {
  const { tests } = useLab();
  const { currentPat } = usePatientData();

  const patientTests = tests.filter(
    (test) => test.patientId === patientId && test.completed,
  );

  useEffect(() => {
    console.log("Filtered tests:", patientTests);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 pl-4 text-2xl font-bold text-gray-800">
        Test Results
      </h2>
      <h3 className="mb-4 pl-4 text-xl font-semibold text-blue-800">
        {currentPat}
      </h3>
      {patientTests.length > 0 ? (
        patientTests.map((test) => (
          <div
            key={test.id}
            className="mb-6 rounded-lg bg-gray-50 p-4 shadow-sm"
          >
            {test.testResults && test.testResults.length > 0 ? (
              <table className="w-full border-collapse text-sm text-gray-700">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="rounded-tl-lg border-b px-5 py-3 text-left">
                      Test Name
                    </th>
                    <th className="rounded-tr-lg border-b px-5 py-3 text-left">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {test.testResults.map((result, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="border-b px-5 py-3">{result.testName}</td>
                      <td className="border-b px-5 py-3 font-semibold text-green-600">
                        {result.testResult}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No test results available.</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No tests found for this patient.</p>
      )}
    </div>
  );
};

export default PatientTestResults;
