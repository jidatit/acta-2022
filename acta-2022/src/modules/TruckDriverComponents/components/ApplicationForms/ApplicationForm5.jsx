import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";

const ApplicationForm5 = () => {
  const navigate = useNavigate();
  const {
    DriverLicensePermit,
    DriverExperience,
    EducationHistory,

    ExtraSkills,
    isSaveClicked,

    setIsSaveClicked,
    currentUser,
  } = useAuth();

  const [driverLicensePermit, setDriverLicensePermit] =
    useState(DriverLicensePermit);
  const [driverExperience, setDriverExperience] = useState(DriverExperience);
  const [educationHistory, setEducationHistory] = useState(EducationHistory);
  const [extraSkills, setExtraSkills] = useState(ExtraSkills);

  const [errors, setErrors] = useState([]);
  const [driverExperienceErrors, setDriverExperienceErrors] = useState([]);
  const [driverEducationError, setDriverEducationError] = useState([]);
  // State to track if the checkboxes are checked
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
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
    updatedFields[index][name].value = value; // Update the value property
    setDriverLicensePermit(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.value.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };

  const handleDriverExpChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...driverExperience];
    updatedFields[index][name].value = value; // Update the value property
    setDriverExperience(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.value.trim() === "")
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
    updatedFields[index][name].value = value; // Update the value property
    setEducationHistory(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.value.trim() === "")
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
      [name]: { value, status: "pending", note: "" }, // Update to match new structure
    }));

    const allFieldsEmpty = Object.values({
      ...extraSkills,
      [name]: { value, status: "pending", note: "" },
    }).every((val) => val.value.trim() === "");

    setIsSaveClicked(allFieldsEmpty);
  };
  const validateDriverLisFields = () => {
    // No validation required, just return true
    return true;
  };

  const validateExtraSkills = () => {
    // No validation required, just return true
    return true;
  };
  const validateDriverExpFields = () => {
    const newErrors = driverExperience.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, { value }]) => {
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
      Object.entries(field).forEach(([key, { value }]) => {
        if (value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setDriverEducationError(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
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
          completedForms: 5,
        });
      } else {
        await setDoc(docRef, {
          form5: applicationData,
          completedForms: 5,
        });
      }

      //console.log("Data successfully saved to Firebase");
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      toast.error("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm4");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validations
    const isLicenseValid = validateDriverLisFields();
    const isDriverValid = validateDriverExpFields();
    const isEducationValid = validateEducationHistory();
    const isExtraSkillsValid = validateExtraSkills();

    if (
      isLicenseValid &&
      isEducationValid &&
      isDriverValid &&
      isExtraSkillsValid
    ) {
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm6");
    } else {
      // Show a message indicating the form is incomplete
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if there is at least one field filled out
    const hasDriverLicensePermitData = driverLicensePermit.some((field) =>
      Object.values(field).some((val) => val.value.trim() !== "")
    );

    const hasDriverExperienceData = driverExperience.some((field) =>
      Object.values(field).some((val) => val.value.trim() !== "")
    );

    const hasEducationHistoryData = educationHistory.some((field) =>
      Object.values(field).some((val) => val.value.trim() !== "")
    );

    const hasExtraSkillsData = Object.values(extraSkills).some(
      (val) => val.value.trim() !== ""
    );

    if (
      hasDriverLicensePermitData ||
      hasDriverExperienceData ||
      hasEducationHistoryData ||
      hasExtraSkillsData
    ) {
      // Perform save
      toast.success("Form is successfully saved");
      setIsSaveClicked(true);

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
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Please complete at least one field before saving.");
    }
  };
  const addDriverLicenseFields = () => {
    setDriverLicensePermit([
      ...driverLicensePermit,
      {
        LicenseNo: { value: "", status: "pending", note: "" },
        type: { value: "", status: "pending", note: "" },
        state: { value: "", status: "pending", note: "" },
        expiryDate: { value: "", status: "pending", note: "" },
      },
    ]);
  };

  const addDriverExperience = () => {
    setDriverExperience([
      ...driverExperience,
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
  };

  const addEducationHistory = () => {
    setEducationHistory([
      ...educationHistory,
      {
        school: { value: "", status: "pending", note: "" },
        educationLevel: { value: "", status: "pending", note: "" },
        DateFrom: { value: "", status: "pending", note: "" },
        DateTo: { value: "", status: "pending", note: "" },
        comments: { value: "", status: "pending", note: "" },
      },
    ]);
  };

  const removeDriverLicenseField = (index) => {
    setDriverLicensePermit(driverLicensePermit.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const removeDriverExperienceField = (index) => {
    setDriverExperience(driverExperience.filter((_, i) => i !== index));
    setDriverExperienceErrors(
      driverExperienceErrors.filter((_, i) => i !== index)
    );
  };

  const removeEducationHistoryField = (index) => {
    setEducationHistory(educationHistory.filter((_, i) => i !== index));
    setDriverEducationError(driverEducationError.filter((_, i) => i !== index));
  };
  return (
    <div className=" flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row items-start justify-center w-full ">
        <div className="flex flex-col items-start justify-start w-[98%]">
          <h1 className="w-full mb-4 text-lg smd:text-xl font-bold text-black">
            List all driver licenses or permits held in the past 3 years
          </h1>
          <p className="text-[17px] smd:text-lg text-black font-radios">
            Provide accident record and forfeitures record for previous 3 years
          </p>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>

      {/* First Form */}
      <div className="flex flex-col w-full gap-y-8 -mt-4">
        <form className="w-full bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-[17px] smd:text-lg text-black font-radios">
              List all driver licenses or permits held in the past 3 years
            </h1>
          </div>

          {driverLicensePermit.map((license, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <FormLabelWithStatus
                  label="License no."
                  id={`LicenseNo`}
                  status={license.LicenseNo.status} // Adjust as necessary based on your state
                  note={license.LicenseNo.note} // Adjust as necessary based on your state
                  index={index}
                />
                <input
                  type="text"
                  name="LicenseNo"
                  id={`LicenseNo-${index}`}
                  value={license.LicenseNo.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="Type"
                  id={`type`}
                  status={license.type.status} // Adjust as necessary based on your state
                  note={license.type.note} // Adjust as necessary based on your state
                  index={index}
                />
                <input
                  type="text"
                  name="type"
                  id={`type-${index}`}
                  value={license.type.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="State"
                  id={`state`}
                  status={license.state.status} // Adjust as necessary based on your state
                  note={license.state.note} // Adjust as necessary based on your state
                  index={index}
                />
                <input
                  type="text"
                  name="state"
                  id={`state-${index}`}
                  value={license.state.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="Expiration date"
                  id={`expiryDate`}
                  status={license.expiryDate.status} // Adjust as necessary based on your state
                  note={license.expiryDate.note} // Adjust as necessary based on your state
                  index={index}
                />
                <input
                  type="date"
                  name="expiryDate"
                  id={`expiryDate-${index}`}
                  value={license.expiryDate.value}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center mt-4">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeDriverLicenseField(index)}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
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
              Add More
            </button>
          </div>
        </form>
        <form className="w-full bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-lg text-black font-radios">
              Driving Experience*
            </h1>
          </div>

          {driverExperience.map((experience, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <FormLabelWithStatus
                  label="States Operated In For Last 5 Years"
                  id={`statesOperated`}
                  status={experience.statesOperated.status}
                  note={experience.statesOperated.note}
                  index={index}
                />
                <input
                  type="text"
                  name="statesOperated"
                  id={`statesOperated-${index}`}
                  value={experience.statesOperated.value}
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
                <FormLabelWithStatus
                  label="Class of Equipment"
                  id={`ClassEquipment`}
                  status={experience.ClassEquipment.status}
                  note={experience.ClassEquipment.note}
                  index={index}
                />
                <input
                  type="text"
                  name="ClassEquipment"
                  id={`ClassEquipment-${index}`}
                  value={experience.ClassEquipment.value}
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
                <FormLabelWithStatus
                  label="Type of Equipment"
                  id={`EquipmentType`}
                  status={experience.EquipmentType.status}
                  note={experience.EquipmentType.note}
                  index={index}
                />
                <input
                  type="text"
                  name="EquipmentType"
                  id={`EquipmentType-${index}`}
                  value={experience.EquipmentType.value}
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
                <FormLabelWithStatus
                  label="Date To"
                  id={`DateTo`}
                  status={experience.DateTo.status}
                  note={experience.DateTo.note}
                  index={index}
                />
                <input
                  type="date"
                  name="DateTo"
                  id={`DateTo-${index}`}
                  value={experience.DateTo.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  max={new Date().toISOString().split("T")[0]}
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
                <FormLabelWithStatus
                  label="Date From"
                  id={`DateFrom`}
                  status={experience.DateFrom.status}
                  note={experience.DateFrom.note}
                  index={index}
                />
                <input
                  type="date"
                  name="DateFrom"
                  id={`DateFrom-${index}`}
                  value={experience.DateFrom.value}
                  min={new Date().toISOString().split("T")[0]}
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
                <FormLabelWithStatus
                  label=" Approximately no of miles"
                  id={`ApproximatelyMiles`}
                  status={experience.ApproximatelyMiles.status}
                  note={experience.ApproximatelyMiles.note}
                  index={index}
                />

                <input
                  type="text"
                  name="ApproximatelyMiles"
                  id={`ApproximatelyMiles-${index}`}
                  value={experience.ApproximatelyMiles.value}
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
                <FormLabelWithStatus
                  label="Comments"
                  id={`comments`}
                  status={experience.comments.status}
                  note={experience.comments.note}
                  index={index}
                />

                <input
                  type="text"
                  name="comments"
                  id={`comments-${index}`}
                  value={experience.comments.value}
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
              <div className="flex items-center mt-4">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeDriverExperienceField(index)}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
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
              Add More
            </button>
          </div>
        </form>
        <form className="w-full bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <h1 className="text-lg text-black font-radios">
              Education History*
            </h1>
          </div>

          {educationHistory.map((education, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            >
              <div>
                <FormLabelWithStatus
                  label="School (Name, City, State)"
                  id={`school`}
                  status={education.school.status} // Adjust the status logic as needed
                  note={education.school.note} // Adjust the note logic as needed
                  index={index}
                />
                <input
                  type="text"
                  name="school"
                  id={`school-${index}`}
                  value={education.school.value}
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
                <FormLabelWithStatus
                  label="Educational Level"
                  id={`educationLevel`}
                  status={education.educationLevel.status} // Adjust the status logic as needed
                  note={education.educationLevel.note} // Adjust the note logic as needed
                  index={index}
                />
                <input
                  type="text"
                  name="educationLevel"
                  id={`educationLevel-${index}`}
                  value={education.educationLevel.value}
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
                <FormLabelWithStatus
                  label="Date from"
                  id={`DateFrom`}
                  status={education.DateFrom.status} // Adjust the status logic as needed
                  note={education.DateFrom.note} // Adjust the note logic as needed
                  index={index}
                />
                <input
                  type="date"
                  name="DateFrom"
                  id={`DateFrom-${index}`}
                  value={education.DateFrom.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  min={new Date().toISOString().split("T")[0]}
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
                <FormLabelWithStatus
                  label="Date To"
                  id={`DateTo`}
                  status={education.DateTo.status} // Adjust the status logic as needed
                  note={education.DateTo.note} // Adjust the note logic as needed
                  index={index}
                />
                <input
                  type="date"
                  name="DateTo"
                  id={`DateTo-${index}`}
                  value={education.DateTo.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  max={new Date().toISOString().split("T")[0]}
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
                <FormLabelWithStatus
                  label="Comments"
                  id={`comments`}
                  status={education.comments.status} // Adjust the status logic as needed
                  note={education.comments.note} // Adjust the note logic as needed
                  index={index}
                />
                <input
                  type="text"
                  name="comments"
                  id={`comments-${index}`}
                  value={education.comments.value}
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
              <div className="flex items-center mt-4">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeEducationHistoryField(index)}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
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
              Add More
            </button>
          </div>
        </form>

        <form className="w-full bg-white shadow-md">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <SingleLabelLogic
                htmlFor="safeDrivingAwards"
                labelName="List any safe driving awards you have earned"
                status={extraSkills.safeDrivingAwards.status} // Adjust the status accordingly
                note={extraSkills.safeDrivingAwards.note} // Adjust the note accordingly
              />
              <input
                type="text"
                name="safeDrivingAwards"
                id="safeDrivingAwards"
                value={extraSkills.safeDrivingAwards.value}
                onChange={(e) => handleExtraSkillChange(e)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <SingleLabelLogic
                htmlFor="specialTraining"
                labelName="List any special training that will enable you to be a better driver"
                status={extraSkills.specialTraining.status} // Adjust the status accordingly
                note={extraSkills.specialTraining.note} // Adjust the note accordingly
              />
              <input
                type="text"
                name="specialTraining"
                id="specialTraining"
                value={extraSkills.specialTraining.value}
                onChange={(e) => handleExtraSkillChange(e)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <SingleLabelLogic
                htmlFor="otherSkills"
                labelName="Other Skills or Training"
                status={extraSkills.otherSkills.status} // Adjust the status accordingly
                note={extraSkills.otherSkills.note} // Adjust the note accordingly
              />
              <input
                type="text"
                name="otherSkills"
                id="otherSkills"
                value={extraSkills.otherSkills.value}
                onChange={(e) => handleExtraSkillChange(e)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </form>
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
          >
            back
          </button>
          <div className="flex justify-end w-full gap-x-2">
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
