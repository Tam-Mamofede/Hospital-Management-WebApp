import { useState } from "react";
import { useStaffData } from "../contexts/StaffContext";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
function StaffList() {
  const {
    staffList,
    handleEdit,
    handleSave,
    editingField,
    inputValue,
    setInputValue,
    filteredStaff,
    setFilteredStaff,
    filterRole,
    setFilterRole,
  } = useStaffData();
  const { isLoading } = useAuth();

  const listToDisplay = filteredStaff.length > 0 ? filteredStaff : staffList;

  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 5;

  // Calculate pagination values
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaffList = listToDisplay.slice(
    indexOfFirstStaff,
    indexOfLastStaff,
  );

  const totalPages = Math.ceil(listToDisplay.length / staffPerPage);

  const filterStaffByRole = (role) => {
    setFilterRole(role);
    if (role === "") {
      setFilteredStaff(staffList);
    } else {
      setFilteredStaff(staffList.filter((staff) => staff.role === role));
    }
  };

  return (
    <>
      <NavBar />

      <div className="mb-8 flex flex-col">
        {/* FILTER */}
        <div className="mr-48 mt-12 self-end">
          <label className="mr-2 font-semibold">Filter by Role:</label>
          <select
            value={filterRole}
            onChange={(e) => filterStaffByRole(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">All Roles</option>
            {staffList.map((staff) => (
              <option
                value={staff.role}
                key={`${staff.staffLastName}_${staff.staffFirstName}`}
              >
                {staff.role}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}

        <div className="mx-auto mt-10 w-4/5 rounded-lg bg-gray-50 p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Hospital Staff
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full border-collapse bg-white text-sm text-gray-700 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "Last Name",
                    "First Name",
                    "Gender",
                    "Emergency Contact",
                    "Emergency Contact Number",
                    "Role",
                    "Payment Type",
                    "Salary",
                  ].map((header) => (
                    <th key={header} className="p-3 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <Loader />
                ) : (
                  currentStaffList.map((staff, index) => (
                    <tr
                      key={staff.id}
                      className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
                    >
                      {["staffLastName", "staffFirstName", "gender"].map(
                        (field) => (
                          <td key={field} className="p-3">
                            {staff[field]}
                          </td>
                        ),
                      )}
                      {[
                        "staffEmergencyContactName",
                        "staffEmergencyContactNumber",
                        "role",
                        "paymentType",
                        "salary",
                      ].map((field) => (
                        <td key={field} className="p-3">
                          {editingField?.staffId === staff.id &&
                          editingField?.field === field ? (
                            <>
                              {field === "paymentType" ? (
                                <select
                                  className="w-full rounded border p-2"
                                  value={inputValue}
                                  onChange={(e) =>
                                    setInputValue(e.target.value)
                                  }
                                  onBlur={() => handleSave(staff.id)}
                                  autoFocus
                                >
                                  <option value="">-- Select --</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Weekly">Weekly</option>
                                  <option value="Bi-Annually">
                                    Bi-Annually
                                  </option>
                                  <option value="Annually">Annually</option>
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  className="w-full rounded border p-2"
                                  value={inputValue}
                                  onChange={(e) =>
                                    setInputValue(e.target.value)
                                  }
                                  onBlur={() => handleSave(staff.id)}
                                  autoFocus
                                />
                              )}
                            </>
                          ) : (
                            <span
                              onClick={() =>
                                handleEdit(staff.id, field, staff[field])
                              }
                              className="cursor-pointer hover:text-blue-600"
                            >
                              {staff[field] || "Click to edit"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
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
    </>
  );
}

export default StaffList;
