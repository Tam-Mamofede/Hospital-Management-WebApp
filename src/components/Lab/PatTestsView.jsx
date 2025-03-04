import { useConsultation } from "../../context/ConsultationContext";

function PatTestsView() {
  const { patConsultation } = useConsultation();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Prescribed Tests</h2>
      {patConsultation.length > 0 ? (
        patConsultation.map((consultation) => (
          <div key={consultation.id} className="mb-2 border-b pb-2">
            <h3 className="font-semibold">
              Date: {consultation.date} by Dr. {consultation.attendingDoc}
            </h3>
            <p>Notes: {consultation.notes}</p>
            <p className="text-blue-600">
              Tests: {consultation.tests || "None"}
            </p>
          </div>
        ))
      ) : (
        <p>No tests prescribed for this patient yet.</p>
      )}
    </div>
  );
}

export default PatTestsView;
