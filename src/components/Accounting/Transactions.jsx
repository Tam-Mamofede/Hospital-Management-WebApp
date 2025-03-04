import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader";
import { useAcct } from "../../contexts/AcctContext";

const Transactions = () => {
  const { curMonth, isLoading } = useAuth();
  const { allExp, allIncome } = useAcct();

  const allList = [...allExp, ...allIncome];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const filteredItems = allList
    .filter((item) => {
      const category =
        item.label === "expense" ? item.expenseCategory : item.incomeCategory;

      return (
        category && category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds
        ? new Date(a.createdAt.seconds * 1000)
        : new Date(0);
      const dateB = b.createdAt?.seconds
        ? new Date(b.createdAt.seconds * 1000)
        : new Date(0);

      return dateB - dateA;
    });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedTrans = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination Controls
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when the data changes
  }, [allExp, allIncome, curMonth]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="my-2">
            <h2 className="mb-2 text-lg font-normal">
              Search for a transaction
            </h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-1/5 rounded-lg border border-gray-300 px-4 py-1 shadow focus:outline-none"
            />
          </div>

          <h2 className="mb-2 font-semibold text-gray-700">
            Transaction History for {curMonth}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrans ? (
                  paginatedTrans.map((trans, index) => (
                    <tr key={index}>
                      <td
                        className={`border p-2 text-center text-red-600 ${trans.label === "income" ? "text-green-600" : ""}`}
                      >
                        {trans.label === "expense" ? "Expense" : "Income"}
                      </td>
                      <td className="border p-2 text-center">
                        {trans.label == "expense"
                          ? trans.expenseCategory
                          : trans.incomeCategory}
                      </td>
                      <td className="border p-2 pl-4 text-left font-bold">
                        N
                        {trans.label == "expense"
                          ? Number(trans.expenseAmount).toFixed(2)
                          : Number(trans.incomeAmount).toFixed(2)}
                      </td>
                      <td className="border p-2 text-center">
                        {trans.createdAt?.seconds
                          ? new Date(
                              trans.createdAt.seconds * 1000,
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Could not find any transactions</td>
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
      )}
    </div>
  );
};

Transactions.displayName = "Transactions";

export default Transactions;
