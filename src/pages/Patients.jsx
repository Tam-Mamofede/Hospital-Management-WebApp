import { NavLink } from "react-router";
import { usePatientData } from "../contexts/PatientDataContext";
import PatFile from "../components/PatFile";
import NursePatFile from "../components/NursePatFile";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import DocPatFile from "../components/Doctor/DocPatFile";
import AcctPatFile from "../components/Accounting/AcctPatFile";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patPerPage = 5;

  const {
    patList,
    updatePatientField,
    editingField,
    toggleEdit,
    handleInputChange,
    currentPat,
    setCurrentPat,
    searchQuery,
    searchedPatients,
    debouncedSearch,
  } = usePatientData();

  const { currentStaff } = useAuth();

  const patFileRef = useRef(null);

  const displayList = !searchedPatients ? patients : searchedPatients;

  const indexOfLastPat = currentPage * patPerPage;
  const indexOfFirstPat = indexOfLastPat - patPerPage;
  const currentPatList = displayList.slice(indexOfFirstPat, indexOfLastPat);

  const noEditRoles = ["Orderly", "Accountant", "Pharmacist", "Lab"];

  const totalPages = Math.ceil(displayList.length / patPerPage);

  useEffect(() => {
    setPatients(patList);
  }, [searchedPatients]);

  useEffect(() => {
    if (currentPat && patFileRef.current) {
      patFileRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPat]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-screen px-16 py-6">
        <div className="w-7xl mx-auto">
          <div className="my-4 flex justify-between">
            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-500 px-4 py-3 shadow focus:outline-none"
              />
            </div>
            <button className="mb-6 rounded-xl bg-blue-100 p-2 font-bold text-blue-900 hover:cursor-pointer hover:bg-blue-200">
              <NavLink to="/patient-reg">Add patient</NavLink>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse divide-y divide-gray-700 text-sm">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      #ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Emergency?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Health Insurance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Emergency Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Emergency Contact Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Allergies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Current Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentPatList.length > 0 ? (
                    currentPatList.map((patient) => (
                      <tr
                        key={patient.id}
                        className="text-center hover:bg-gray-50"
                      >
                        <td className="px-6 py-3">{patient.id}</td>
                        <td className="px-6 py-3">{patient.emergency}</td>
                        <td className="px-6 py-3">{patient.healthIns}</td>
                        <td
                          className="px-6 py-3 text-blue-600 hover:cursor-pointer hover:underline"
                          onClick={() => setCurrentPat(patient.patLastName)}
                        >
                          {patient.patLastName}
                        </td>
                        <td className="px-6 py-3">{patient.patFirstName}</td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patGender}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patGender ? (
                            <>
                              <select
                                defaultValue={patient.patGender}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patGender",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patGender",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patGender || patient.patGender,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patGender}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patGender",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patAge}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patAge ? (
                            <>
                              <input
                                type="text"
                                defaultValue={patient.patAge}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAge",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAge",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patAge || patient.patAge,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patAge}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAge",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patBloodGroup}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patBloodGroup ? (
                            <>
                              <select
                                defaultValue={patient.patBloodGroup}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patBloodGroup",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              >
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="O+">O+</option>
                                <option value="AB+">AB+</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                              </select>
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patBloodGroup",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patBloodGroup || patient.patBloodGroup,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patBloodGroup}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patBloodGroup",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.emergencyContactName}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.emergencyContactName ? (
                            <>
                              <input
                                type="text"
                                defaultValue={patient.emergencyContactName}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactName",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactName",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.emergencyContactName ||
                                      patient.emergencyContactName,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.emergencyContactName}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactName",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.emergencyContactNumber}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.emergencyContactNumber ? (
                            <>
                              <input
                                type="text"
                                defaultValue={patient.emergencyContactNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactNumber",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactNumber",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.emergencyContactNumber ||
                                      patient.emergencyContactNumber,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.emergencyContactNumber}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "emergencyContactNumber",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>{" "}
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patAllergies}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patAllergies ? (
                            <>
                              <input
                                type="text"
                                defaultValue={patient.patAllergies}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAllergies",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAllergies",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patAllergies || patient.patAllergies,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patAllergies}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patAllergies",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>{" "}
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patCurrentMeds}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patCurrentMeds ? (
                            <>
                              <input
                                type="text"
                                defaultValue={patient.patCurrentMeds}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patCurrentMeds",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patCurrentMeds",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patCurrentMeds || patient.patCurrentMeds,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patCurrentMeds}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patCurrentMeds",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {noEditRoles.includes(currentStaff.role) ? (
                            `${patient.patStatus}`
                          ) : editingField[
                              `${patient.patLastName}_${patient.id}`
                            ]?.patStatus ? (
                            <>
                              <select
                                defaultValue={patient.patStatus}
                                onChange={(e) =>
                                  handleInputChange(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patStatus",
                                    e.target.value,
                                  )
                                }
                                className="rounded border px-2 py-1"
                              >
                                <option value="in-patient">in-patient</option>
                                <option value="out-patient">out-patient</option>
                                <option value="discharged">discharged</option>
                              </select>
                              <button
                                onClick={() =>
                                  updatePatientField(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patStatus",
                                    editingField[
                                      `${patient.patLastName}_${patient.id}`
                                    ]?.patStatus || patient.patStatus,
                                  )
                                }
                                className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                              >
                                Update
                              </button>
                            </>
                          ) : (
                            <>
                              {patient.patStatus}
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    `${patient.patLastName}_${patient.id}`,
                                    "patStatus",
                                  )
                                }
                                className="ml-2 text-sm text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr colSpan="1">
                      <td>No patients found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded bg-gray-200 px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Additional Content */}
      {currentPat && (
        <div className="flex w-screen justify-center">
          <div className="mb-8 w-max self-center">
            {currentStaff.role === "Doctor" ? (
              <DocPatFile
                ref={patFileRef}
                patient={patList.find((pat) => pat.patLastName === currentPat)}
              />
            ) : currentStaff.role === "Accountant" ? (
              <AcctPatFile
                ref={patFileRef}
                patient={patList.find((pat) => pat.patLastName === currentPat)}
              />
            ) : currentStaff.role === "Nurse" ? (
              <NursePatFile
                ref={patFileRef}
                patient={patList.find((pat) => pat.patLastName === currentPat)}
              />
            ) : (
              <PatFile
                ref={patFileRef}
                patient={patList.find((pat) => pat.patLastName === currentPat)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Patients;
