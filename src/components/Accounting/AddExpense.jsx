import { useAcct } from "../../contexts/AcctContext";

function AddExpense() {
  const { handleSubmitExpense, setExpense } = useAcct();

  return (
    <div className="rounded-lg bg-red-100 p-4 shadow">
      <h2 className="mb-2 font-semibold text-red-600">Log Expense</h2>
      <input
        type="text"
        placeholder="Category"
        className="mb-2 w-full rounded border p-2"
        onChange={(e) =>
          setExpense((prev) => ({
            ...prev,
            category: e.target.value,
          }))
        }
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full rounded border p-2"
        onChange={(e) =>
          setExpense((prev) => ({
            ...prev,
            amount: e.target.value,
          }))
        }
      />
      <button
        className="mt-3 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
        onClick={handleSubmitExpense}
      >
        Add Expense
      </button>
    </div>
  );
}

export default AddExpense;
