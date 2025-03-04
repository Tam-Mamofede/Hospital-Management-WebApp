import { useNavigate } from "react-router";
import { usePatientData } from "../contexts/PatientDataContext";
import NavBar from "../components/NavBar";
import { useState } from "react";
import DocAppointments from "../components/Doctor/DocAppointments";
import DocPatFile from "../components/Doctor/DocPatFile";

function DocDashboard() {
  const navigate = useNavigate();
  const { handleNavPats, handleAddPat, currentPat, patList } = usePatientData();

  const [showAppointments, setShowAppointments] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

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
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={() => navigate("/tests")}
                >
                  View All Tests
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
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={() => navigate("/pharmacy")}
                >
                  View Inventory
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
              <img src="./app-icon.png" className="h-[120px]" />
              <h1 className="text-2xl font-bold">Appointments</h1>
            </div>
            {activeCard === "card-4" && (
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  className="w-[330px] rounded-lg bg-blue-100 px-4 py-2 font-bold text-blue-900 hover:bg-blue-200"
                  onClick={() => setShowAppointments(!showAppointments)}
                >
                  See Appointments
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Extra Content */}
        {showAppointments && (
          <div className="my-4 w-4/5">
            <DocAppointments />
          </div>
        )}

        {currentPat && (
          <DocPatFile
            patient={patList.find((pat) => pat.patLastName === currentPat)}
          />
        )}
      </div>
      {/* )} */}
    </>
  );
}

export default DocDashboard;
