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
import VerificationPage from "./modules/VerificationPage";
import SignUpPage from "./modules/SignUpPage";
import SignInPage from "./modules/SignInPage";
import AuthLayout from "./modules/AuthLayout";
import TruckDriverLayout from "./modules/TruckDriverLayout";
import TruckDriverDashboard from "./modules/TruckDriverDashboard";
import AdminLayout from "./modules/AdminLayout";
import AdminDashboard from "./modules/AdminDashboard";
import AllUsers from "./modules/AllUsers";

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
