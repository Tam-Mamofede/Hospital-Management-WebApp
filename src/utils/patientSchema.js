import * as yup from "yup";

export const schema = yup.object().shape({
  patFirstName: yup
    .string()
    .required("Please provide the patient's first name."),
  patLastName: yup.string().required("Please provide the patient's last name."),
  patDOB: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of Birth must be in the format YYYY-MM-DD.",
    )
    .test(
      "is-valid-date",
      "Date of Birth must be a valid date.",
      (value) => !isNaN(new Date(value).getTime()),
    )
    .max(new Date(), "Date of birth cannot be in the future."),
  patGender: yup.string().required("Please specify the patient's gender."),
  patMaritalStatus: yup
    .string()
    .required("Please specify the patient's marital status."),
  patPhone: yup
    .number()
    .required("Please provide the patient's phone number.")
    .typeError("Phone number must be a number."),
  patEmail: yup.string().email("Invalid email address"),
  patAddress: yup
    .string()
    .min(10, "Address must be at least 10 characters.")
    .max(200, "Address must be less than 200 characters.")
    .required("Please provide the patient's address."),
  patOccupation: yup
    .string()
    .max(50, "Occupation must be less than 50 characters."),
  emergencyContactName: yup
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters.")
    .required("Please provide an emergency contact name."),
  emergencyContactNumber: yup
    .number()
    .required("Please provide an emergency contact number.")
    .typeError("Emergency contact number must be a number."),
  patFatherName: yup.string(),
  patMotherName: yup.string(),
  patBloodGroup: yup.string().optional(),
  patMedicalHistory: yup.string().optional(),
  patAllergies: yup.string().optional(),
  patCurrentMeds: yup.string().optional(),
  patStatus: yup.string(),
  primaryDoc: yup.string().optional(),
});
