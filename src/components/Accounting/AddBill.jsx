/* eslint-disable react/prop-types */

import { useState } from "react";
import { useAcct } from "../../contexts/AcctContext";

function AddBill({ patientId }) {
  const { setBill, setBillingForPat } = useAcct();

  const [clicked, setClicked] = useState(false);

  return (
    <div className="mx-auto my-6 flex h-full max-w-md flex-col items-center space-y-2 rounded-xl border-2 border-gray-100 px-4 pb-6 shadow-lg">
      <h2 className="my-4 text-2xl font-semibold">Add a bill</h2>
      <div className="flex w-full flex-col space-y-4">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-stone-900">
            What is the bill for?
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border bg-blue-100 px-4 py-2 opacity-65 focus:outline-none"
            onChange={(e) =>
              setBill((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-900">
            Price
          </label>
          <input
            type="number"
            className="w-full rounded-2xl border bg-blue-100 px-4 py-2 opacity-65 focus:outline-none"
            onChange={(e) =>
              setBill((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </div>
        <button
          className="my-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white disabled:cursor-wait disabled:bg-gray-400"
          disabled={clicked}
          onClick={async () => {
            setClicked(true);
            try {
              await setBillingForPat(patientId);
            } catch (error) {
              console.error("Error submitting bill:", error);
            } finally {
              setClicked(false);
            }
          }}
        >
          Submit Bill
        </button>
      </div>
    </div>
  );
}

export default AddBill;
