import NavBar from "../components/NavBar";
import { usePatientData } from "../contexts/PatientDataContext";
import { useStaffData } from "../contexts/StaffContext";

function PatientReg() {
  const { handleSubmit, submitData, register, errors } = usePatientData();
  const { docList } = useStaffData();

  return (
    <>
      <NavBar />
      <div className="container mx-auto my-10 max-w-3xl rounded-xl bg-blue-50 p-6 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-800">
          Register Patient
        </h1>
        <form onSubmit={handleSubmit(submitData)} className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Emergency */}
            <select className="input-field" {...register("emergency")}>
              <option value="">Emergency?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {/* Status */}
            <select
              type="text"
              className="input-field"
              {...register("patStatus")}
            >
              <option value="">Patient Status</option>
              <option value="in-patient">in-patient</option>
              <option value="out-patient">out-patient</option>
              <option value="discharged">discharged</option>
            </select>
            <select className="input-field" {...register("healthIns")}>
              <option value="">Does the Patient have health insurance?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {/* First Name */}
            <input
              placeholder="First Name *"
              className="input-field"
              {...register("patFirstName")}
            />{" "}
            {errors.patFirstName && <span>{errors.patFirstName.message}</span>}
            {/* Last Name */}
            <input
              placeholder="Last Name *"
              className="input-field"
              {...register("patLastName")}
            />
            {errors.patLastName && (
              <span className="text-sm text-red-600">
                {errors.patLastName.message}
              </span>
            )}
            {/* Date of Birth */}
            <input
              type="date"
              className="input-field"
              {...register("patDOB")}
            />{" "}
            {errors.patDOB && <span>{errors.patDOB.message}</span>}
            {/* Gender */}
            <select className="input-field" {...register("patGender")}>
              <option value="">Gender *</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>{" "}
            {errors.patGender && <span>{errors.patGender.message}</span>}
            {/* Occupation */}
            <input
              type="text"
              className="input-field"
              placeholder="Occupation"
              {...register("patOccupation")}
            />
            {errors.patOccupation && (
              <span>{errors.patOccupation.message}</span>
            )}
          </div>
          {/* Occupation */}
          <select className="input-field" {...register("patMaritalStatus")}>
            <option value="">Marital Status *</option>
            <option value="married">Married</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>{" "}
          {errors.patMaritalStatus && (
            <span>{errors.patMaritalStatus.message}</span>
          )}
          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number *"
              className="input-field"
              {...register("patPhone")}
            />{" "}
            {errors.patPhone && <span>{errors.patPhone.message}</span>}
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              {...register("patEmail")}
            />{" "}
            {errors.patEmail && <span>{errors.patEmail.message}</span>}
            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              className="input-field"
              {...register("patAddress")}
            />{" "}
            {errors.patAddress && <span>{errors.patAddress.message}</span>}
          </div>
          {/* Emergency Contact */}
          <h2 className="text-xl font-semibold">Emergency Contact</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <input
              placeholder="Contact Name *"
              className="input-field"
              {...register("emergencyContactName")}
            />{" "}
            {errors.emergencyContactName && (
              <span>{errors.emergencyContactName.message}</span>
            )}
            {/* Number */}
            <input
              type="tel"
              placeholder="Contact Number *"
              className="input-field"
              {...register("emergencyContactNumber")}
            />
            {errors.emergencyContactNumber && (
              <span>{errors.emergencyContactNumber.message}</span>
            )}
            {/* Mother's Name */}
            <input
              type="text"
              placeholder="Mother's name"
              className="input-field"
              {...register("patMotherName")}
            />
            {/* Father's Name */}
            <input
              type="text"
              placeholder="Father's name"
              className="input-field"
              {...register("patFatherName")}
            />
          </div>
          {/* Medical Information    */}
          {/* Blood Group */}
          <select className="input-field" {...register("patBloodGroup")}>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
          {errors.patBloodGroup && <span>{errors.patBloodGroup.message}</span>}
          {/* Allergies */}
          <input
            type="text"
            placeholder="Allergies"
            className="input-field"
            {...register("patAllergies")}
          />
          {errors.patAllergies && <span>{errors.patAllergies.message}</span>}
          {/* Existing Medical Conditions */}
          <input
            type="text"
            placeholder="Existing Medical Conditions"
            className="input-field"
            {...register("patMedicalHistory")}
          />
          {errors.patMedicalHistory && (
            <span>{errors.patMedicalHistory.message}</span>
          )}
          {/* Current Medications */}
          <input
            type="text"
            placeholder="Current Medications"
            className="input-field"
            {...register("patCurrentMeds")}
          />
          {errors.patCurrentMeds && (
            <span>{errors.patCurrentMeds.message}</span>
          )}
          {/* Doctor Selection */}
          <select className="input-field" {...register("primaryDoc")}>
            <option value="">Select Primary Doctor</option>
            {docList.map((doc) => (
              <option key={doc.staffLastName} value={doc.staffLastName}>
                {`${doc.staffLastName} ${doc.staffFirstName}`}
              </option>
            ))}
          </select>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-2/5 rounded-lg bg-blue-500 py-3 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default PatientReg;
