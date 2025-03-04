/* eslint-disable react/prop-types */

import { useCallback, useEffect, useState } from "react";
import { useAcct } from "../../contexts/AcctContext";
import { usePharm } from "../../contexts/PharmContext";
import { useAuth } from "../../contexts/AuthContext";

function AddBillPharm({ patientId }) {
  const { setPharmBillingForPat, setBill, fetchPatientBillings } = useAcct();
  const {
    items,
    handleSell,
    handleSelectItem,
    handleQuantityChange,
    totalPrice,
    selectedItems,
    setSalePrice,
    setSelectedItems,
  } = usePharm();
  const { currentStaff } = useAuth();

  const [clicked, setClicked] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleBillAndSell = useCallback(() => {
    handleSell();
    fetchPatientBillings(patientId);
  }, [handleSell, fetchPatientBillings, patientId]);

  const handleSelection = useCallback(
    (itemId) => {
      if (!itemId) return;

      const selectedItem = handleSelectItem(itemId);
      if (selectedItem) {
        setBill((prev) => ({
          ...prev,
          item: selectedItem.name,
          itemCode: selectedItem.code,
          quantity: selectedItem.quantityToSell,
          amt: selectedItem.price,
          date: today,
          staffRole: currentStaff.role,
        }));
      }
    },
    [currentStaff, handleSelectItem, setBill, today],
  );
  ///////////////////////
  const handleQuantityChangeAndBill = (id, quantity) => {
    handleQuantityChange(id, quantity);

    const updatedItem = selectedItems.find((item) => item.id === id);
    if (updatedItem) {
      setBill((prev) => ({
        ...prev,
        quantity: quantity,
        amt: updatedItem.price * quantity,
      }));
    }
  };
  ///////////////////////////
  const handleDeleteItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };
  //////////////////////////////
  useEffect(() => {
    console.log("Updated Selected Items:", selectedItems);
    setSalePrice(
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantityToSell,
        0,
      ),
    );
  }, [selectedItems]);

  return (
    <div>
      <div className="my-6 flex flex-col space-y-5">
        <h1 className="text-lg font-bold text-stone-900">
          Select items to bill
        </h1>
        <select
          onChange={(e) => handleSelection(e.target.value)}
          className="w-1/6 rounded-2xl border bg-gray-400 bg-opacity-10 p-2 px-4"
          defaultValue=""
        >
          <option value="" disabled className="font-bold text-stone-900">
            Choose an item
          </option>
          {items
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Stock: {item.quantity}) [{item.code}]
              </option>
            ))}
        </select>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h2 className="text-md font-bold text-stone-900">Selected Items</h2>
          {selectedItems.map((item) => (
            <div key={item.id} className="mt-2 space-y-2 border p-2">
              <p>Name: {item.name}</p>
              <p>Price: {item.price}</p>
              <p>Stock: {item.quantity}</p>
              <label>Quantity to Bill:</label>
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={item.quantityToSell}
                onChange={(e) =>
                  handleQuantityChangeAndBill(
                    item.id,
                    Math.min(e.target.value, item.quantity),
                  )
                }
                className="w-16 rounded-lg border p-1"
              />
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="mx-6 rounded-2xl bg-red-500 p-1 px-4 text-white"
              >
                Delete
              </button>
            </div>
          ))}
          <p className="mt-4 text-lg font-bold">Total Price: {totalPrice}</p>
        </div>
      )}

      <button
        className="my-4 w-1/6 rounded-md bg-blue-500 px-4 py-2 text-white disabled:cursor-wait disabled:bg-gray-400"
        disabled={clicked}
        onClick={async () => {
          setClicked(true);
          try {
            await setPharmBillingForPat(patientId, selectedItems);
            handleBillAndSell();
          } catch (error) {
            console.error("Error submitting bill:", error);
          } finally {
            setClicked(false);
          }
        }}
      >
        <p> Add item(s) to bill</p>
      </button>
    </div>
  );
}

export default AddBillPharm;
