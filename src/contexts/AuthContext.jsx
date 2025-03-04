/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAlert } from "./AlertContext";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [staffForm, setStaffForm] = useState({
    staffFirstName: "",
    staffLastName: "",
    staffEmail: "",
    staffPhone: "",
    staffAddress: "",
    paymentType: "",
    salary: "",
    staffEmergencyContactName: "",
    staffEmergencyContactNumber: 0,
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState("");
  const [currentStaff, setCurrentStaff] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [staffDocId, setStaffDocId] = useState("");
  const [curMonth, setCurMonth] = useState("");

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const staffRoles = {
    Admin: "Admin",
    Doctor: "Doctor",
    Nurse: "Nurse",
    Accountant: "Accountant",
    Pharmacist: "Pharmacist",
    Lab: "Lab",
    Receptionist: "Receptionist",
    Orderly: "Orderly",
  };

  const schema = yup.object().shape({
    staffFirstName: yup.string().required("Please input your first name."),
    staffLastName: yup.string().required("Please input your last name."),
    staffEmail: yup.string().email().required("Please input your email."),
    staffPhone: yup
      .number()
      .min(11)
      .integer()
      .positive()
      .required("Please provide your phone number."),
    password: yup.string().min(4).max(20).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords Don't Match")
      .required(),
    role: yup.string().required("Please select your role at the hospital."),

    staffAddress: yup
      .string()
      .min(10)
      .max(200)
      .required("Please provide the patient's address."),
    paymentType: yup.string(),
    salary: yup.number().min(5),
    staffEmergencyContactName: yup
      .string()
      .min(2)
      .max(50)
      .required("Please provide the patient's emergency contact's name."),
    staffEmergencyContactPhone: yup
      .number()
      .min(11)
      .required("Please provide the patient's emergency contact."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ relsolver: yupResolver(schema) });

  const createAccount = async () => {
    const data = getValues();
    try {
      if (!data.role) {
        throw new Error("Role is required.");
      }

      const staffRole = data.role;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.staffEmail,
        data.password,
      );
      const newUser = userCredential.user;
      setIsAuthenticated(true);

      const hospitalRef = doc(db, "hospital", "Hospital info");
      const staffColRef = collection(hospitalRef, "Staff");

      const emailQuery = query(
        staffColRef,
        where("email", "==", data.staffEmail),
      );
      const staffSnapshot = await getDocs(emailQuery);

      if (!staffSnapshot.empty) {
        showAlert(
          "Login Error: An account with this email already exists.",
          "error",
        );
        return;
      }

      await setDoc(doc(staffColRef, newUser.uid), {
        ...data,
        staffFirstName: data.staffFirstName,
        staffLastName: data.staffLastName,
        staffEmail: data.staffEmail,
        staffPhone: data.staffPhone,
        staffRole: data.role,
        staffAddress: data.staffAddress,
        paymentType: data.paymentType,
        salary: data.salary,
        staffEmergencyContactName: data.staffEmergencyContactName,
        staffEmergencyContactNumber: data.staffEmergencyContactNumber,
        createdAt: serverTimestamp(),
      });

      setUser(newUser);
      showAlert("Successfully created an account", "success");
      navigate("/login");
    } catch (err) {
      console.error("Create Account Error:", err);
      showAlert(`Sign up failed: ${err.message}`, "error");
    }
  };

  const deleteUserAccount = async (userIdToDelete) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this account? This action is irreversible!",
      )
    ) {
      return;
    }

    try {
      if (currentStaff.role !== "Admin") {
        showAlert(
          "You do not have permission to delete user accounts.",
          "error",
        );
        return;
      }

      const userDocRef = doc(
        db,
        "hospital",
        "Hospital info",
        "Staff",
        userIdToDelete,
      );
      await deleteDoc(userDocRef);

      const authInstance = getAuth();

      const userToDelete = await authInstance.getUser(userIdToDelete);

      if (!userToDelete) {
        showAlert("User not found in authentication system.", "error");
        return;
      }

      await deleteUser(userToDelete);

      showAlert("User account has been successfully deleted.", "success");
    } catch (error) {
      console.error("Error deleting user account:", error);
      if (error.code === "auth/requires-recent-login") {
        showAlert(
          "The user must log in again before their account can be deleted.",
          "error",
        );
      } else {
        showAlert(`Failed to delete user: ${error.message}`, "error");
      }
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      showAlert("You have successfully logged out.", "success");
      setLogInEmail("");
      setLogInPassword("");
    } catch (err) {
      console.error(err);
      showAlert("Log out failed", "error");
    } finally {
      window.location.href = "/login";
    }
  };

  const logIn = async () => {
    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        logInEmail,
        logInPassword,
      );
      setStaffDocId(user.uid);

      const userDocRef = doc(
        db,
        "hospital",
        "Hospital info",
        "Staff",
        user.uid,
      );
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("No staff document found for this user.");
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const staffRole = userData.role;

      if (!staffRole) {
        console.error("Invalid role: ", staffRole);
        setIsLoading(false);
        return;
      }

      setUserRole(staffRole);
      setStaffForm((prev) => ({ ...prev, role: staffRole }));
      setIsAuthenticated(true);

      // Redirect based on the user's role
      const roleRoutes = {
        Admin: "/admin-dashboard",
        Doctor: "/doc-dashboard",
        Nurse: "/nurse-dashboard",
        Accountant: "/acct-dashboard",
        Pharmacist: "/pharm-dashboard",
        Lab: "/lab-dashboard",
        Receptionist: "/dashboard",
        Orderly: "/dashboard",
      };

      const redirectPath = roleRoutes[staffRole] || null;

      if (redirectPath) {
        showAlert("Login successful", "success");
        navigate(redirectPath);
      } else {
        showAlert("Role not recognized. Please contact support.", "error");
      }
    } catch (err) {
      console.error("Login failed: ", err);
      showAlert("Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(
          doc(db, "hospital", "Hospital info", "Staff", staffDocId),
        );
        if (userDoc.exists()) {
          setCurrentStaff(userDoc.data());
        } else {
          console.error("No staff document found.");
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (staffDocId) {
      fetchData();
    }
  }, [staffDocId]);

  return (
    <AuthContext.Provider
      value={{
        staffForm,
        setStaffForm,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        createAccount,
        logOut,
        logIn,
        logInEmail,
        setLogInEmail,
        logInPassword,
        setLogInPassword,
        staffRoles,
        userRole,
        schema,
        register,
        handleSubmit,
        errors,
        currentStaff,
        isLoading,
        setIsLoading,
        staffDocId,
        curMonth,
        deleteUserAccount,
        setCurMonth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
