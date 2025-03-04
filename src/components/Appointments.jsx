/* eslint-disable react/prop-types */
import { useAppointment } from "../contexts/AppointmentContext";
import { useAuth } from "../contexts/AuthContext";
import { useStaffData } from "../contexts/StaffContext";
import Loader from "./Loader";

const AppointmentBooking = ({ patientId }) => {
  const {
    availableTimes,
    handleSubmit,
    handleTimeChange,
    selectedDate,
    selectedTime,
    message,
    handleDateChange,
    selectedDoctor,
    setSelectedDoctor,
  } = useAppointment();
  const { isLoading } = useAuth();

  const { docList } = useStaffData();

  const handleSelectDoctor = (e) => {
    setSelectedDoctor(e.target.value);
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border-2 border-gray-100 px-4 pb-6 shadow-lg">
      <h2 className="my-4 text-2xl font-semibold">Book a consultation</h2>

      <form onSubmit={(e) => handleSubmit(e, patientId)} className="space-y-4">
        {isLoading ? (
          <div className="h-full w-full">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              <label
                htmlFor="date"
                className="block text-sm font-bold text-blue-700"
              >
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full rounded-xl border px-4 py-2 focus:outline-none"
                value={selectedDate}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="space-y-4">
              <label
                htmlFor="time"
                className="block text-sm font-bold text-blue-700"
              >
                Select Time
              </label>
              <select
                id="time"
                className="w-full rounded-xl border px-4 py-2 focus:outline-none"
                value={selectedTime}
                onChange={handleTimeChange}
                required
                disabled={!selectedDate}
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <select
                id="doc"
                className="w-full rounded-xl border px-4 py-2"
                value={selectedDoctor}
                onChange={handleSelectDoctor}
              >
                <option value="">Select a doctor</option>
                {docList.map((doc) => (
                  <option value={doc.staffLastName} key={doc.staffLastName}>
                    {`${doc.staffLastName} ${doc.staffFirstName}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="my-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 px-4 py-2 text-white"
          >
            Book Appointment
          </button>
        </div>
      </form>

      {/* Display booking status message */}
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AppointmentBooking;
