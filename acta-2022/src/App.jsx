import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./AuthContext";

import "react-toastify/dist/ReactToastify.css";
import SignUpPage from "./modules/AuthComponents/auth/SignUpPage";
import AuthLayout from "./modules/AuthComponents/layout/AuthLayout";
import SignInPage from "./modules/AuthComponents/auth/SignInPage";
import VerificationPage from "./modules/AuthComponents/components/VerificationPage";
import ForgotPassword from "./modules/AuthComponents/components/ForgotPassword";
import TruckDriverLayout from "./modules/TruckDriverComponents/layout/TruckDriverLayout";

import ChangePassword from "./modules/AuthComponents/components/ChangePassword";
import TruckDriverDashboard from "./modules/TruckDriverComponents/pages/TruckDriverDashboard";
import AdminLayout from "./modules/AdminComponents/layout/AdminLayout";
import AdminDashboard from "./modules/AdminComponents/pages/AdminDashboard";
import AllUsers from "./modules/AdminComponents/components/AllUsers";
import ApplicationForm from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm1";
import ApplicationForm2 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm2";
import ApplicationForm3 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm3";
import ApplicationForm4 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm4";
import ApplicationForm5 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm5";
import NewApplicationForm6 from "./modules/TruckDriverComponents/components/ApplicationForms/NewApplicationForm6";
import ApplicationForm6 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm6";
import ApplicationForm7 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm7";
import ApplicationForm8 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm8";
import ApplicationForm9 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm9";
import ApplicationForm10 from "./modules/TruckDriverComponents/components/ApplicationForms/ApplicationForm10";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen loading-spinner">
    {/* Spinner */}
    <div className="w-16 h-16 border-4 rounded-full border-t-transparent border-gray-900/50 animate-spin"></div>
  </div>
);
function App() {
  const { currentUser, loading } = useAuth();
  const getDashboardPath = (userType) => {
    switch (userType) {
      case "TruckDriver":
        return "/TruckDriverLayout/ApplicationForm1";
      case "admin":
        return "/AdminLayout";
      default:
        return "/";
    }
  };
  return (
    <div className=" h-auto overflow-hidden">
      <Router>
        <AuthProvider>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route
                  index
                  element={
                    currentUser ? (
                      <Navigate to={getDashboardPath(currentUser.userType)} />
                    ) : (
                      <SignInPage />
                    )
                  }
                />
                <Route path="signUp" element={<SignUpPage />} />
                <Route path="verificationPage" element={<VerificationPage />} />
                <Route path="signIn" element={<SignInPage />} />
                <Route path="forgotPassword" element={<ForgotPassword />} />
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
                <Route
                  path="ApplicationForm7"
                  element={
                    currentUser ? <ApplicationForm7 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm8"
                  element={
                    currentUser ? <ApplicationForm8 /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="ApplicationForm9"
                  element={
                    currentUser ? <ApplicationForm9 /> : <Navigate to="/" />
                  }
                />
                {/* <Route
                  path="ApplicationForm10"
                  element={
                    currentUser ? <ApplicationForm10 /> : <Navigate to="/" />
                  }
                /> */}
                <Route
                  path="ChangePassword"
                  element={
                    currentUser ? <ChangePassword /> : <Navigate to="/" />
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
                <Route
                  path="ChangePassword"
                  element={
                    currentUser ? <ChangePassword /> : <Navigate to="/" />
                  }
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
