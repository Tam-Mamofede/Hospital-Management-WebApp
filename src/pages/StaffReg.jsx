import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";

function StaffReg() {
  const { createAccount, register, handleSubmit, errors } = useAuth();

  return (
    <>
      <NavBar />
      <div className="flex justify-center py-10">
        <form
          className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md"
          onSubmit={handleSubmit(createAccount)}
        >
          <h2 className="mb-6 text-center text-2xl font-semibold">
            Staff Registration
          </h2>

          {[
            { label: "First Name", name: "staffFirstName", type: "text" },
            { label: "Last Name", name: "staffLastName", type: "text" },
            { label: "Email", name: "staffEmail", type: "email" },
            { label: "Phone Number", name: "staffPhone", type: "number" },
            { label: "Password", name: "password", type: "password" },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
            },
            {
              label: "Residential Address",
              name: "staffAddress",
              type: "text",
            },
            { label: "Salary", name: "salary", type: "number" },
            {
              label: "Emergency Contact Name",
              name: "staffEmergencyContactName",
              type: "text",
            },
            {
              label: "Emergency Contact Number",
              name: "staffEmergencyContactNumber",
              type: "number",
            },
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                placeholder={label}
                {...register(name)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none"
              />
              {errors[name] && (
                <span className="text-sm text-red-600">
                  {errors[name].message}
                </span>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="mb-1 block font-medium text-gray-700">Role</label>
            <select
              {...register("role")}
              className="w-full rounded-md border px-3 py-2 focus:outline-none"
            >
              <option value="">Select role</option>
              {[
                "Admin",
                "Doctor",
                "Nurse",
                "Accountant",
                "Pharmacist",
                "Lab",
                "Receptionist",
                "Orderly",
              ].map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="text-sm text-red-600">
                {errors.role.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium text-gray-700">
              Payment Type
            </label>
            <select
              {...register("paymentType")}
              className="w-full rounded-md border px-3 py-2 focus:outline-none"
            >
              <option value="">-- Select payment type --</option>
              {["Monthly", "Weekly", "Bi-Annualy", "Annualy"].map((payment) => (
                <option key={payment} value={payment}>
                  {payment}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Add Staff
          </button>
        </form>
      </div>
    </>
  );
}

export default StaffReg;
