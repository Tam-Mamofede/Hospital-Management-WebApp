/* eslint-disable react/prop-types */
import { useState } from "react";
import { useConsultation } from "../../contexts/ConsultationContext";
import { useLab } from "../../contexts/LabContext";
import { useAlert } from "../../contexts/AlertContext";

function AddConsultation({ patientId }) {
  const [loading, setLoading] = useState(false);

  const {
    submitConNotes,
    conNotes,
    setConNotes,
    conPrescription,
    setConPrescription,
    setConTests,
    conProcedure,
    setConProcedure,
  } = useConsultation();
  const { testList } = useLab();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitConNotes(patientId);
      setConNotes("");
      setConPrescription("");
      setConTests("");

      showAlert("Consultation notes submitted", "success");
    } catch (error) {
      console.error("Failed to update consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-bold">Update Consultation</h2>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Consultation Notes
        </label>
        <textarea
          id="notes"
          value={conNotes}
          onChange={(e) => setConNotes(e.target.value)}
          className="w-full rounded-lg border p-2 focus:outline-none"
          rows="4"
          placeholder="Add consultation notes..."
          required
        />
      </div>
      <div>
        <label htmlFor="prescription" className="block text-sm font-medium">
          Prescription
        </label>
        <textarea
          id="prescription"
          value={conPrescription}
          onChange={(e) => setConPrescription(e.target.value)}
          className="w-full rounded-lg border p-2 focus:outline-none"
          rows="2"
          placeholder="Add prescriptions..."
        />
      </div>
      <div>
        <label htmlFor="tests" className="block text-sm font-medium">
          Tests
        </label>
        <select onChange={(e) => setConTests(e.target.value)}>
          <option value=""> Choose test</option>
          {testList.map((test) => (
            <option key={test.id} value={test.name}>
              {test.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tests" className="block text-sm font-medium">
          Procedures / Surgery
        </label>
        <textarea
          id="tests"
          value={conProcedure}
          onChange={(e) => setConProcedure(e.target.value)}
          className="w-full rounded-lg border p-2 focus:outline-none"
          rows="2"
          placeholder="Add recommended procedure/surgery..."
        />
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-lg bg-blue-500 px-4 py-2 text-white ${
          loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Saving..." : "Save Consultation"}
      </button>
    </form>
  );
}

export default AddConsultation;
