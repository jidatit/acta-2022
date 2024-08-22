import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { sendEmailVerification, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const [FormData, setFormData] = useState([
    { street1: "", street2: "", city: "", state: "", zipCode: "" },
  ]);
  const [FormData1, setFormData1] = useState([
    {
      applicantName: "",
      appliedDate: "",
      positionApplied: "",
      ssn: "",
      DOB: "",
      gender: "",
      referredBy: "",
      legalRightToWork: "",
      payExpected: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      cellPhone: "",
      Email: "",
      EmergencyContact: "",
      Relationship: "",
      CDL: "",
      CDLState: "",
      CDLClass: "",
      CDLExpirationDate: "",
      EverBeenDeniedALicense: "",
      PermitPrivilegeOfLicense: "",
      TestedPositiveOrRefusedDotDrug: "",
      EverConvictedOfFelony: "",
    },
  ]);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  console.log(FormData);
  const saveFormData = (data) => {
    setFormData(data);

    setIsSaveClicked(true);
  };
  const saveForm1Data = (data) => {
    setFormData1(data);

    setIsSaveClicked(true);
  };
  const getUserInfo = async (uid) => {
    console.log(uid);

    // Define a helper function to query a collection
    const queryCollection = async (collectionName) => {
      const q = query(collection(db, collectionName), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
      } else {
        return null;
      }
    };

    // Check in "admins" collection
    let userData = await queryCollection("admin");
    if (userData) {
      console.log("User Data from admins:", userData);
      return userData;
    }

    // Check in "employees" collection
    userData = await queryCollection("TruckDrivers");
    if (userData) {
      console.log("User Data from employees:", userData);
      return userData;
    }

    console.log("No such document!");
    return null;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setIsEmailVerified(user.emailVerified);
          const userData = await getUserInfo(user.uid);
          setCurrentUser(userData);
          localStorage.setItem("currentUser", JSON.stringify(userData));
          localStorage.setItem(
            "isEmailVerified",
            JSON.stringify(user.emailVerified)
          );
          setLoading(false);
          console.log(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
          setIsEmailVerified(false);
          setLoading(false);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isEmailVerified");
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsEmailVerified(null);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isEmailVerified");
      // Clear the current user
      // Redirect to the homepage or login page
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const verifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log("Email verification sent!");
    } catch (error) {
      toast.error("Error sending email verification:", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isEmailVerified,
        handleLogout,
        loading,
        verifyEmail,
        saveFormData,
        FormData,
        setFormData,
        isSaveClicked,
        setIsSaveClicked,
        saveForm1Data,
        Fo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
