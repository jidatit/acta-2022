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
  const [applicationStatus, setApplicationStatus] = useState(null);
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
    city11: { value: "", status: "pending", note: "" },
    state11: { value: "", status: "pending", note: "" },
    zipCode11: { value: "", status: "pending", note: "" },
    cellPhone: { value: "", status: "pending", note: "" },
    Email: { value: "", status: "pending", note: "" },
    EmergencyContact: { value: "", status: "pending", note: "" },
    EmergencyPhone: { value: "", status: "pending", note: "" },
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
      date41: { value: "", status: "pending", note: "" },
      accidentType: { value: "", status: "pending", note: "" },
      location41: { value: "", status: "pending", note: "" },
      fatalities: { value: "", status: "pending", note: "" },
      penalties41: { value: "", status: "pending", note: "" },
      comments41: { value: "", status: "pending", note: "" },
    },
  ]);

  const [violationField, setViolationField] = useState([
    {
      date61: { value: "", status: "pending", note: "" },
      offense61: { value: "", status: "pending", note: "" },
      location61: { value: "", status: "pending", note: "" },
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
      date42: { value: "", status: "pending", note: "" },
      offenseType: { value: "", status: "pending", note: "" },
      location42: { value: "", status: "pending", note: "" },
      penalties42: { value: "", status: "pending", note: "" },
      comments42: { value: "", status: "pending", note: "" },
    },
  ]);

  const [DriverLicensePermit, setDriverLicensePermit] = useState([
    {
      LicenseNo: { value: "", status: "pending", note: "" },
      type: { value: "", status: "pending", note: "" },
      state53: { value: "", status: "pending", note: "" },
      expiryDate: { value: "", status: "pending", note: "" },
    },
  ]);

  const [DriverExperience, setDriverExperience] = useState([
    {
      statesOperated: { value: "", status: "pending", note: "" },
      ClassEquipment: { value: "", status: "pending", note: "" },
      EquipmentType: { value: "", status: "pending", note: "" },
      DateFrom51: { value: "", status: "pending", note: "" },
      DateTo51: { value: "", status: "pending", note: "" },
      ApproximatelyMiles: { value: "", status: "pending", note: "" },
      comments51: { value: "", status: "pending", note: "" },
    },
  ]);

  const [EducationHistory, setEducationHistory] = useState([
    {
      school: { value: "", status: "pending", note: "" },
      educationLevel: { value: "", status: "pending", note: "" },
      DateFrom52: { value: "", status: "pending", note: "" },
      DateTo52: { value: "", status: "pending", note: "" },
      comments52: { value: "", status: "pending", note: "" },
    },
  ]);

  const [FormData, setFormData] = useState([
    {
      street12: { value: "", status: "pending", note: "" },
      street22: { value: "", status: "pending", note: "" },
      city22: { value: "", status: "pending", note: "" },
      state22: { value: "", status: "pending", note: "" },
      zipCode22: { value: "", status: "pending", note: "" },
    },
  ]);

  const [ExtraSkills, setExtraSkills] = useState({
    safeDrivingAwards: { value: "", status: "pending", note: "" },
    specialTraining: { value: "", status: "pending", note: "" },
    otherSkills: { value: "", status: "pending", note: "" },
  });

  const [FormData3, setFormData3] = useState([
    {
      companyName31: { value: "", status: "pending", note: "" },
      street31: { value: "", status: "pending", note: "" },
      city31: { value: "", status: "pending", note: "" },
      zipCode31: { value: "", status: "pending", note: "" },
      contactPerson: { value: "", status: "pending", note: "" },
      phone31: { value: "", status: "pending", note: "" },
      fax1: { value: "", status: "pending", note: "" },
      from31: { value: "", status: "pending", note: "" },
      to31: { value: "", status: "pending", note: "" },
      position: { value: "", status: "pending", note: "" },
      salary: { value: "", status: "pending", note: "" },
      leavingReason: { value: "", status: "pending", note: "" },
      subjectToFMCSRs: { value: "", status: "pending", note: "" },
      gapReason: { value: "", status: "pending", note: "" },
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
  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, "truck_driver_applications", currentUser.uid);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          clearLocalStorageAndState();
          const data = docSnap.data();
          const completedFormsData = data.completedForms || null;
          setCompletedForms(completedFormsData);
          setApplicationStatus(data.applicationStatus);
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
          clearLocalStorageAndState();
        }
      },
      (error) => {
        console.error("Error fetching completed forms: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser?.userType]);
  // Trigger this effect when `isSaveClicked` or `currentUser` changes.
  const clearLocalStorageAndState = () => {
    // Clear all relevant localStorage items
    localStorage.removeItem("formData1");
    localStorage.removeItem("formData");
    localStorage.removeItem("formData8");
    localStorage.removeItem("formData9");
    localStorage.removeItem("formData2");
    localStorage.removeItem("formData3");
    localStorage.removeItem("addressField4");
    localStorage.removeItem("trafficConvictionField4");
    localStorage.removeItem("noAccidentsChecked");
    localStorage.removeItem("noTrafficConvictions");
    localStorage.removeItem("driverLicensePermit5");
    localStorage.removeItem("driverExperience5");
    localStorage.removeItem("educationHistory5");
    localStorage.removeItem("extraSkills5");
    localStorage.removeItem("violationField6");
    localStorage.removeItem("noViolationChecked");
    localStorage.removeItem("alcoholDrugTest7");
    localStorage.removeItem("completedForms");
    localStorage.removeItem("completedSections");

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
      city11: { value: "", status: "pending", note: "" },
      state11: { value: "", status: "pending", note: "" },
      zipCode11: { value: "", status: "pending", note: "" },
      cellPhone: { value: "", status: "pending", note: "" },
      Email: { value: "", status: "pending", note: "" },
      EmergencyContact: { value: "", status: "pending", note: "" },
      EmergencyPhone: { value: "", status: "pending", note: "" },
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
    setFormData8({
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
    setFormData9([
      {
        currentlyWorking: { value: "", status: "pending", note: "" },
        workingForAnotherEmployer: { value: "", status: "pending", note: "" },
      },
    ]);
    setFormData([
      {
        street12: { value: "", status: "pending", note: "" },
        street22: { value: "", status: "pending", note: "" },
        city22: { value: "", status: "pending", note: "" },
        state22: { value: "", status: "pending", note: "" },
        zipCode22: { value: "", status: "pending", note: "" },
      },
    ]);
    setFormData3([
      {
        companyName31: { value: "", status: "pending", note: "" },
        street31: { value: "", status: "pending", note: "" },
        city31: { value: "", status: "pending", note: "" },
        zipCode31: { value: "", status: "pending", note: "" },
        contactPerson: { value: "", status: "pending", note: "" },
        phone31: { value: "", status: "pending", note: "" },
        fax1: { value: "", status: "pending", note: "" },
        from31: { value: "", status: "pending", note: "" },
        to31: { value: "", status: "pending", note: "" },
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
    setAddressField([
      {
        date41: { value: "", status: "pending", note: "" },
        accidentType: { value: "", status: "pending", note: "" },
        location41: { value: "", status: "pending", note: "" },
        fatalities: { value: "", status: "pending", note: "" },
        penalties41: { value: "", status: "pending", note: "" },
        comments41: { value: "", status: "pending", note: "" },
      },
    ]);
    setTrafficConvictionField([
      {
        date42: { value: "", status: "pending", note: "" },
        offenseType: { value: "", status: "pending", note: "" },
        location42: { value: "", status: "pending", note: "" },
        penalties42: { value: "", status: "pending", note: "" },
        comments42: { value: "", status: "pending", note: "" },
      },
    ]);
    setDriverLicensePermit([
      {
        LicenseNo: { value: "", status: "pending", note: "" },
        type: { value: "", status: "pending", note: "" },
        state53: { value: "", status: "pending", note: "" },
        expiryDate: { value: "", status: "pending", note: "" },
      },
    ]);
    setNoAccidentsChecked(false);
    setNoTrafficConvictionsChecked(false);

    setDriverExperience([
      {
        statesOperated: { value: "", status: "pending", note: "" },
        ClassEquipment: { value: "", status: "pending", note: "" },
        EquipmentType: { value: "", status: "pending", note: "" },
        DateFrom51: { value: "", status: "pending", note: "" },
        DateTo51: { value: "", status: "pending", note: "" },
        ApproximatelyMiles: { value: "", status: "pending", note: "" },
        comments51: { value: "", status: "pending", note: "" },
      },
    ]);
    setEducationHistory([
      {
        school: { value: "", status: "pending", note: "" },
        educationLevel: { value: "", status: "pending", note: "" },
        DateFrom52: { value: "", status: "pending", note: "" },
        DateTo52: { value: "", status: "pending", note: "" },
        comments52: { value: "", status: "pending", note: "" },
      },
    ]);
    setExtraSkills({
      safeDrivingAwards: { value: "", status: "pending", note: "" },
      specialTraining: { value: "", status: "pending", note: "" },
      otherSkills: { value: "", status: "pending", note: "" },
    });
    setViolationField([
      {
        date61: { value: "", status: "pending", note: "" },
        offense61: { value: "", status: "pending", note: "" },
        location61: { value: "", status: "pending", note: "" },
        vehicleOperated: { value: "", status: "pending", note: "" },
      },
    ]);

    setAlcoholDrugTesting([
      {
        testedPositiveEver: { value: "", status: "pending", note: "" },
        DOTCompletion: { value: "", status: "pending", note: "" },
      },
    ]);
    setNoViolationChecked(false);
  };
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
  }, [currentUser?.userType]);

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
      try {
        if (user) {
          const userData = await getUserInfo(user.uid);
          if (userData) {
            setCurrentUser(userData);
            setIsEmailVerified(user.emailVerified);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            localStorage.setItem(
              "isEmailVerified",
              user.emailVerified.toString()
            );
          } else {
            throw new Error("User not found in database");
          }
        } else {
          setCurrentUser(null);
          setIsEmailVerified(false);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isEmailVerified");
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setCurrentUser(null);
        setIsEmailVerified(false);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isEmailVerified");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsEmailVerified(null);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isEmailVerified");
      localStorage.removeItem("formData1");
      localStorage.removeItem("formData");
      localStorage.removeItem("formData8");
      localStorage.removeItem("formData9");
      localStorage.removeItem("formData2");
      localStorage.removeItem("formData3");
      localStorage.removeItem("addressField4");
      localStorage.removeItem("trafficConvictionField4");
      localStorage.removeItem("noAccidentsChecked");
      localStorage.removeItem("noTrafficConvictions");
      localStorage.removeItem("driverLicensePermit5");
      localStorage.removeItem("driverExperience5");
      localStorage.removeItem("educationHistory5");
      localStorage.removeItem("extraSkills5");
      localStorage.removeItem("violationField6");
      localStorage.removeItem("noViolationChecked");
      localStorage.removeItem("alcoholDrugTest7");
      localStorage.removeItem("completedForms");
      localStorage.removeItem("completedSections");

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
        city11: { value: "", status: "pending", note: "" },
        state11: { value: "", status: "pending", note: "" },
        zipCode11: { value: "", status: "pending", note: "" },
        cellPhone: { value: "", status: "pending", note: "" },
        Email: { value: "", status: "pending", note: "" },
        EmergencyContact: { value: "", status: "pending", note: "" },
        EmergencyPhone: { value: "", status: "pending", note: "" },
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
      setFormData8({
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
      setFormData9([
        {
          currentlyWorking: { value: "", status: "pending", note: "" },
          workingForAnotherEmployer: { value: "", status: "pending", note: "" },
        },
      ]);
      setFormData([
        {
          street12: { value: "", status: "pending", note: "" },
          street22: { value: "", status: "pending", note: "" },
          city22: { value: "", status: "pending", note: "" },
          state22: { value: "", status: "pending", note: "" },
          zipCode22: { value: "", status: "pending", note: "" },
        },
      ]);
      setFormData3([
        {
          companyName31: { value: "", status: "pending", note: "" },
          street31: { value: "", status: "pending", note: "" },
          city31: { value: "", status: "pending", note: "" },
          zipCode31: { value: "", status: "pending", note: "" },
          contactPerson: { value: "", status: "pending", note: "" },
          phone31: { value: "", status: "pending", note: "" },
          fax1: { value: "", status: "pending", note: "" },
          from31: { value: "", status: "pending", note: "" },
          to31: { value: "", status: "pending", note: "" },
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
      setAddressField([
        {
          date41: { value: "", status: "pending", note: "" },
          accidentType: { value: "", status: "pending", note: "" },
          location41: { value: "", status: "pending", note: "" },
          fatalities: { value: "", status: "pending", note: "" },
          penalties41: { value: "", status: "pending", note: "" },
          comments41: { value: "", status: "pending", note: "" },
        },
      ]);
      setTrafficConvictionField([
        {
          date42: { value: "", status: "pending", note: "" },
          offenseType: { value: "", status: "pending", note: "" },
          location42: { value: "", status: "pending", note: "" },
          penalties42: { value: "", status: "pending", note: "" },
          comments42: { value: "", status: "pending", note: "" },
        },
      ]);
      setDriverLicensePermit([
        {
          LicenseNo: { value: "", status: "pending", note: "" },
          type: { value: "", status: "pending", note: "" },
          state53: { value: "", status: "pending", note: "" },
          expiryDate: { value: "", status: "pending", note: "" },
        },
      ]);
      setNoAccidentsChecked(false);
      setNoTrafficConvictionsChecked(false);

      setDriverExperience([
        {
          statesOperated: { value: "", status: "pending", note: "" },
          ClassEquipment: { value: "", status: "pending", note: "" },
          EquipmentType: { value: "", status: "pending", note: "" },
          DateFrom51: { value: "", status: "pending", note: "" },
          DateTo51: { value: "", status: "pending", note: "" },
          ApproximatelyMiles: { value: "", status: "pending", note: "" },
          comments51: { value: "", status: "pending", note: "" },
        },
      ]);
      setEducationHistory([
        {
          school: { value: "", status: "pending", note: "" },
          educationLevel: { value: "", status: "pending", note: "" },
          DateFrom52: { value: "", status: "pending", note: "" },
          DateTo52: { value: "", status: "pending", note: "" },
          comments52: { value: "", status: "pending", note: "" },
        },
      ]);
      setExtraSkills({
        safeDrivingAwards: { value: "", status: "pending", note: "" },
        specialTraining: { value: "", status: "pending", note: "" },
        otherSkills: { value: "", status: "pending", note: "" },
      });
      setViolationField([
        {
          date61: { value: "", status: "pending", note: "" },
          offense61: { value: "", status: "pending", note: "" },
          location61: { value: "", status: "pending", note: "" },
          vehicleOperated: { value: "", status: "pending", note: "" },
        },
      ]);

      setAlcoholDrugTesting([
        {
          testedPositiveEver: { value: "", status: "pending", note: "" },
          DOTCompletion: { value: "", status: "pending", note: "" },
        },
      ]);
      setNoViolationChecked(false);
      // Clear the current user
      // Redirect to the homepage or login page
      //console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isEmailVerified,
        handleLogout,
        loading,

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
        applicationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
