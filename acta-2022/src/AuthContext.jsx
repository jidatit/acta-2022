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
    let userData = await queryCollection("admins");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
