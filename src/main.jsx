import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PatientDataProvider } from "./contexts/PatientDataContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import { StaffProvider } from "./contexts/StaffContext";
import { AcctProvider } from "./contexts/AcctContext";
import { ConsultationProvider } from "./contexts/ConsultationContext";
import { PharmProvider } from "./contexts/PharmContext";
import { LabProvider } from "./contexts/LabContext";
import { NurseProvider } from "./contexts/NurseContext";
import { AlertProvider } from "./contexts/AlertContext";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AlertProvider>
          <AuthProvider>
            <PatientDataProvider>
              <StaffProvider>
                <AppointmentProvider>
                  <NurseProvider>
                    <ConsultationProvider>
                      <PharmProvider>
                        <LabProvider>
                          <AcctProvider>
                            <App />
                          </AcctProvider>
                        </LabProvider>
                      </PharmProvider>
                    </ConsultationProvider>
                  </NurseProvider>
                </AppointmentProvider>
              </StaffProvider>
            </PatientDataProvider>
          </AuthProvider>
        </AlertProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
