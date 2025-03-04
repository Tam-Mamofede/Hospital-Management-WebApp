import { useAcct } from "../contexts/AcctContext";
import AddExpense from "./Accounting/AddExpense";
import AddIncome from "./Accounting/AddIncome";
import Transactions from "./Accounting/Transactions";

function Finance() {
  const { monthList, allExp, allIncome, handleSelectMonth } = useAcct();

  const totalExpenses = allExp.reduce(
    (total, item) => total + Number(item.expenseAmount),
    0,
  );

  const totalIncome = allIncome.reduce(
    (total, item) => total + Number(item.incomeAmount),
    0,
  );

  return (
    <div className="inset-0 flex items-center justify-center rounded-xl border-2 shadow-lg">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Company Finance Tracker
        </h1>

        {/* Month Selector */}
        <div className="mb-6">
          <label className="mb-2 block font-semibold text-gray-600">
            Select Month
          </label>
          <select
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            onChange={handleSelectMonth}
          >
            {monthList.map((month) => (
              <option value={month} key={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Income & Expense Inputs */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <AddIncome />
          </div>
          <div>
            <AddExpense />
          </div>
        </div>

        {/* Finance Summary */}
        <div className="mb-6 rounded-lg bg-blue-100 p-4 shadow">
          <h2 className="font-semibold text-blue-600">Summary</h2>
          <p className="mt-2 text-gray-700">
            Total Income:{" "}
            <span className="font-bold">N{totalIncome.toFixed(2)}</span>
          </p>
          <p className="text-gray-700">
            Total Expenses:{" "}
            <span className="font-bold">N{totalExpenses.toFixed(2)}</span>
          </p>
        </div>

        <div>
          <Transactions />
        </div>
      </div>
    </div>
  );
}

export default Finance;
