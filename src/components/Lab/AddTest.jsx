import { useLab } from "../../contexts/LabContext";

function AddTest() {
  const { newItem, setNewItem, addItem } = useLab();

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Name"
        className="rounded-2xl border px-4 opacity-90 focus:outline-none"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        className="rounded-2xl border px-4 opacity-90 focus:outline-none"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      />

      <button
        onClick={addItem}
        className="my-4 rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Add
      </button>
    </div>
  );
}

export default AddTest;
