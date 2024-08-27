import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import { AuthProvider, useAuth } from "./AuthContext";
import VerificationPage from "./modules/AuthComponents/VerificationPage";
import SignUpPage from "./modules/AuthComponents/SignUpPage";
import SignInPage from "./modules/AuthComponents/SignInPage";
import AuthLayout from "./modules/AuthComponents/AuthLayout";
import TruckDriverLayout from "./modules/TruckDriverComponents/TruckDriverLayout";
import TruckDriverDashboard from "./modules/TruckDriverComponents/TruckDriverDashboard";
import AdminLayout from "./modules/AdminComponents/AdminLayout";
import AdminDashboard from "./modules/AdminComponents/AdminDashboard";
import AllUsers from "./modules/AdminComponents/AllUsers";
import ApplicationForm from "./modules/ApplicationForms/ApplicationForm1";
import ApplicationForm2 from "./modules/ApplicationForms/ApplicationForm2";
import ApplicationForm3 from "./modules/ApplicationForms/ApplicationForm3";
import ApplicationForm4 from "./modules/ApplicationForms/ApplicationForm4";
import ApplicationForm5 from "./modules/ApplicationForms/ApplicationForm5";
import ApplicationForm6 from "./modules/ApplicationForms/ApplicationForm6";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen loading-spinner">
    {/* Spinner */}
    <div className="w-16 h-16 border-4 rounded-full border-t-transparent border-gray-900/50 animate-spin"></div>
  </div>
);
function App() {
  const { currentUser, loading } = useAuth();

  return (
    <div className="w-full h-auto overflow-hidden bg-white">
      <Router>
        <AuthProvider>
          <ToastContainer />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route
                  index
                  element={
                    currentUser ? (
                      <Navigate to="/TruckDriverLayout" />
                    ) : (
                      <SignInPage />
                    )
                  }
                />
                <Route path="signUp" element={<SignUpPage />} />
                <Route path="verificationPage" element={<VerificationPage />} />
                <Route path="signIn" element={<SignInPage />} />
              </Route>
              <Route path="/TruckDriverLayout" element={<TruckDriverLayout />}>
                <Route
                  index
                  element={
                    currentUser ? <TruckDriverDashboard /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm1"
                  element={
                    currentUser ? <ApplicationForm /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm2"
                  element={
                    currentUser ? <ApplicationForm2 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm3"
                  element={
                    currentUser ? <ApplicationForm3 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm4"
                  element={
                    currentUser ? <ApplicationForm4 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm5"
                  element={
                    currentUser ? <ApplicationForm5 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm6"
                  element={
                    currentUser ? <ApplicationForm6 /> : <Navigate to="/" />
                  }
                />
              </Route>
              {/* <Route
                path="/VirtualAssistantLayout"
                element={<VirtualAssistantLayout />}
              >
                <Route
                  index
                  element={
                    currentUser ? (
                      <VirtualAssistantDashboard />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
              </Route> */}
              <Route path="/AdminLayout" element={<AdminLayout />}>
                <Route
                  index
                  element={
                    currentUser ? <AdminDashboard /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="users"
                  element={currentUser ? <AllUsers /> : <Navigate to="/" />}
                />
              </Route>
            </Routes>
          )}
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
