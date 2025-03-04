import { useState } from "react";
import { useAcct } from "../../contexts/AcctContext";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader";

function Income() {
  const [showFilter, setShowFilter] = useState(false);
  const [filterTxt, setFilterTxt] = useState("");

  const { allIncome } = useAcct();
  const { curMonth } = useAuth();

  const toggleFilter = () => {
    if (!showFilter) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
      setFilterTxt("");
    }
  };

  const filteredIncome = allIncome.filter((inc) => {
    const matchesCategory = filterTxt
      ? inc.incomeCategory.includes(filterTxt)
      : true;

    return matchesCategory;
  });

  const totalIncome = allIncome.reduce(
    (sum, inc) => sum + Number(inc.incomeAmount),
    0,
  );

  const uniqueCategories = [
    ...new Set(allIncome.map((inc) => inc.incomeCategory)),
  ];

  return (
    <div className="space-x-3 space-y-3 p-4">
      <h1 className="text-lg font-bold">Income for {curMonth}</h1>
      <button
        onClick={toggleFilter}
        className={`border-1 my-3 rounded-2xl bg-blue-300 ${showFilter && "bg-slate-200"}`}
      >
        {showFilter ? "Remove Filter" : "Filter Income"}
      </button>

      {showFilter && (
        <div className="space-y-3">
          {/* Category Filter */}
          <select
            onChange={(e) => setFilterTxt(e.target.value)}
            className="rounded-lg border px-2 py-1"
            value={filterTxt}
          >
            <option value="">Select a Category</option>
            {uniqueCategories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      <table className="mt-4 w-full table-fixed border-collapse rounded-lg border">
        {/* Table Header */}
        <thead className="bg-[#e3f0af] text-sm text-[#1f4529]">
          <tr>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Amount</th>
          </tr>
        </thead>

        {/* Table Body */}

        <tbody>
          {filteredIncome.length > 0 ? (
            filteredIncome.map((inc, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">
                  {inc.createdAt?.seconds
                    ? new Date(
                        inc.createdAt.seconds * 1000,
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{inc.incomeCategory}</td>
                <td className="border px-4 py-2">{inc.incomeAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border px-4 py-2 text-center">
                <Loader />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="mt-4 text-xl font-semibold">
        Your total income for {curMonth} is {totalIncome}
      </h2>
    </div>
  );
}

export default Income;
