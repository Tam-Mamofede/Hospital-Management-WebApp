import { useAcct } from "../../contexts/AcctContext";

function AddIncome() {
  const { handleSubmitIncome, setIncome } = useAcct();

  return (
    <div className="rounded-lg bg-green-100 p-4 shadow">
      <h2 className="mb-2 font-semibold text-green-600">Log Income</h2>
      <input
        type="text"
        placeholder="Source"
        className="mb-2 w-full rounded border p-2"
        onChange={(e) =>
          setIncome((prev) => ({
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
          setIncome((prev) => ({
            ...prev,
            amount: e.target.value,
          }))
        }
      />
      <button
        className="mt-3 w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600"
        onClick={handleSubmitIncome}
      >
        Add Income
      </button>
    </div>
  );
}

export default AddIncome;
