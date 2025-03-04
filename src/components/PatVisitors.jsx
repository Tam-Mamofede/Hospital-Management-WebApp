/* eslint-disable react/prop-types */
import { useEffect, useState, useTransition } from "react";
import { db } from "../../firebase.config"; // Adjust the path if needed
import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import { useAlert } from "../contexts/AlertContext";

const PatVisitors = ({ patientId }) => {
  const { isLoading, setIsLoading } = useAuth();
  const { showAlert } = useAlert();
  const [isPending, startTransition] = useTransition();

  const [visitors, setVisitors] = useState([]);
  const [visitorDetails, setVisitorDetails] = useState({
    name: "",
    number: "",
    address: "",
    relationship: "",
  });
  const [showAddVisitor, setShowAddVisitor] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const patPerPage = 5;
  const indexOfLastPat = currentPage * patPerPage;
  const indexOfFirstPat = indexOfLastPat - patPerPage;
  const currentVisitors = visitors.slice(indexOfFirstPat, indexOfLastPat);
  const totalPages = Math.ceil(visitors.length / patPerPage);
  const today = new Date().toISOString().split("T")[0];

  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const addVisitor = async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const newVisitor = {
        name: visitorDetails.name.trimEnd(),
        number: visitorDetails.number,
        address: visitorDetails.address.trimEnd(),
        relationship: visitorDetails.relationship.trimEnd(),
        date: today,
      };

      const batch = writeBatch(db);
      const visitorsRef = doc(
        collection(db, `hospital/Hospital info/Patients/${patientId}/Visitors`),
      );
      batch.set(visitorsRef, newVisitor);
      await batch.commit();
      showAlert("Visitor added successfully", "success");
      setShowAddVisitor(false);
    } catch (err) {
      console.error("Error adding visitor:", err);
      showAlert("Failed to add visitor", "error");
    } finally {
      if (isLoading) setIsLoading(false);
      setVisitorDetails({
        name: "",
        number: "",
        address: "",
        relationship: "",
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [visitors]);

  ////////////////////////////////////////////////////

  useEffect(() => {
    if (!patientId) return;

    const visitorsRef = collection(
      db,
      `hospital/Hospital info/Patients/${patientId}/Visitors`,
    );

    const unsubscribe = onSnapshot(visitorsRef, (snapshot) => {
      const visitorList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      startTransition(() => {
        setVisitors((prev) =>
          JSON.stringify(prev) === JSON.stringify(visitorList)
            ? prev
            : visitorList,
        );
      });
    });

    return () => unsubscribe();
  }, [patientId]);

  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <button
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => setShowAddVisitor(true)}
      >
        Add new visitor
      </button>

      <h2 className="mb-4 text-center text-2xl font-bold">Patient Visitors</h2>

      {isLoading ? (
        <Loader />
      ) : currentVisitors.length === 0 ? (
        <p className="text-center text-gray-500">No visitors yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Phone Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Relationship
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {visitor.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {visitor.number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {visitor.address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {visitor.relationship}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {visitor.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    No visitors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* PAGINATION */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded bg-gray-200 px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddVisitor && (
        <div className="mt-4 rounded-lg border p-4">
          <div className="mb-4">
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-300 px-2 pt-2 focus:outline-none"
              placeholder="Visitor's Name"
              value={visitorDetails.name}
              onChange={(e) =>
                setVisitorDetails((prev) => ({
                  ...prev,
                  name: capitalizeWords(e.target.value),
                }))
              }
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-300 px-2 pt-2 focus:outline-none"
              placeholder="Phone Number"
              value={visitorDetails.number}
              onChange={(e) =>
                setVisitorDetails((prev) => ({
                  ...prev,
                  number: e.target.value.trimEnd(),
                }))
              }
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-300 px-2 pt-2 focus:outline-none"
              placeholder="Address"
              value={visitorDetails.address}
              onChange={(e) =>
                setVisitorDetails((prev) => ({
                  ...prev,
                  address: capitalizeWords(e.target.value),
                }))
              }
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-300 px-2 pt-2 focus:outline-none"
              placeholder="Relationship"
              value={visitorDetails.relationship}
              onChange={(e) =>
                setVisitorDetails((prev) => ({
                  ...prev,
                  relationship: capitalizeWords(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex justify-between">
            <button
              className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={addVisitor}
            >
              Submit
            </button>{" "}
            <button
              className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={() => setShowAddVisitor(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatVisitors;
