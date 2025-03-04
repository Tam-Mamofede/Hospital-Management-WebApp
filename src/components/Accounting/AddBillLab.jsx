/* eslint-disable react/prop-types */

import { useCallback, useState } from "react";
import { useAcct } from "../../contexts/AcctContext";
import Invoice from "./Invoice";
import { useLab } from "../../contexts/LabContext";
import { useAuth } from "../../contexts/AuthContext";

function AddBillLab({ patientId }) {
  const { setLabBillingForPat, setBill } = useAcct();
  const { testList, handleSelectItem } = useLab();
  const { currentStaff } = useAuth();

  const [clicked, setClicked] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSelection = useCallback(
    (itemId) => {
      if (!itemId) return;

      const selectedItem = handleSelectItem(itemId);
      if (selectedItem) {
        setBill((prev) => ({
          ...prev,
          name: selectedItem.name,
          price: selectedItem.price,
          date: today,
          staffRole: currentStaff.role,
        }));
      }
    },
    [handleSelectItem, setBill],
  );

  return (
    <div>
      {" "}
      <div className="my-6 flex flex-col space-y-5">
        <h1 className="text-lg font-bold text-stone-900">
          Select tests to bill
        </h1>
        <select
          onChange={(e) => handleSelection(e.target.value)}
          className="w-1/6 rounded-2xl border bg-gray-400 bg-opacity-10 p-2 px-4"
          defaultValue=""
        >
          <option value="" disabled className="font-bold text-stone-900">
            Choose an item
          </option>
          {testList
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((test) => (
              <option key={test.id} value={test.id}>
                {test.name} - {test.price}
              </option>
            ))}
        </select>
        <button
          className="my-4 w-1/6 rounded-md bg-blue-500 px-4 py-2 text-white disabled:cursor-wait disabled:bg-gray-400"
          disabled={clicked}
          onClick={async () => {
            setClicked(true);
            try {
              await setLabBillingForPat(patientId);
            } catch (error) {
              console.error("Error submitting bill:", error);
            } finally {
              setClicked(false);
            }
          }}
        >
          Add test to bill
        </button>

        {/* <Invoice /> */}
        <Invoice patientId={patientId} />
      </div>
    </div>
  );
}

export default AddBillLab;
