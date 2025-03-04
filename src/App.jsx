import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import Layout from "./components/Layout";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DocDashboard = lazy(() => import("./pages/DocDashboard"));
const Patients = lazy(() => import("./pages/Patients"));
const StaffReg = lazy(() => import("./pages/StaffReg"));
const PatientReg = lazy(() => import("./pages/PatientReg"));
const AcctDashboard = lazy(() => import("./pages/AcctDashboard"));
const PharmDashboard = lazy(() => import("./pages/PharmDashboard"));
const NurseDashboard = lazy(() => import("./pages/NurseDashboard"));
const StaffList = lazy(() => import("./pages/StaffList"));
const PharmInventory = lazy(() => import("./components/Pharm/PharmInventory"));
const LabDashboard = lazy(() => import("./pages/LabDashboard"));
const AllTests = lazy(() => import("./components/Lab/AllTests"));

const App = () => {
  const { staffRoles } = useAuth();

  return (
    <Suspense fallback={<Loader />}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={[staffRoles.Admin]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doc-dashboard"
            element={
              <ProtectedRoute allowedRoles={[staffRoles.Doctor]}>
                <DocDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-dashboard"
            element={
              <ProtectedRoute allowedRoles={[staffRoles.Admin, staffRoles.Lab]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharm-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[staffRoles.Pharmacist, staffRoles.Admin]}
              >
                <PharmDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acct-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[staffRoles.Admin, staffRoles.Accountant]}
              >
                <AcctDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[staffRoles.Admin, staffRoles.Nurse]}
              >
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  staffRoles.Admin,
                  staffRoles.Receptionist,
                  staffRoles.Orderly,
                ]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-reg"
            element={
              <ProtectedRoute
                allowedRoles={[
                  staffRoles.Admin,
                  staffRoles.Doctor,
                  staffRoles.Receptionist,
                  staffRoles.Nurse,
                ]}
              >
                <PatientReg />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute
                allowedRoles={[
                  staffRoles.Admin,
                  staffRoles.Nurse,
                  staffRoles.Receptionist,
                  staffRoles.Doctor,
                  staffRoles.Lab,
                  staffRoles.Accountant,
                  staffRoles.Pharmacist,
                  staffRoles.Orderly,
                ]}
              >
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={[staffRoles.Admin]}>
                <StaffList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute
                allowedRoles={[
                  staffRoles.Pharmacist,
                  staffRoles.Accountant,
                  staffRoles.Admin,
                  staffRoles.Doctor,
                  staffRoles.Receptionist,
                  staffRoles.Lab,
                ]}
              >
                <PharmInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute
                allowedRoles={[
                  staffRoles.Pharmacist,
                  staffRoles.Accountant,
                  staffRoles.Admin,
                  staffRoles.Doctor,
                  staffRoles.Receptionist,
                  staffRoles.Lab,
                ]}
              >
                <AllTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-staff"
            element={
              <ProtectedRoute allowedRoles={[staffRoles.Admin]}>
                <StaffReg />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default App;
