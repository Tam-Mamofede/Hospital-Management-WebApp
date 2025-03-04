/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useState } from "react";
import { usePatientData } from "../../contexts/PatientDataContext";
import { useStaffData } from "../../contexts/StaffContext";
import AddConsultation from "./AddConsultation";
import DocConsultation from "./DocConsultation";
import PatientTestResults from "../Lab/PatientTestResults";
import { useNurseData } from "../../contexts/NurseContext";
import AppointmentBooking from "../Appointments";
import Invoice from "../Accounting/Invoice";

const DocPatFile = forwardRef(({ patient }, ref) => {
  const [showTestResults, setShowTestResults] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showInv, setShowInv] = useState(false);

  const patientId = `${patient.patLastName}_${patient.id}`;

  const { filteredPatients, patStats, appointments, setCurrentPat } =
    usePatientData();
  const { showConNotes, toggleConNotes } = useStaffData();
  const { fetchVitals, today, patVitals } = useNurseData();

  useEffect(() => {
    if (!patientId) return;
    const unsubscribe = fetchVitals(patientId);
    return () => unsubscribe();
  }, [patientId, today, fetchVitals]);

  if (!patient) {
    return (
      <p className="text-center text-blue-600">No patient data available.</p>
    );
  }
  return (
    <div
      ref={ref}
      className="bg-grey-100 mx-auto w-full rounded-xl border border-gray-300 p-8 shadow-2xl"
    >
      <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
        {patient.patLastName} {patient.patFirstName}
      </h1>
      {patStats && (
        <p
          className={`mb-6 inline-block rounded-full px-5 py-2 text-lg font-semibold text-white shadow-md ${
            patStats === "discharged" ? "bg-yellow-500" : "bg-green-600"
          }`}
        >
          {patStats}
        </p>
      )}
      <div className="space-y-2 text-lg text-gray-800">
        <p>
          <span className="font-bold">📧 Email:</span> {patient.patEmail}
        </p>
        <p>
          <span className="font-bold">📞 Phone:</span> {patient.patPhone}
        </p>
        <p>
          <span className="font-bold">🏠 Address:</span> {patient.patAddress}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          className="mt-6 w-fit rounded-lg bg-white px-4 py-2 text-center text-lg font-semibold text-blue-900 transition-all hover:bg-blue-500 hover:text-white"
          onClick={() => setShowApp(!showApp)}
        >
          {showApp ? "Hide Appointments" : "📅 Book an Appointment"}
        </button>
      </div>

      {/* Appointments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-blue-800">Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="mt-2 list-disc pl-6 text-stone-700">
            {appointments.map((app) => (
              <li key={app.id} className="border-b py-2">
                <strong>Date:</strong> {app.date}, <strong>Time:</strong>{" "}
                {app.time}, <strong>Doctor:</strong> {app.doctor}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-stone-600">No appointments found.</p>
        )}
      </div>

      {showApp && <AppointmentBooking patientId={patientId} />}

      {/* Patient Table */}
      <div className="mt-8 rounded-lg shadow-md">
        <table className="w-full border-collapse rounded-lg text-gray-900">
          <thead className="bg-blue-600 text-white">
            <tr>
              {[
                "#ID",
                "Insurance",
                "Emergency",
                "Name",
                "Gender",
                "Age",
                "Blood Group",
                "Emergency Contact",
                "Allergies",
                "Status",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="border px-6 py-3 text-lg font-medium"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white text-center transition-all even:bg-gray-100 hover:bg-gray-100"
                >
                  <td className="border px-6 py-3">{p.id}</td>
                  <td className="border px-6 py-3">{p.healthIns}</td>
                  <td className="border px-6 py-3">{p.emergency}</td>
                  <td className="border px-6 py-3 font-semibold">
                    {p.patLastName} {p.patFirstName}
                  </td>
                  <td className="border px-6 py-3">{p.patGender}</td>
                  <td className="border px-6 py-3">{p.patAge}</td>
                  <td className="border px-6 py-3">{p.patBloodGroup}</td>
                  <td className="border px-6 py-3">{p.emergencyContactName}</td>
                  <td className="border px-6 py-3">{p.patAllergies}</td>
                  <td className="border px-6 py-3">{p.patStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="py-6 text-center text-xl text-gray-700"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Bill */}
        <div className="flex h-fit items-center justify-center space-x-4 px-2 pb-8">
          <button
            onClick={() => setShowAddBill(!showAddBill)}
            className="mt-6 h-fit w-full rounded-xl bg-blue-600 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-blue-700"
          >
            {showAddBill ? "Close Billing" : "💳 Add Bill"}
          </button>
          <button
            className="mt-6 h-fit w-full rounded-xl bg-blue-500 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            onClick={() => setShowInv(!showInv)}
          >
            Show invoice
          </button>
          <button
            className="mt-6 h-fit w-full rounded-xl bg-blue-500 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-blue-500"
            onClick={toggleConNotes}
          >
            Consultation Notes
          </button>
          <button
            className="mt-6 h-fit w-full rounded-xl bg-blue-500 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-blue-500"
            onClick={() => setShowTestResults(!showTestResults)}
          >
            Show Test Results
          </button>{" "}
          <button
            onClick={() => setCurrentPat("")}
            className="mt-6 h-fit w-full rounded-xl bg-red-500 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-red-700"
          >
            Close File
          </button>
        </div>
      </div>

      {showConNotes && (
        <>
          {patVitals.some((vitals) => vitals.date === today) ? (
            <div className="overflow-x-auto">
              <h3>{`Patient vitals for ${today}`}</h3>
              <table className="w-3/5 border border-blue-300">
                <thead>
                  <tr className="bg-blue-200">
                    <th>Temperature</th>
                    <th>Heart Rate</th>
                    <th>Blood Pressure</th>
                    <th>Pulse</th>
                    <th>Height</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {patVitals.filter((vitals) => vitals.date === today).length >
                  0 ? (
                    patVitals
                      .filter((vitals) => vitals.date === today)
                      .map((vitals) => (
                        <tr key={vitals.id} className="text-center">
                          <td>{vitals.patTemp}</td>
                          <td>{vitals.patHeartRate}</td>
                          <td>{vitals.patBloodPressure}</td>
                          <td>{vitals.patPulse}</td>
                          <td>{vitals.patHeight}</td>
                          <td>{vitals.patWeight}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6">No vitals from the Nurse yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
          <div className="my-6 space-y-6">
            <DocConsultation />
            <AddConsultation patientId={patientId} />
          </div>
        </>
      )}

      {/* Appointments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-blue-800">Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="mt-2 list-disc pl-6 text-blue-700">
            {appointments.map((app) => (
              <li key={app.id} className="border-b py-2">
                <strong>Date:</strong> {app.date}, <strong>Time:</strong>{" "}
                {app.time}, <strong>Doctor:</strong> {app.doctor}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-600">No appointments found.</p>
        )}

        {/* Tests section */}
        {showTestResults && <PatientTestResults patientId={patientId} />}

        {showInv && <Invoice />}
      </div>
    </div>
  );
});

DocPatFile.displayName = "DocPatFile";

export default DocPatFile;
