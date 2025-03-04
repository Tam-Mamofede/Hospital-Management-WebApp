import { useState } from "react";
import { useAcct } from "../../contexts/AcctContext";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader";

function Expense() {
  const [showFilter, setShowFilter] = useState(false);
  const [filterTxt, setFilterTxt] = useState("");

  const { allExp } = useAcct();
  const { curMonth, isLoading } = useAuth();

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
    if (showFilter) setFilterTxt("");
  };

  const filteredExpenses = allExp.filter((exp) =>
    filterTxt ? exp.expenseCategory.includes(filterTxt) : true,
  );

  const totalExpense = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.expenseAmount),
    0,
  );

  const uniqueCategories = [
    ...new Set(allExp.map((exp) => exp.expenseCategory)),
  ];

  return (
    <div className="w-4/5 rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-lg font-bold text-blue-800">
        Expenses for {curMonth}
      </h1>
      <button
        onClick={toggleFilter}
        className={`mt-3 rounded-lg px-4 py-2 text-white ${showFilter ? "bg-blue-400" : "bg-blue-500"}`}
      >
        {showFilter ? "Remove Filter" : "Filter Expenses"}
      </button>

      {showFilter && (
        <div className="mt-3">
          <select
            onChange={(e) => setFilterTxt(e.target.value)}
            className="w-full rounded-md border p-2"
            value={filterTxt}
          >
            <option value="">-- Select a Category --</option>
            {uniqueCategories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse rounded-md border shadow-sm">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  <Loader />
                </td>
              </tr>
            ) : filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp, index) => (
                <tr
                  key={index}
                  className="bg-blue-50 text-center even:bg-blue-100"
                >
                  <td className="border px-4 py-2">
                    {exp.createdAt?.seconds
                      ? new Date(
                          exp.createdAt.seconds * 1000,
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{exp.expenseCategory}</td>
                  <td className="border px-4 py-2">{exp.expenseAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-blue-800">
        Your total expense for {curMonth} is{" "}
        <span className="text-red-500">{totalExpense}</span>
      </h2>
    </div>
  );
}

export default Expense;
