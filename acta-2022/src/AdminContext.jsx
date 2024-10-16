import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

export const AdminContext = createContext();
export const useAuthAdmin = () => useContext(AdminContext);
export const AdminProvider = ({ children }) => {
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
    applicantName: { value: "", status: "pending", note: "" },
    appliedDate: { value: "", status: "pending", note: "" },
    positionApplied: { value: "", status: "pending", note: "" },
    ssn: { value: "", status: "pending", note: "" },
    DOB: { value: "", status: "pending", note: "" },
    gender: { value: "", status: "pending", note: "" },
    referredBy: { value: "", status: "pending", note: "" },
    legalRightToWork: { value: "", status: "pending", note: "" },
    payExpected: { value: "", status: "pending", note: "" },
    street1: { value: "", status: "pending", note: "" },
    street2: { value: "", status: "pending", note: "" },
    city: { value: "", status: "pending", note: "" },
    state: { value: "", status: "pending", note: "" },
    zipCode: { value: "", status: "pending", note: "" },
    cellPhone: { value: "", status: "pending", note: "" },
    Email: { value: "", status: "pending", note: "" },
    EmergencyContact: { value: "", status: "pending", note: "" },
    Relationship: { value: "", status: "pending", note: "" },
    CDL: { value: "", status: "pending", note: "" },
    CDLState: { value: "", status: "pending", note: "" },
    CDLClass: { value: "", status: "pending", note: "" },
    CDLExpirationDate: { value: "", status: "pending", note: "" },
    EverBeenDeniedALicense: { value: "", status: "pending", note: "" },
    PermitPrivilegeOfLicense: { value: "", status: "pending", note: "" },
    TestedPositiveOrRefusedDotDrug: { value: "", status: "pending", note: "" },
    EverConvictedOfFelony: { value: "", status: "pending", note: "" },
  });

  const [formData8, setFormData8] = useState({
    day1: { value: "", status: "pending", note: "" },
    day2: { value: "", status: "pending", note: "" },
    day3: { value: "", status: "pending", note: "" },
    day4: { value: "", status: "pending", note: "" },
    day5: { value: "", status: "pending", note: "" },
    day6: { value: "", status: "pending", note: "" },
    day7: { value: "", status: "pending", note: "" },
    day1HoursWorked: { value: "", status: "pending", note: "" },
    day2HoursWorked: { value: "", status: "pending", note: "" },
    day3HoursWorked: { value: "", status: "pending", note: "" },
    day4HoursWorked: { value: "", status: "pending", note: "" },
    day5HoursWorked: { value: "", status: "pending", note: "" },
    day6HoursWorked: { value: "", status: "pending", note: "" },
    day7HoursWorked: { value: "", status: "pending", note: "" },
    TotalHours: { value: "", status: "pending", note: "" },
    relievedTime: { value: "00:00", status: "pending", note: "" },
    relievedDate: { value: "", status: "pending", note: "" },
  });

  const [addressField, setAddressField] = useState([
    {
      date: { value: "", status: "pending", note: "" },
      accidentType: { value: "", status: "pending", note: "" },
      location: { value: "", status: "pending", note: "" },
      fatalities: { value: "", status: "pending", note: "" },
      penalties: { value: "", status: "pending", note: "" },
      comments: { value: "", status: "pending", note: "" },
    },
  ]);

  const [violationField, setViolationField] = useState([
    {
      date: { value: "", status: "pending", note: "" },
      offense: { value: "", status: "pending", note: "" },
      location: { value: "", status: "pending", note: "" },
      vehicleOperated: { value: "", status: "pending", note: "" },
    },
  ]);

  const [alcoholDrugTesting, setAlcoholDrugTesting] = useState([
    {
      testedPositiveEver: { value: "", status: "pending", note: "" },
      DOTCompletion: { value: "", status: "pending", note: "" },
    },
  ]);

  const [trafficConvictionField, setTrafficConvictionField] = useState([
    {
      date: { value: "", status: "pending", note: "" },
      offenseType: { value: "", status: "pending", note: "" },
      location: { value: "", status: "pending", note: "" },
      penalties: { value: "", status: "pending", note: "" },
      comments: { value: "", status: "pending", note: "" },
    },
  ]);

  const [DriverLicensePermit, setDriverLicensePermit] = useState([
    {
      LicenseNo: { value: "", status: "pending", note: "" },
      type: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      expiryDate: { value: "", status: "pending", note: "" },
    },
  ]);

  const [DriverExperience, setDriverExperience] = useState([
    {
      statesOperated: { value: "", status: "pending", note: "" },
      ClassEquipment: { value: "", status: "pending", note: "" },
      EquipmentType: { value: "", status: "pending", note: "" },
      DateFrom: { value: "", status: "pending", note: "" },
      DateTo: { value: "", status: "pending", note: "" },
      ApproximatelyMiles: { value: "", status: "pending", note: "" },
      comments: { value: "", status: "pending", note: "" },
    },
  ]);

  const [EducationHistory, setEducationHistory] = useState([
    {
      school: { value: "", status: "pending", note: "" },
      educationLevel: { value: "", status: "pending", note: "" },
      DateFrom: { value: "", status: "pending", note: "" },
      DateTo: { value: "", status: "pending", note: "" },
      comments: { value: "", status: "pending", note: "" },
    },
  ]);

  const [FormData, setFormData] = useState([
    {
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
    },
  ]);

  const [ExtraSkills, setExtraSkills] = useState({
    safeDrivingAwards: { value: "", status: "pending", note: "" },
    specialTraining: { value: "", status: "pending", note: "" },
    otherSkills: { value: "", status: "pending", note: "" },
  });

  const [FormData3, setFormData3] = useState([
    {
      companyName: { value: "", status: "pending", note: "" },
      street: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
      contactPerson: { value: "", status: "pending", note: "" },
      phone: { value: "", status: "pending", note: "" },
      fax1: { value: "", status: "pending", note: "" },
      from: { value: "", status: "pending", note: "" },
      to: { value: "", status: "pending", note: "" },
      position: { value: "", status: "pending", note: "" },
      salary: { value: "", status: "pending", note: "" },
      leavingReason: { value: "", status: "pending", note: "" },
      subjectToFMCSRs: { value: "", status: "pending", note: "" },
      jobDesignatedAsSafetySensitive: {
        value: "",
        status: "pending",
        note: "",
      },
    },
  ]);

  const [formData9, setFormData9] = useState([
    {
      currentlyWorking: { value: "", status: "pending", note: "" },
      workingForAnotherEmployer: { value: "", status: "pending", note: "" },
    },
  ]);

  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const formData1Ref = useRef(FormData1);
  useEffect(() => {
    formData1Ref.current = FormData1;
  }, [FormData1]);

  const fetchUserData = useCallback((uid) => {
    if (!uid) return Promise.resolve();

    setCurrentUserId(uid);
    const docRef = doc(db, "truck_driver_applications", uid);

    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            updateFormData(data);
          } else {
            clearLocalStorageAndState();
            console.log("No such document! Cleared data.");
          }
          resolve();
        },
        (error) => {
          console.error("Error fetching user data: ", error);
          reject(error);
        }
      );

      return () => unsubscribe();
    });
  }, []);

  const updateFormData = useCallback((data) => {
    const form1Data = data.form1 || null;
    setFormData1((prevState) => {
      const newState = { ...prevState, ...form1Data };
      console.log("Updating FormData1 to:", newState);
      localStorage.setItem("AdminFormData", JSON.stringify(newState));
      return newState;
    });
    setFormData8(data.form8?.onDutyHours || null);
    localStorage.setItem(
      "AdminFormData8",
      JSON.stringify(data.form8?.onDutyHours || null)
    );

    setFormData9(data.form9?.compensatedWork || null);
    localStorage.setItem(
      "AdminFormData9",
      JSON.stringify(data.form9?.compensatedWork || null)
    );

    setFormData(data.form2?.previousAddresses || []);
    localStorage.setItem(
      "AdminFormData2",
      JSON.stringify(data.form2?.previousAddresses || [])
    );

    setFormData3(data.form3?.EmploymentHistory || []);
    localStorage.setItem(
      "AdminFormData3",
      JSON.stringify(data.form3?.EmploymentHistory || [])
    );

    if (data.form4) {
      const { accidentRecords, trafficConvictions } = data.form4;
      setAddressField(accidentRecords || []);
      setTrafficConvictionField(trafficConvictions || []);
      setNoAccidentsChecked(data.form4.noAccidents || false);
      setNoTrafficConvictionsChecked(data.form4.noTrafficConvictions || false);

      localStorage.setItem(
        "AdminAddressField4",
        JSON.stringify(accidentRecords || [])
      );
      localStorage.setItem(
        "AdminTrafficConvictionField4",
        JSON.stringify(trafficConvictions || [])
      );
      localStorage.setItem(
        "AdminNoAccidentsChecked",
        JSON.stringify(data.form4.noAccidents || false)
      );
      localStorage.setItem(
        "AdminNoTrafficConvictions",
        JSON.stringify(data.form4.noTrafficConvictions || false)
      );
    }

    if (data.form5) {
      const {
        driverLicensePermit,
        driverExperience,
        educationHistory,
        extraSkills,
      } = data.form5;
      setDriverLicensePermit(driverLicensePermit || []);
      setDriverExperience(driverExperience || []);
      setEducationHistory(educationHistory || []);
      setExtraSkills(extraSkills || []);

      localStorage.setItem(
        "AdminDriverLicensePermit5",
        JSON.stringify(driverLicensePermit || [])
      );
      localStorage.setItem(
        "AdminDriverExperience5",
        JSON.stringify(driverExperience || [])
      );
      localStorage.setItem(
        "AdminEducationHistory5",
        JSON.stringify(educationHistory || [])
      );
      localStorage.setItem(
        "AdminExtraSkills5",
        JSON.stringify(extraSkills || [])
      );
    }

    if (data.form6) {
      const { violationRecords } = data.form6;
      setViolationField(violationRecords || []);
      setNoViolationChecked(data.form6.noViolations || false);

      localStorage.setItem(
        "AdminViolationField6",
        JSON.stringify(violationRecords || [])
      );
      localStorage.setItem(
        "AdminNoViolationChecked",
        JSON.stringify(data.form6.noViolations || false)
      );
    }

    if (data.form7) {
      const { AlcoholDrugTest } = data.form7;
      setAlcoholDrugTesting(AlcoholDrugTest || []);
      localStorage.setItem(
        "AdminAlcoholDrugTest7",
        JSON.stringify(AlcoholDrugTest || [])
      );
    }
  }, []);
  useEffect(() => {
    if (currentUserId) {
      fetchUserData(currentUserId);
    }
  }, [currentUserId, fetchUserData]);
  useEffect(() => {
    console.log("formData1 updated:", FormData1);
  }, [FormData1]);
  useEffect(() => {
    console.log("Current formData1:", formData1Ref.current);
  }, [FormData1]);
  // Clear all local storage and reset states
  const clearLocalStorageAndState = () => {
    // Clear all relevant localStorage items
    localStorage.removeItem("AdminFormData");
    localStorage.removeItem("AdminFormData8");
    localStorage.removeItem("AdminFormData9");
    localStorage.removeItem("AdminFormData2");
    localStorage.removeItem("AdminFormData3");
    localStorage.removeItem("AdminAddressField4");
    localStorage.removeItem("AdminTrafficConvictionField4");
    localStorage.removeItem("AdminNoAccidentsChecked");
    localStorage.removeItem("AdminNoTrafficConvictions");
    localStorage.removeItem("AdminDriverLicensePermit5");
    localStorage.removeItem("AdminDriverExperience5");
    localStorage.removeItem("AdminEducationHistory5");
    localStorage.removeItem("AdminExtraSkills5");
    localStorage.removeItem("AdminViolationField6");
    localStorage.removeItem("AdminNoViolationChecked");
    localStorage.removeItem("AdminAlcoholDrugTest7");

    // Reset all state variables to their empty/default values
    setFormData1({
      applicantName: { value: "", status: "pending", note: "" },
      appliedDate: { value: "", status: "pending", note: "" },
      positionApplied: { value: "", status: "pending", note: "" },
      ssn: { value: "", status: "pending", note: "" },
      DOB: { value: "", status: "pending", note: "" },
      gender: { value: "", status: "pending", note: "" },
      referredBy: { value: "", status: "pending", note: "" },
      legalRightToWork: { value: "", status: "pending", note: "" },
      payExpected: { value: "", status: "pending", note: "" },
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
      cellPhone: { value: "", status: "pending", note: "" },
      Email: { value: "", status: "pending", note: "" },
      EmergencyContact: { value: "", status: "pending", note: "" },
      Relationship: { value: "", status: "pending", note: "" },
      CDL: { value: "", status: "pending", note: "" },
      CDLState: { value: "", status: "pending", note: "" },
      CDLClass: { value: "", status: "pending", note: "" },
      CDLExpirationDate: { value: "", status: "pending", note: "" },
      EverBeenDeniedALicense: { value: "", status: "pending", note: "" },
      PermitPrivilegeOfLicense: { value: "", status: "pending", note: "" },
      TestedPositiveOrRefusedDotDrug: {
        value: "",
        status: "pending",
        note: "",
      },
      EverConvictedOfFelony: { value: "", status: "pending", note: "" },
    });
    setFormData8(null);
    setFormData9(null);
    setFormData([]);
    setFormData3([]);
    setAddressField([]);
    setTrafficConvictionField([]);
    setNoAccidentsChecked(false);
    setNoTrafficConvictionsChecked(false);
    setDriverLicensePermit([]);
    setDriverExperience([]);
    setEducationHistory([]);
    setExtraSkills([]);
    setViolationField([]);
    setNoViolationChecked(false);
    setAlcoholDrugTesting([]);
  };
  const populateFormData = () => {
    const savedFormData1 = localStorage.getItem("AdminFormData");
    console.log("savedFormData1", savedFormData1);
    const savedFormData8 = localStorage.getItem("AdminFormData8");
    const savedFormData9 = localStorage.getItem("AdminFormData9");
    const savedFormData = localStorage.getItem("AdminFormData2");
    const savedFormData3 = localStorage.getItem("AdminFormData3");
    const savedAddressField = localStorage.getItem("AdminAddressField4");
    const savedTrafficConvictionField = localStorage.getItem(
      "AdminTrafficConvictionField4"
    );
    const driverLicensePermit = localStorage.getItem(
      "AdminDriverLicensePermit5"
    );
    const driverExperience = localStorage.getItem("AdminDriverExperience5");
    const educationHistory = localStorage.getItem("AdminEducationHistory5");
    const extraSkills = localStorage.getItem("AdminExtraSkills5");
    const savedViolationField = localStorage.getItem("AdminViolationField6");
    const alcoholDrugTesting7 = localStorage.getItem("AdminAlcoholDrugTest7");

    if (savedFormData1) setFormData1(JSON.parse(savedFormData1));
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedFormData8) setFormData8(JSON.parse(savedFormData8));
    if (savedFormData9) setFormData9(JSON.parse(savedFormData9));
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
    if (alcoholDrugTesting7)
      setAlcoholDrugTesting(JSON.parse(alcoholDrugTesting7));
  };
  useEffect(() => {
    const savedFormData1 = localStorage.getItem("AdminFormData");
    if (savedFormData1) {
      setFormData1((prevState) => {
        const newState = { ...prevState, ...savedFormData1 };
        console.log("Updating FormData1 to:", newState);
        localStorage.setItem("AdminFormData", JSON.stringify(newState));
        return newState;
      });

      const savedFormData8 = localStorage.getItem("AdminFormData8");
      const savedFormData9 = localStorage.getItem("AdminFormData9");
      const savedFormData = localStorage.getItem("AdminFormData2");
      const savedFormData3 = localStorage.getItem("AdminFormData3");
      const savedAddressField = localStorage.getItem("AdminAddressField4");
      const savedTrafficConvictionField = localStorage.getItem(
        "AdminTrafficConvictionField4"
      );
      const driverLicensePermit = localStorage.getItem(
        "AdminDriverLicensePermit5"
      );
      const driverExperience = localStorage.getItem("AdminDriverExperience5");
      const educationHistory = localStorage.getItem("AdminEducationHistory5");
      const extraSkills = localStorage.getItem("AdminExtraSkills5");
      const savedViolationField = localStorage.getItem("AdminViolationField6");
      const alcoholDrugTesting7 = localStorage.getItem("AdminAlcoholDrugTest7");

      if (savedFormData1) setFormData1(JSON.parse(savedFormData1));
      if (savedFormData) setFormData(JSON.parse(savedFormData));
      if (savedFormData8) setFormData8(JSON.parse(savedFormData8));
      if (savedFormData9) setFormData9(JSON.parse(savedFormData9));
      if (savedFormData3) setFormData3(JSON.parse(savedFormData3));
      if (driverLicensePermit)
        setDriverLicensePermit(JSON.parse(driverLicensePermit));
      if (driverExperience) setDriverExperience(JSON.parse(driverExperience));
      if (educationHistory) setEducationHistory(JSON.parse(educationHistory));
      if (savedAddressField) setAddressField(JSON.parse(savedAddressField));
      if (extraSkills) setExtraSkills(JSON.parse(extraSkills));
      if (savedTrafficConvictionField)
        setTrafficConvictionField(JSON.parse(savedTrafficConvictionField));
      if (savedViolationField)
        setViolationField(JSON.parse(savedViolationField));
      if (alcoholDrugTesting7)
        setAlcoholDrugTesting(JSON.parse(alcoholDrugTesting7));
    }
  }, [currentUserId, fetchUserData]);

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const docRef = doc(db, "truck_driver_applications", currentUser.uid);

  //   const unsubscribe = onSnapshot(
  //     docRef,
  //     (docSnap) => {
  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         //   const completedFormsData = data.completedForms || null;
  //         //   setCompletedForms(completedFormsData);
  //         //   localStorage.setItem(
  //         //     "completedForms",
  //         //     JSON.stringify(completedFormsData)
  //         //   );

  //         if (data.form1) {
  //           localStorage.setItem("AdminFormData", JSON.stringify(data.form1));
  //           setFormData1(data.form1);
  //         }
  //         if (data.form8) {
  //           localStorage.setItem("AdminFormData8", JSON.stringify(data.form8));
  //           setFormData8(data.form8.onDutyHours);
  //         }
  //         if (data.form9) {
  //           localStorage.setItem("AdminFormData9", JSON.stringify(data.form9));
  //           setFormData9(data.form9.compensatedWork);
  //         }
  //         if (data.form2) {
  //           localStorage.setItem("AdminFormData2", JSON.stringify(data.form2));
  //           //console.log(data.form2.previousAddresses);
  //           setFormData(data.form2.previousAddresses);
  //         }
  //         if (data.form3) {
  //           localStorage.setItem("AdminFormData3", JSON.stringify(data.form3));
  //           //console.log(data.form3.EmploymentHistory);
  //           setFormData3(data.form3.EmploymentHistory);
  //         }
  //         if (data.form4) {
  //           const { accidentRecords, trafficConvictions } = data.form4;
  //           localStorage.setItem(
  //             "AdminAddressField4",
  //             JSON.stringify(accidentRecords)
  //           );
  //           setAddressField(accidentRecords);
  //           localStorage.setItem(
  //             "AdminTrafficConvictionField4",
  //             JSON.stringify(trafficConvictions)
  //           );
  //           setTrafficConvictionField(trafficConvictions);
  //           localStorage.setItem(
  //             "AdminNoAccidentsChecked",
  //             JSON.stringify(data.form4.noAccidents)
  //           );
  //           setNoAccidentsChecked(data.form4.noAccidents);
  //           localStorage.setItem(
  //             "AdminNoTrafficConvictions",
  //             JSON.stringify(data.form4.noTrafficConvictions)
  //           );
  //           setNoTrafficConvictionsChecked(data.form4.noTrafficConvictions);
  //         }
  //         if (data.form5) {
  //           localStorage.setItem(
  //             "AdminDriverLicensePermit5",
  //             JSON.stringify(data.form5.driverLicensePermit)
  //           );
  //           setDriverLicensePermit(data.form5.driverLicensePermit);
  //           localStorage.setItem(
  //             "AdminDriverExperience5",
  //             JSON.stringify(data.form5.driverExperience)
  //           );
  //           setDriverExperience(data.form5.driverExperience);
  //           localStorage.setItem(
  //             "AdminEducationHistory5",
  //             JSON.stringify(data.form5.educationHistory)
  //           );
  //           setEducationHistory(data.form5.educationHistory);
  //           localStorage.setItem(
  //             "AdminExtraSkills5",
  //             JSON.stringify(data.form5.extraSkills)
  //           );
  //           setExtraSkills(data.form5.extraSkills);
  //         }
  //         if (data.form6) {
  //           const { violationRecords } = data.form6;
  //           localStorage.setItem(
  //             "AdminViolationField6",
  //             JSON.stringify(violationRecords)
  //           );
  //           setViolationField(violationRecords);

  //           localStorage.setItem(
  //             "AdminNoViolationChecked",
  //             JSON.stringify(data.form6.noViolations)
  //           );
  //           setNoViolationChecked(data.form6.noViolations);
  //         }
  //         if (data.form7) {
  //           const { AlcoholDrugTest } = data.form7;
  //           localStorage.setItem(
  //             "AdminAlcoholDrugTest7",
  //             JSON.stringify(AlcoholDrugTest)
  //           );
  //           setAlcoholDrugTesting(AlcoholDrugTest);
  //         }
  //       } else {
  //         //console.log("No such document!");
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching completed forms: ", error);
  //     }
  //   );

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, [currentUser]);
  // Trigger this effect when `isSaveClicked` or `currentUser` changes.

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
    <AdminContext.Provider
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
        fetchUserData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
