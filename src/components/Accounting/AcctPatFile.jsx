/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react";
import { usePatientData } from "../../contexts/PatientDataContext";
import AppointmentBooking from "../Appointments";
import AddBillPharm from "./AddBillPharm";
import { useAuth } from "../../contexts/AuthContext";
import AddBillLab from "./AddBillLab";
import AddBill from "./AddBill";
import Invoice from "./Invoice";
import PatBills from "./PatBills";
import { useAcct } from "../../contexts/AcctContext";

const AcctPatFile = forwardRef(({ patient }, ref) => {
  const [showApp, setShowApp] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showInv, setShowInv] = useState(false);
  const [showPatBills, setShowPatBills] = useState(false);

  const { setCurrentPat, appointments, filteredPatients, patStats } =
    usePatientData();
  const { currentStaff } = useAuth();
  const { fetchPatientBillings } = useAcct();

  if (!patient) {
    return (
      <p className="text-center text-xl font-semibold text-gray-700">
        No patient data available.
      </p>
    );
  }

  const patientId = `${patient.patLastName}_${patient.id}`;

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
      </div>

      {/* Add Bill */}
      <div className="flex space-x-8">
        <button
          onClick={() => setShowAddBill(!showAddBill)}
          className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-green-700"
        >
          {showAddBill ? "Close Billing" : "💳 Add Bill"}
        </button>
        <button
          onClick={() => setCurrentPat("")}
          className="mt-6 w-full rounded-xl bg-red-500 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-red-700"
        >
          Close Patient File
        </button>
        <button
          className="mt-6 w-full rounded-xl bg-blue-500 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-blue-700"
          onClick={() => setShowInv(!showInv)}
        >
          Show invoice
        </button>
        <button
          className="mt-6 w-full rounded-xl bg-blue-500 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-blue-700"
          onClick={() => setShowPatBills(!showPatBills)}
        >
          Show Bills
        </button>
      </div>

      {/* Add Bill section */}
      <div>
        {showAddBill &&
          (currentStaff.role === "Pharmacist" ? (
            <AddBillPharm patientId={patientId} />
          ) : currentStaff.role === "Lab" ? (
            <AddBillLab patientId={patientId} />
          ) : (
            <AddBill patientId={patientId} />
          ))}
      </div>

      {/* <Invoice /> */}
      {showInv && (
        <div>
          <Invoice patientId={patientId} />
        </div>
      )}

      {showPatBills && (
        <PatBills
          patientId={patientId}
          fetchPatientBillings={fetchPatientBillings}
        />
      )}
    </div>
  );
});

AcctPatFile.displayName = "AcctPatFile";
export default AcctPatFile;
