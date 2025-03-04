import { useState } from "react";
import { usePharm } from "../../contexts/PharmContext";
import NavBar from "../NavBar";
import { useAuth } from "../../contexts/AuthContext";

function PharmInventory() {
  const {
    deleteItem,
    newItem,
    setNewItem,
    items,
    addItem,
    updateItem,
    loading,
  } = usePharm();
  const { currentStaff } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const filteredItems = items.filter((item) =>
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
      <div className="px-8 py-4">
        <h2 className="my-8 text-center text-2xl font-extrabold uppercase text-blue-900">
          Pharmacy Inventory
        </h2>
        <div className="my-2">
          <h2 className="mb-2 text-lg font-bold">Search for an item</h2>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-1/5 rounded-lg border border-gray-300 px-4 py-1 shadow focus:outline-none"
          />
        </div>

        {currentStaff.role !== "Admin" &&
        currentStaff.role !== "Pharmacist" ? null : (
          <>
            <h2 className="text-lg font-bold">Add an item</h2>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Name"
                className="rounded-xl border border-blue-900 p-2"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="rounded-xl border border-blue-900 p-2"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Item Code"
                className="rounded-xl border border-blue-900 p-2"
                value={newItem.code}
                onChange={(e) =>
                  setNewItem({ ...newItem, code: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                className="rounded-xl border border-blue-900 p-2"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Expiration Date"
                className="rounded-xl border border-blue-900 p-2"
                value={newItem.expiration}
                onChange={(e) =>
                  setNewItem({ ...newItem, expiration: e.target.value })
                }
              />
              <button
                disabled={loading}
                onClick={addItem}
                className="rounded-xl bg-blue-500 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
          </>
        )}
        <table className="w-full border-collapse border border-blue-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-2">Item Code</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Expiration Date</th>
              {currentStaff.role !== "Admin" &&
              currentStaff.role !== "Pharmacist" ? null : (
                <th className="border p-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Pharmacist" ? (
                    `${item.code}`
                  ) : (
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) =>
                        updateItem(item.id, "code", e.target.value)
                      }
                      className="border p-1"
                    />
                  )}
                </td>

                <td className="border p-2">
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Pharmacist" ? (
                    `${item.name}`
                  ) : (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      className="border p-1"
                    />
                  )}
                </td>

                <td className="border p-2">
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Pharmacist" ? (
                    `${item.price}`
                  ) : (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                      className="border p-1"
                    />
                  )}
                </td>
                <td className="border p-2">
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Pharmacist" ? (
                    `${item.quantity}`
                  ) : (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value)
                      }
                      className="border p-1"
                    />
                  )}
                </td>
                <td className="border p-2">
                  {currentStaff.role !== "Admin" &&
                  currentStaff.role !== "Pharmacist" ? (
                    `${item.expiration}`
                  ) : (
                    <input
                      type="date"
                      style={{
                        backgroundColor: item.expired ? "red" : "transparent",
                        color: item.expired ? "white" : "black",
                      }}
                      value={item.expiration}
                      onChange={(e) =>
                        updateItem(item.id, "expiration", e.target.value)
                      }
                      className="border p-1"
                    />
                  )}
                </td>
                {currentStaff.role !== "Admin" &&
                currentStaff.role !== "Pharmacist" ? null : (
                  <td className="border p-2">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
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

export default PharmInventory;
