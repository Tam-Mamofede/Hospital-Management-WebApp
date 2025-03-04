import { useState } from "react";
import { useLab } from "../../contexts/LabContext";
import AddTest from "./AddTest";
import NavBar from "../NavBar";
import { useAuth } from "../../contexts/AuthContext";
function AllTests() {
  const { updateItem, testList, deleteItem } = useLab();
  const { currentStaff } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Filter and paginate items
  const filteredItems = testList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
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
    <div>
      <NavBar />
      <div className="mt-4 flex flex-col px-8 py-4">
        <div className="my-2">
          <h2 className="mb-2 ml-2 text-lg font-bold">Search for a test</h2>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-1/5 rounded-lg border border-gray-300 px-4 py-1 shadow focus:outline-none"
          />
        </div>
        {currentStaff.role !== "Admin" && currentStaff.role !== "Lab" ? null : (
          <div className="my-8">
            <h2 className="mb-2 text-lg font-normal">Add a test to the list</h2>{" "}
            <AddTest />
          </div>
        )}
        <div
          className={`space-y-4 self-center ${
            currentStaff.role !== "Admin" && currentStaff.role !== "Lab"
              ? "w-4/6"
              : "w-full"
          }`}
        >
          <h2 className="w-full pb-4 text-center text-2xl font-bold text-stone-800">
            Available Tests
          </h2>
          <table className="w-full border-collapse border border-blue-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                {currentStaff.role !== "Admin" &&
                currentStaff.role !== "Lab" ? null : (
                  <th className="border p-2">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className={`text-center ${item.expired ? "bg-red-300" : ""}`}
                >
                  <td className="border p-2">
                    {currentStaff.role !== "Admin" &&
                    currentStaff.role !== "Lab" ? (
                      `${item.name}`
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                        className="w-full border p-1"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    {currentStaff.role !== "Admin" &&
                    currentStaff.role !== "Lab" ? (
                      `${item.price}`
                    ) : (
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", e.target.value)
                        }
                        className="w-full border p-1"
                      />
                    )}
                  </td>
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Lab" ? null : (
                    <td className="border p-2">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AllTests;
