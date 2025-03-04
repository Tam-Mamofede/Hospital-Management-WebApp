import { usePharm } from "../../contexts/PharmContext";

function SellMeds() {
  const {
    items,
    handleSelectItem,
    handleQuantityChange,
    handleSell,
    selectedItems,
  } = usePharm();

  return (
    <div>
      <h1 className="text-lg font-extrabold">Select items to sell</h1>

      {/* Item Selection */}
      <label>Select Item</label>
      <select onChange={handleSelectItem} className="border p-2">
        <option value="">Choose an item</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (Stock: {item.quantity})
          </option>
        ))}
      </select>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h2 className="text-md font-bold">Selected Items</h2>
          {selectedItems.map((item) => (
            <div key={item.id} className="mt-2 border p-2">
              <p>Name: {item.name}</p>
              <p>Price: {item.price}</p>
              <p>Stock: {item.quantity}</p>
              <label>Quantity to Sell:</label>
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={item.quantityToSell}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className="w-16 border p-1"
              />
            </div>
          ))}

          <button
            onClick={() => handleSell()}
            className="mt-2 bg-green-500 p-2 text-white"
          >
            Sell
          </button>
        </div>
      )}
    </div>
  );
}

export default SellMeds;
