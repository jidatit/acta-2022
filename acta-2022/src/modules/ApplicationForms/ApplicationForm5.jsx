import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";

const ApplicationForm5 = () => {
  const navigate = useNavigate();
  const {
    DriverLicensePermit,

    DriverExperience,

    EducationHistory,

    saveDriverLicensePermit,
    saveDriverExperience,
    saveEducationHistory,
    ExtraSkills,
    isSaveClicked,
    saveExtraSkills,
    setIsSaveClicked,
    currentUser,
  } = useAuth();

  const [driverLicensePermit, setDriverLicensePermit] = useState(
    DriverLicensePermit
  );
  const [driverExperience, setDriverExperience] = useState(DriverExperience);
  const [educationHistory, setEducationHistory] = useState(EducationHistory);
  const [extraSkills, setExtraSkills] = useState(ExtraSkills);

  const [errors, setErrors] = useState([]);
  const [extraSkillErrors, setExtraSkillErrors] = useState();
  const [driverExperienceErrors, setDriverExperienceErrors] = useState([]);
  const [driverEducationError, setDriverEducationError] = useState([]);
  // State to track if the checkboxes are checked

  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    setDriverLicensePermit(DriverLicensePermit);
    setDriverExperience(DriverExperience);
    setEducationHistory(EducationHistory);
    setExtraSkills(ExtraSkills);
  }, [DriverExperience, DriverLicensePermit, EducationHistory, ExtraSkills]);

  const handleDriverLicenseChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...driverLicensePermit];
    updatedFields[index][name] = value;
    setDriverLicensePermit(updatedFields);
    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (errors[index] && errors[index][name]) {
      const updatedErrors = [...errors];
      delete updatedErrors[index][name];
      setErrors(updatedErrors);
    }
  };

  const handleDriverExpChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...driverExperience];
    updatedFields[index][name] = value;
    setDriverExperience(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (driverExperienceErrors[index] && driverExperienceErrors[index][name]) {
      const updatedErrors = [...driverExperienceErrors];
      delete updatedErrors[index][name];
      setDriverExperienceErrors(updatedErrors);
    }
  };
  const handleEducationHistoryChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...educationHistory];
    updatedFields[index][name] = value;
    setEducationHistory(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (driverEducationError[index] && driverEducationError[index][name]) {
      const updatedErrors = [...driverEducationError];
      delete updatedErrors[index][name];
      setDriverEducationError(updatedErrors);
    }
  };
  const handleExtraSkillChange = (e) => {
    const { name, value } = e.target;
    setExtraSkills((prevSkills) => ({
      ...prevSkills,
      [name]: value,
    }));

    // Check if all fields are empty
    const allFieldsEmpty = Object.values({
      ...extraSkills,
      [name]: value, // Include the updated field value
    }).every((val) => val.trim() === "");

    setIsSaveClicked(allFieldsEmpty);

    // Remove error message for the updated field if it was previously set
    if (extraSkillErrors[name]) {
      setExtraSkillErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };
  const validateDriverLisFields = () => {
    const newErrors = driverLicensePermit.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const validateDriverExpFields = () => {
    const newErrors = driverExperience.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setDriverExperienceErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const validateEducationHistory = () => {
    const newErrors = educationHistory.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setDriverEducationError(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };
  const validateExtraSkills = () => {
    const fieldErrors = {};
    Object.entries(extraSkills).forEach(([key, value]) => {
      if (value.trim() === "") {
        fieldErrors[key] = "This field is required";
      }
    });

    setExtraSkillErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        driverLicensePermit: driverLicensePermit,
        driverExperience: driverExperience,
        educationHistory: educationHistory,
        extraSkills: extraSkills,
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form5: applicationData,
        });
      } else {
        await setDoc(docRef, {
          form5: applicationData,
        });
      }

      // console.log("Data successfully saved to Firebase");
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm4");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLicenseValid = validateDriverLisFields();
    const isDriverValid = validateDriverExpFields();
    const isEducationValid = validateEducationHistory();
    const isExtraSkillsValid = validateExtraSkills();
    if (
      isLicenseValid ||
      isEducationValid ||
      isDriverValid ||
      isExtraSkillsValid
    ) {
      saveDriverLicensePermit(driverLicensePermit);
      saveEducationHistory(educationHistory);
      saveDriverExperience(driverExperience);
      saveExtraSkills(extraSkills);
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm6");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isLicenseValid = validateDriverLisFields();
    const isDriverValid = validateDriverExpFields();
    const isEducationValid = validateEducationHistory();
    const isExtraSkillsValid = validateExtraSkills();
    if (
      isLicenseValid ||
      isEducationValid ||
      isDriverValid ||
      isExtraSkillsValid
    ) {
      saveDriverLicensePermit(driverLicensePermit);
      saveEducationHistory(educationHistory);
      saveDriverExperience(driverExperience);
      saveExtraSkills(extraSkills);
      toast.success("Form is successfully saved");
      setIsSaveClicked(true);

      await saveToFirebase();
    }
  };

  const addDriverLicenseFields = () => {
    setDriverLicensePermit([
      ...driverLicensePermit,
      {
        LicenseNo: "",
        type: "",
        state: "",
        expiryDate: "",
      },
    ]);
  };

  const addDriverExperience = () => {
    setDriverExperience([
      ...driverExperience,
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
  };
  const addEducationHistory = () => {
    setEducationHistory([
      ...educationHistory,
      {
        school: "",
        educationLevel: "",
        DateFrom: "",
        DateTo: "",
        comments: "",
      },
    ]);
  };
  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[89%] md:w-[80%]">
      <div className="flex flex-row items-start justify-start w-full pr-10">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driving background and Qualifications
          </h1>
          <p className="text-lg text-black font-radios">
            Provide accident record and forfeitures record for previous 3 years
          </p>
        </div>
        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>

      {/* First Form */}
      <div className="flex flex-col w-[95%] md:w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-lg text-black font-radios">
              List all driver licenses or permits held in the past 3 years
            </h1>
          </div>

          {driverLicensePermit.map((license, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor={`LicenseNo-${index}`}
                  className="w-full text-sm font-semibold text-gray-900 font-radios"
                >
                  License no.
                </label>
                <input
                  type="text"
                  name="LicenseNo"
                  id={`LicenseNo-${index}`}
                  value={license.LicenseNo}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].LicenseNo
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].LicenseNo && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].LicenseNo}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`type*-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  id={`type-${index}`}
                  value={license.type}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].type
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].type && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].type}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`state-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id={`state-${index}`}
                  value={license.state}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].state
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].state && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].state}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`expiryDate-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Expiration date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  id={`expiryDate-${index}`}
                  value={license.expiryDate}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].expiryDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].expiryDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].expiryDate}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={addDriverLicenseFields}
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>
        </form>
        <form className="w-full p-6 bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-lg text-black font-radios">
              Driving Experience
            </h1>
          </div>

          {driverExperience.map((experience, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor={`statesOperated-${index}`}
                  className="w-full text-sm font-semibold text-gray-900 font-radios"
                >
                  States Operated In For Last 5 Years*
                </label>
                <input
                  type="text"
                  name="statesOperated"
                  id={`statesOperated-${index}`}
                  value={experience.statesOperated}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].statesOperated
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].statesOperated && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].statesOperated}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`ClassEquipment*-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Class of Equipment*
                </label>
                <input
                  type="text"
                  name="ClassEquipment"
                  id={`ClassEquipment-${index}`}
                  value={experience.ClassEquipment}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].ClassEquipment
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].ClassEquipment && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].ClassEquipment}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`EquipmentType-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Type of Equipment*
                </label>
                <input
                  type="text"
                  name="EquipmentType"
                  id={`EquipmentType-${index}`}
                  value={experience.EquipmentType}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].EquipmentType
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].EquipmentType && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].EquipmentType}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`DateTo-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Date To*
                </label>
                <input
                  type="text"
                  name="DateTo"
                  id={`DateTo-${index}`}
                  value={experience.DateTo}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].DateTo
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].DateTo && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].DateTo}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`DateFrom-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Date From
                </label>
                <input
                  type="text"
                  name="DateFrom"
                  id={`DateFrom-${index}`}
                  value={experience.DateFrom}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].DateFrom
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].DateFrom && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].DateFrom}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor={`ApproximatelyMiles*-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Approximately no of miles*
                </label>
                <input
                  type="text"
                  name="ApproximatelyMiles"
                  id={`ApproximatelyMiles-${index}`}
                  value={experience.ApproximatelyMiles}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].ApproximatelyMiles
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].ApproximatelyMiles && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].ApproximatelyMiles}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`comments-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Comments
                </label>
                <input
                  type="text"
                  name="comments"
                  id={`comments-${index}`}
                  value={experience.comments}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverExperienceErrors[index] &&
                    driverExperienceErrors[index].comments
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].comments && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].comments}
                    </p>
                  )}
              </div>
            </div>
          ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={addDriverExperience}
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>
        </form>
        <form className="w-full p-6 bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-lg text-black font-radios">
              Education History
            </h1>
          </div>

          {educationHistory.map((education, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor={`school-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  School (Name, City, State)*
                </label>
                <input
                  type="text"
                  name="school"
                  id={`school-${index}`}
                  value={education.school}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverEducationError[index] &&
                    driverEducationError[index].school
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].school && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].school}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`educationLevel-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Educational Level*
                </label>
                <input
                  type="text"
                  name="educationLevel"
                  id={`educationLevel-${index}`}
                  value={education.educationLevel}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverEducationError[index] &&
                    driverEducationError[index].educationLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].educationLevel && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].educationLevel}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`DateFrom-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Date from*
                </label>
                <input
                  type="text"
                  name="DateFrom"
                  id={`DateFrom-${index}`}
                  value={education.DateFrom}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverEducationError[index] &&
                    driverEducationError[index].DateFrom
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].DateFrom && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].DateFrom}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor={`DateTo-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Date To*
                </label>
                <input
                  type="text"
                  name="DateTo"
                  id={`DateTo-${index}`}
                  value={education.DateTo}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverEducationError[index] &&
                    driverEducationError[index].DateTo
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].DateTo && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].DateTo}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor={`comments-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Comments
                </label>
                <input
                  type="text"
                  name="comments"
                  id={`comments-${index}`}
                  value={education.comments}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    driverEducationError[index] &&
                    driverEducationError[index].comments
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].comments && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].comments}
                    </p>
                  )}
              </div>
            </div>
          ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={addEducationHistory}
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>
        </form>

        <form className="w-full p-6 bg-white shadow-md">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label
                htmlFor={`safeDrivingAwards`}
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                List any safe driving awards you have earned
              </label>
              <input
                type="text"
                name="safeDrivingAwards"
                id={`safeDrivingAwards`}
                value={extraSkills.safeDrivingAwards}
                onChange={(e) => handleExtraSkillChange(e)}
                className={`w-full p-2 mt-1 border ${
                  extraSkillErrors && extraSkillErrors.safeDrivingAwards
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md`}
              />
              {extraSkillErrors && extraSkillErrors.safeDrivingAwards && (
                <p className="mt-1 text-xs text-red-500">
                  {extraSkillErrors.safeDrivingAwards}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`specialTraining`}
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                List any special training that will enable you to be a better
                driver
              </label>
              <input
                type="text"
                name="specialTraining"
                id={`specialTraining`}
                value={extraSkills.specialTraining}
                onChange={(e) => handleExtraSkillChange(e)}
                className={`w-full p-2 mt-1 border ${
                  extraSkillErrors && extraSkillErrors.specialTraining
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md`}
              />
              {extraSkillErrors && extraSkillErrors.specialTraining && (
                <p className="mt-1 text-xs text-red-500">
                  {extraSkillErrors.specialTraining}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`otherSkills`}
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Other Skills or Training
              </label>
              <input
                type="text"
                name="otherSkills"
                id={`otherSkills`}
                value={extraSkills.otherSkills}
                onChange={(e) => handleExtraSkillChange(e)}
                className={`w-full p-2 mt-1 border ${
                  extraSkillErrors && extraSkillErrors.otherSkills
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md`}
              />
              {extraSkillErrors && extraSkillErrors.otherSkills && (
                <p className="mt-1 text-xs text-red-500">
                  {extraSkillErrors.otherSkills}
                </p>
              )}
            </div>
          </div>
        </form>
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
          >
            back
          </button>
          <div className="flex justify-end w-full gap-x-4">
            <button
              type="submit"
              onClick={handleSave}
              className={`px-6 py-2 font-semibold text-white bg-green-600 rounded-lg`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm5;
