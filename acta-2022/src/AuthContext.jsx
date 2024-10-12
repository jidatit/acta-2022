import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
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
  const [noViolationChecked, setNoViolationChecked] = useState(false);
  const [noAccidentsCheckeds, setNoAccidentsChecked] = useState(false);
  const [noTrafficConvictionsCheckeds, setNoTrafficConvictionsChecked] =
    useState(false);
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
  const [formData8, setFormData8] = useState({
    day1: "",
    day2: "",
    day3: "",
    day4: "",
    day5: "",
    day6: "",
    day7: "", // Endorsement
    day1HoursWorked: "",
    day2HoursWorked: "",
    day3HoursWorked: "",
    day4HoursWorked: "",
    day5HoursWorked: "",
    day6HoursWorked: "",
    day7HoursWorked: "",
    TotalHours: "",
    relievedTime: "00:00",
    relievedDate: "",
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
  const [violationField, setViolationField] = useState([
    {
      date: "",
      offense: "",
      location: "",
      vehicleOperated: "",
    },
  ]);
  const [alcoholDrugTesting, setAlcoholDrugTesting] = useState([
    {
      testedPositiveEver: "",
      DOTCompletion: "",
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
  const [formData9, setFormData9] = useState([
    {
      currentlyWorking: "",
      workingForAnotherEmployer: "",
    },
  ]);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, "truck_driver_applications", currentUser.uid);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const completedFormsData = data.completedForms || null;
          setCompletedForms(completedFormsData);
          localStorage.setItem(
            "completedForms",
            JSON.stringify(completedFormsData)
          );

          if (data.form1) {
            localStorage.setItem("formData", JSON.stringify(data.form1));
            setFormData1(data.form1);
          }
          if (data.form8) {
            localStorage.setItem("formData8", JSON.stringify(data.form8));
            setFormData8(data.form8.onDutyHours);
          }
          if (data.form9) {
            localStorage.setItem("formData9", JSON.stringify(data.form9));
            setFormData9(data.form9.compensatedWork);
          }
          if (data.form2) {
            localStorage.setItem("formData2", JSON.stringify(data.form2));
            //console.log(data.form2.previousAddresses);
            setFormData(data.form2.previousAddresses);
          }
          if (data.form3) {
            localStorage.setItem("formData3", JSON.stringify(data.form3));
            //console.log(data.form3.EmploymentHistory);
            setFormData3(data.form3.EmploymentHistory);
          }
          if (data.form4) {
            const { accidentRecords, trafficConvictions } = data.form4;
            localStorage.setItem(
              "addressField4",
              JSON.stringify(accidentRecords)
            );
            setAddressField(accidentRecords);
            localStorage.setItem(
              "trafficConvictionField4",
              JSON.stringify(trafficConvictions)
            );
            setTrafficConvictionField(trafficConvictions);
            localStorage.setItem(
              "noAccidentsChecked",
              JSON.stringify(data.form4.noAccidents)
            );
            setNoAccidentsChecked(data.form4.noAccidents);
            localStorage.setItem(
              "noTrafficConvictions",
              JSON.stringify(data.form4.noTrafficConvictions)
            );
            setNoTrafficConvictionsChecked(data.form4.noTrafficConvictions);
          }
          if (data.form5) {
            localStorage.setItem(
              "driverLicensePermit5",
              JSON.stringify(data.form5.driverLicensePermit)
            );
            setDriverLicensePermit(data.form5.driverLicensePermit);
            localStorage.setItem(
              "driverExperience5",
              JSON.stringify(data.form5.driverExperience)
            );
            setDriverExperience(data.form5.driverExperience);
            localStorage.setItem(
              "educationHistory5",
              JSON.stringify(data.form5.educationHistory)
            );
            setEducationHistory(data.form5.educationHistory);
            localStorage.setItem(
              "extraSkills5",
              JSON.stringify(data.form5.extraSkills)
            );
            setExtraSkills(data.form5.extraSkills);
          }
          if (data.form6) {
            const { violationRecords } = data.form6;
            localStorage.setItem(
              "violationField6",
              JSON.stringify(violationRecords)
            );
            setViolationField(violationRecords);

            localStorage.setItem(
              "noViolationChecked",
              JSON.stringify(data.form6.noViolations)
            );
            setNoViolationChecked(data.form6.noViolations);
          }
          if (data.form7) {
            const { AlcoholDrugTest } = data.form7;
            localStorage.setItem(
              "AlcoholDrugTest7",
              JSON.stringify(AlcoholDrugTest)
            );
            setAlcoholDrugTesting(AlcoholDrugTest);
          }
        } else {
          //console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching completed forms: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);
  // Trigger this effect when `isSaveClicked` or `currentUser` changes.

  useEffect(() => {
    // Load data from local storage
    const savedFormData1 = localStorage.getItem("formData");
    const savedFormData8 = localStorage.getItem("formData8");
    const savedFormData9 = localStorage.getItem("formData9");
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
    const savedViolationField = localStorage.getItem("violationField6");
    const alcoholDrugTesting7 = localStorage.getItem("AlcoholDrugTest7");
    if (savedFormData1) setFormData1(JSON.parse(savedFormData1));
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedFormData8) setFormData8(JSON.parse(savedFormData8));
    if (savedFormData9) setFormData8(JSON.parse(savedFormData9));
    if (savedFormData3) setFormData3(JSON.parse(savedFormData3));
    if (driverLicensePermit)
      setDriverLicensePermit(JSON.parse(driverLicensePermit));
    if (driverExperience) setDriverExperience(JSON.parse(driverExperience));
    if (educationHistory) setEducationHistory(JSON.parse(educationHistory));
    if (savedAddressField) setAddressField(JSON.parse(savedAddressField));
    if (extraSkills) setExtraSkills(JSON.parse(extraSkills));
    if (savedTrafficConvictionField)
      setTrafficConvictionField(JSON.parse(savedTrafficConvictionField));
    if (savedViolationField) setViolationField(JSON.parse(savedViolationField));
    if (alcoholDrugTesting7) setViolationField(JSON.parse(alcoholDrugTesting7));
    //console.log(FormData1);
  }, [currentUser]);

  const getUserInfo = async (uid) => {
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
      return userData;
    }

    // Check in "employees" collection
    userData = await queryCollection("TruckDrivers");
    if (userData) {
      return userData;
    }

    //console.log("No such document!");
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
          //console.log(userData);
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
      //console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const verifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      //console.log("Email verification sent!");
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
        FormData,
        FormData1,
        setFormData1,
        FormData3,
        setFormData3,
        isSaveClicked,
        setIsSaveClicked,
        addressField,
        trafficConvictionField,
        setAddressField,
        setTrafficConvictionField,
        noAccidentsCheckeds,
        noTrafficConvictionsCheckeds,
        DriverLicensePermit,
        setDriverLicensePermit,
        DriverExperience,
        setDriverExperience,
        EducationHistory,
        completedForms,
        setEducationHistory,
        ExtraSkills,
        violationField,
        setViolationField,
        noViolationChecked,
        setNoViolationChecked,
        alcoholDrugTesting,
        setAlcoholDrugTesting,
        formData8,
        setFormData8,
        formData9,
        setFormData9,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
