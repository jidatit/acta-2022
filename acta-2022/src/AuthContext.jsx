import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PropTypes from "prop-types";
import { sendEmailVerification, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedForms, setCompletedForms] = useState(null);
  const [FormData1, setFormData1] = useState({
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
  });
  const [addressField, setAddressField] = useState([
    {
      date: "",
      accidentType: "",
      location: "",
      fatalities: "",
      penalties: "",
      comments: "",
    },
  ]);
  const [trafficConvictionField, setTrafficConvictionField] = useState([
    {
      date: "",
      offenseType: "",
      location: "",
      penalties: "",
      comments: "",
    },
  ]);
  const [DriverLicensePermit, setDriverLicensePermit] = useState([
    {
      LicenseNo: "",
      type: "",
      state: "",
      expiryDate: "",
    },
  ]);
  const [DriverExperience, setDriverExperience] = useState([
    {
      statesOperated: "",
      ClassEquipment: "",
      EquipmentType: "",
      DateFrom: "",
      DateTo: "",
      ApproximatelyMiles: "",
      comments: "",
    },
  ]);
  const [EducationHistory, setEducationHistory] = useState([
    {
      school: "",
      educationLevel: "",
      DateFrom: "",
      DateTo: "",
      comments: "",
    },
  ]);
  const [FormData, setFormData] = useState([
    { street1: "", street2: "", city: "", state: "", zipCode: "" },
  ]);
  const [ExtraSkills, setExtraSkills] = useState({
    safeDrivingAwards: "",
    specialTraining: "",
    otherSkills: "",
  });
  const [FormData3, setFormData3] = useState([
    {
      companyName: "",
      street: "",
      city: "",
      zipCode: "",
      contactPerson: "",
      phone: "",
      fax1: "",
      from: "",
      to: "",
      position: "",
      salary: "",
      leavingReason: "",
      subjectToFMCSRs: "",
      jobDesignatedAsSafetySensitive: "",
    },
  ]);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  useEffect(() => {
    const fetchCompletedForms = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const completedFormsData = data.completedForms || null;
          localStorage.setItem("completedForms", completedFormsData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching completed forms: ", error);
      }
    };

    fetchCompletedForms();
  }, [currentUser, isSaveClicked]);
  // Trigger this effect when `isSaveClicked` or `currentUser` changes.
  const fetchCompletedForms = async () => {
    if (!currentUser) return;

    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const completedFormsData = data.completedForms || null;
        setCompletedForms(completedFormsData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching completed forms: ", error);
    }
  };
  useEffect(() => {
    // Load data from local storage
    const savedFormData1 = localStorage.getItem("formData");
    const savedFormData = localStorage.getItem("formData2");
    const savedFormData3 = localStorage.getItem("formData3");
    const savedAddressField = localStorage.getItem("addressField4");
    const savedTrafficConvictionField = localStorage.getItem(
      "trafficConvictionField4"
    );
    const driverLicensePermit = localStorage.getItem("driverLicensePermit5");
    const driverExperience = localStorage.getItem("driverExperience5");
    const educationHistory = localStorage.getItem("educationHistory5");
    const extraSkills = localStorage.getItem("extraSkills5");
    if (savedFormData1) setFormData1(JSON.parse(savedFormData1));
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedFormData3) setFormData3(JSON.parse(savedFormData3));
    if (driverLicensePermit)
      setDriverLicensePermit(JSON.parse(driverLicensePermit));
    if (driverExperience) setDriverExperience(JSON.parse(driverExperience));
    if (educationHistory) setEducationHistory(JSON.parse(educationHistory));
    if (savedAddressField) setAddressField(JSON.parse(savedAddressField));
    if (extraSkills) setExtraSkills(JSON.parse(extraSkills));
    if (savedTrafficConvictionField)
      setTrafficConvictionField(JSON.parse(savedTrafficConvictionField));

    console.log(FormData1);
  }, []);

  const saveFormData = (data) => {
    fetchCompletedForms();
    setFormData(data);
    localStorage.setItem("formData2", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveFormData1 = (data) => {
    fetchCompletedForms();
    setFormData1(data);
    localStorage.setItem("formData", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveFormData3 = (data) => {
    fetchCompletedForms();
    setFormData3(data);
    localStorage.setItem("formData3", JSON.stringify(data));
    setIsSaveClicked(true);
  };

  const saveAddressField4 = (data) => {
    fetchCompletedForms();
    setAddressField(data);
    localStorage.setItem("addressField4", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveDriverLicensePermit = (data) => {
    setDriverLicensePermit(data);
    localStorage.setItem("driverLicensePermit5", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveDriverExperience = (data) => {
    setDriverExperience(data);
    localStorage.setItem("driverExperience5", JSON.stringify(data));
    setIsSaveClicked(true);
  };

  const saveEducationHistory = (data) => {
    setEducationHistory(data);
    localStorage.setItem("educationHistory5", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveExtraSkills = (data) => {
    setExtraSkills(data);
    localStorage.setItem("extraSkills5", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  const saveTrafficConviction4 = (data) => {
    setTrafficConvictionField(data);
    localStorage.setItem("trafficConvictionField4", JSON.stringify(data));
    setIsSaveClicked(true);
  };
  console.log(FormData3);
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
          setCurrentUserId(user.uid);
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
        FormData1,
        setFormData1,
        saveFormData1,
        setFormData,
        saveFormData3,
        FormData3,
        setFormData3,
        isSaveClicked,
        setIsSaveClicked,
        addressField,
        trafficConvictionField,
        setAddressField,
        setTrafficConvictionField,
        saveAddressField4,
        DriverLicensePermit,
        setDriverLicensePermit,
        DriverExperience,
        setDriverExperience,
        EducationHistory,
        completedForms,
        setEducationHistory,
        saveDriverLicensePermit,
        saveDriverExperience,
        saveEducationHistory,
        saveTrafficConviction4,
        ExtraSkills,
        saveExtraSkills,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
