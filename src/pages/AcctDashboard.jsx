import { NavLink } from "react-router";
import { usePatientData } from "../contexts/PatientDataContext";
import NavBar from "../components/NavBar";
import { useState } from "react";
import Finance from "../components/Finance";

function AcctDashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const [showFinances, setShowFinances] = useState(false);

  const { handleNavPats, handleAddPat } = usePatientData();

  const handleCardClick = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  return (
    <>
      {/* NavBar */}
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center overflow-auto p-6">
        <div className="my-6 mt-24 flex w-screen justify-center gap-20">
          {/* Card 1 */}
          <div className="flex flex-col items-center">
            <div
              className="flex h-[200px] w-[350px] flex-col items-center justify-center space-y-4 rounded-lg bg-blue-200 p-6 shadow-md hover:cursor-pointer"
              onClick={() => handleCardClick("card-1")}
            >
              <img src="./pat-icon.png" className="h-[120px]" />
              <h1 className="text-2xl font-bold">Patients</h1>
            </div>
            {activeCard === "card-1" && (
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={handleNavPats}
                >
                  View All Patients
                </button>
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={handleAddPat}
                >
                  Add Patient
                </button>
              </div>
            )}
          </div>
          {/* Card 2 */}
          <div className="flex flex-col items-center">
            <div
              className="flex h-[200px] w-[350px] flex-col items-center justify-center space-y-4 rounded-lg bg-blue-200 p-6 shadow-md hover:cursor-pointer"
              onClick={() => handleCardClick("card-2")}
            >
              <img src="./lab-icon.png" className="h-[120px]" />
              <h1 className="text-2xl font-bold">Lab</h1>
            </div>
            {activeCard === "card-2" && (
              <div className="mt-4 flex flex-col space-y-2">
                <button className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200">
                  <NavLink to="/tests"> View All Tests</NavLink>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="my-6 flex w-screen justify-center gap-20">
          {/* Card 3 */}
          <div className="flex flex-col items-center">
            <div
              className="flex h-[200px] w-[350px] flex-col items-center justify-center space-y-4 rounded-lg bg-blue-200 p-6 shadow-md hover:cursor-pointer"
              onClick={() => handleCardClick("card-3")}
            >
              <img src="./pharm-icon.png" className="h-[120px]" />
              <h1 className="text-2xl font-bold">Pharmacy</h1>
            </div>
            {activeCard === "card-3" && (
              <div className="mt-4 flex flex-col space-y-2">
                <button className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200">
                  <NavLink to="/pharmacy">View Inventory</NavLink>
                </button>
              </div>
            )}
          </div>
          {/* Card 4 */}
          <div className="flex flex-col items-center">
            <div
              className="flex h-[200px] w-[350px] flex-col items-center justify-center space-y-4 rounded-lg bg-blue-200 p-6 shadow-md hover:cursor-pointer"
              onClick={() => handleCardClick("card-4")}
            >
              <img src="./acct-icon.png" className="h-[120px]" />
              <h1 className="text-2xl font-bold">Finance</h1>
            </div>
            {activeCard === "card-4" && (
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={() => setShowFinances(!showFinances)}
                >
                  See Finances
                </button>
              </div>
            )}
          </div>
        </div>
        <div>{showFinances && <Finance />}</div>
      </div>
    </>
  );
}

export default AcctDashboard;
