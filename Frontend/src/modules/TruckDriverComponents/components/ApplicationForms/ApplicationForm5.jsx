/* eslint-disable no-case-declarations */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";
import { useAuthAdmin } from "../../../../AdminContext";
import { useEdit } from "../../../../../EditContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
const ApplicationForm5 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();

  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const {
    isSaveClicked,
    setIsSaveClicked,
    DriverLicensePermit,
    DriverExperience,
    EducationHistory,
    applicationStatus,
    ExtraSkills,
  } = currentUser?.userType === "Admin" ? adminAuthData : authData;

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);

  const [driverLicensePermit, setDriverLicensePermit] =
    useState(DriverLicensePermit);
  const [driverExperience, setDriverExperience] = useState(DriverExperience);
  const [educationHistory, setEducationHistory] = useState(EducationHistory);
  const [extraSkills, setExtraSkills] = useState(ExtraSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [driverExperienceErrors, setDriverExperienceErrors] = useState([]);
  const [driverEducationError, setDriverEducationError] = useState([]);
  // State to track if the checkboxes are checked
  const { editStatus, setEditStatus } = useEdit();
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const checkIfAllFieldsApproved = useCallback(() => {
    const allFieldsApproved = (fields) =>
      fields.every((field) =>
        Object.values(field).every((subField) => subField.status === "approved")
      );

    const allDriverLicenseApproved = allFieldsApproved(driverLicensePermit);
    const allDriverExperienceApproved = allFieldsApproved(driverExperience);
    const allEducationHistoryApproved = allFieldsApproved(educationHistory);
    const allExtraSkillsApproved = Object.values(extraSkills).every(
      (field) => field.status === "approved"
    );

    return (
      allDriverLicenseApproved &&
      allDriverExperienceApproved &&
      allEducationHistoryApproved &&
      allExtraSkillsApproved
    );
  }, [driverLicensePermit, driverExperience, educationHistory, extraSkills]);
  useEffect(() => {
    if (
      editStatus &&
      (checkIfAllFieldsApproved() || applicationStatus === "approved")
    ) {
      setEditStatus(false);
      setIsApprovedModalOpen(true);
    }
  }, [editStatus, checkIfAllFieldsApproved]);

  const handleCloseModal = () => {
    setIsApprovedModalOpen(false);
  };
  const hasValue = useCallback(
    (formType, fieldName, index = 0) => {
      // If in edit mode, enable all fields
      let toValue = checkIfAllFieldsApproved();
      if (
        (toValue || applicationStatus === "approved") &&
        currentUser.userType !== "Admin"
      ) {
        setEditStatus(false);
        return true;
      }
      if (currentUser && currentUser.userType !== "Admin") {
        if (
          editStatus ||
          (isEditing && (!toValue || applicationStatus === "approved"))
        ) {
          return false;
        }

        // If form hasn't been saved yet, keep fields enabled
        if (!isSaveClicked) {
          return false;
        }

        // Handle driver license permit fields
        if (formType === "license") {
          // Check if the index exists in the original data
          if (index >= DriverLicensePermit.length) {
            return false; // New fields should be enabled
          }

          // Get the current field value
          const currentField = driverLicensePermit[index]?.[fieldName];

          // If this is a new field (not in original data) or the field is empty, it should be enabled
          if (!currentField || !currentField.value) {
            return false;
          }

          // Check if this field was in the original data and had a value
          const originalField = DriverLicensePermit[index]?.[fieldName];
          return originalField?.value ? true : false;
        }

        // Handle driver experience fields
        if (formType === "experience") {
          if (index >= DriverExperience.length) {
            return false;
          }
          const field = DriverExperience[index]?.[fieldName];
          return field?.value ? true : false;
        }

        // Handle education history fields
        if (formType === "education") {
          if (index >= EducationHistory.length) {
            return false;
          }
          const field = EducationHistory[index]?.[fieldName];
          return field?.value ? true : false;
        }

        // Handle extra skills fields
        if (formType === "skills") {
          const field = ExtraSkills[fieldName];
          return field?.value ? true : false;
        }

        return false;
      }
    },
    [
      isSaveClicked,
      isEditing,
      editStatus,
      DriverLicensePermit,
      driverLicensePermit,
      DriverExperience,
      EducationHistory,
      ExtraSkills,
    ]
  );

  // Helper function to determine if all fields in a license entry are empty
  const isLicenseEntryEmpty = (license) => {
    return Object.values(license).every(
      (field) => !field.value || field.value.trim() === ""
    );
  };

  // Helper functions remain the same
  const hasLicenseValue = useCallback(
    (fieldName, index) => hasValue("license", fieldName, index),
    [hasValue]
  );

  const hasExperienceValue = useCallback(
    (fieldName, index) => hasValue("experience", fieldName, index),
    [hasValue]
  );

  const hasEducationValue = useCallback(
    (fieldName, index) => hasValue("education", fieldName, index),
    [hasValue]
  );

  const hasSkillValue = useCallback(
    (fieldName) => hasValue("skills", fieldName),
    [hasValue]
  );

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
    setDriverLicensePermit((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: { ...updated[index][name], value },
      };
      return updated;
    });
  };

  const handleDriverExpChange = (e, index) => {
    const { name, value } = e.target;

    // Update only the specific field within the driverExperience array
    setDriverExperience((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, [name]: { ...field[name], value } } : field
      )
    );

    // Mark as editing when typing
    setIsEditing(false);

    // Clear errors if the field is filled
    setDriverExperienceErrors((prevErrors) => {
      if (prevErrors[index] && prevErrors[index][name] && value.trim() !== "") {
        const updatedErrors = [...prevErrors];
        delete updatedErrors[index][name];
        return updatedErrors;
      }
      return prevErrors;
    });
  };

  const handleEducationHistoryChange = (e, index) => {
    const { name, value } = e.target;

    // Update only the specific field within the educationHistory array
    setEducationHistory((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, [name]: { ...field[name], value } } : field
      )
    );
    setIsEditing(false);
    // Clear specific error if the field is now filled
    setDriverEducationError((prevErrors) => {
      if (prevErrors[index] && prevErrors[index][name] && value.trim() !== "") {
        const updatedErrors = [...prevErrors];
        delete updatedErrors[index][name];
        return updatedErrors;
      }
      return prevErrors;
    });
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

  const saveToFirebase = async (formNumber, formData, isSubmit = false) => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      // Create the update object with the form data
      const formUpdate = {
        ...formData,
        submittedAt: new Date(),
        isSubmitted: isSubmit,
      };
      const updateObject = {
        [`form${formNumber}`]: formUpdate,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentCompletedForms = existingData.completedForms || 0;
        const currentSavedForms = existingData.savedForms || 0;
        if (5 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 5;
        }
        // Only update completedForms if the new form number is higher
        if (formNumber > currentCompletedForms) {
          updateObject.completedForms = formNumber;
        }
        await updateDoc(docRef, updateObject);
      } else {
        // For new documents, set the completedForms to the current form number
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 5,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
    }
  };
  const saveForm5 = async (isSubmit = false) => {
    const applicationData = {
      driverLicensePermit: driverLicensePermit,
      driverExperience: driverExperience,
      educationHistory: educationHistory,
      extraSkills: extraSkills,
    };
    await saveToFirebase(5, applicationData, isSubmit);
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

      await saveForm5(true);
      navigate("/TruckDriverLayout/ApplicationForm6");
    } else {
      // Show a message indicating the form is incomplete
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    try {
      // Only validate fields for non-admin users
      if (currentUser.userType !== "Admin") {
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

        // Check if at least one section has data for non-admin users
        if (
          !hasDriverLicensePermitData &&
          !hasDriverExperienceData &&
          !hasEducationHistoryData &&
          !hasExtraSkillsData
        ) {
          toast.error("Please complete at least one field before saving.");
          return;
        }
      }

      // Proceed with saving regardless of validation for admin users

      let docRef;
      if (currentUser.userType === "Admin") {
        docRef = doc(db, "truck_driver_applications", uid);
      } else {
        docRef = doc(db, "truck_driver_applications", currentUser.uid);
      }

      const docSnap = await getDoc(docRef);

      const applicationData = {
        driverLicensePermit: driverLicensePermit,
        driverExperience: driverExperience,
        educationHistory: educationHistory,
        extraSkills: extraSkills,
        submittedAt: new Date(),
      };

      let updateObject = {
        form5: applicationData,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        if (5 > currentSavedForms) {
          updateObject.savedForms = 5;
        }

        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }
        await updateDoc(docRef, updateObject);
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 5,
          completedForms: 5,
        });
      }
      setIsEditing(false);
      setIsSaveClicked(true);
      setEditStatus(false);
      toast.success("Form is successfully saved");
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the application, please try again.");
    }
  };

  if (currentUser.userType === "Admin") {
    useEffect(() => {
      console.log("child clicked", clicked);
      setClicked(false);
      if (clicked) {
        handleSave(uid, 5);
      }
    }, [clicked]);
  }

  const addDriverLicenseFields = () => {
    const newField = {
      LicenseNo: { value: "", status: "pending", note: "" },
      type: { value: "", status: "pending", note: "" },
      state53: { value: "", status: "pending", note: "" },
      expiryDate: { value: "", status: "pending", note: "" },
    };

    setDriverLicensePermit((prev) => [...prev, newField]);
  };

  const addDriverExperience = () => {
    setDriverExperience([
      ...driverExperience,
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
  };

  const addEducationHistory = () => {
    setEducationHistory([
      ...educationHistory,
      {
        school: { value: "", status: "pending", note: "" },
        educationLevel: { value: "", status: "pending", note: "" },
        DateFrom52: { value: "", status: "pending", note: "" },
        DateTo52: { value: "", status: "pending", note: "" },
        comments52: { value: "", status: "pending", note: "" },
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
  const isDisabled =
    checkIfAllFieldsApproved() || applicationStatus === "approved";
  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4 ${
        currentUser.userType === "Admin" ? "min-h-[85vh]" : "min-h-[94.9vh]"
      }`}
    >
      <div className="flex flex-col w-full justify-end">
        <div className="flex flex-row items-start justify-center w-full ">
          <div className="flex flex-col items-start justify-start w-[98%]">
            <h1 className="w-full mb-4 text-lg smd:text-xl font-bold text-black">
              List all driver licenses or permits held in the past 3 years
            </h1>
            <p className="text-[17px] smd:text-lg text-black font-radios">
              Provide accident record and forfeitures record for previous 3
              years
            </p>
          </div>
          {currentUser.userType !== "Admin" && (
            <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
          )}
        </div>
        <Dialog
          open={isApprovedModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="approved-dialog-title"
          aria-describedby="approved-dialog-description"
        >
          <DialogTitle id="approved-dialog-title">
            Form Approval Status
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="approved-dialog-description">
              All fields have been approved by the admin, so editing is not
              allowed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="outline"
              sx={{
                backgroundColor: "red",
                color: "white",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
                  fieldName="LicenseNo"
                  uid={uid}
                  important={true}
                />
                <input
                  type="text"
                  name="LicenseNo"
                  id={`LicenseNo-${index}`}
                  value={license.LicenseNo.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="Type"
                  id={`type`}
                  status={license.type.status} // Adjust as necessary based on your state
                  note={license.type.note} // Adjust as necessary based on your state
                  index={index}
                  fieldName="type"
                  uid={uid}
                  important={true}
                />
                <input
                  type="text"
                  name="type"
                  id={`type-${index}`}
                  value={license.type.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="State"
                  id={`state53`}
                  status={license.state53.status} // Adjust as necessary based on your state53
                  note={license.state53.note} // Adjust as necessary based on your state53
                  index={index}
                  fieldName="state53"
                  uid={uid}
                  important={true}
                />
                <input
                  type="text"
                  name="state53"
                  id={`state53-${index}`}
                  value={license.state53.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <FormLabelWithStatus
                  label="Expiration date"
                  id={`expiryDate`}
                  status={license.expiryDate.status} // Adjust as necessary based on your state
                  note={license.expiryDate.note} // Adjust as necessary based on your state
                  index={index}
                  fieldName="expiryDate"
                  uid={uid}
                  important={true}
                />
                <input
                  type="date"
                  name="expiryDate"
                  id={`expiryDate-${index}`}
                  value={license.expiryDate.value}
                  onChange={(e) => handleDriverLicenseChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
              </div>
              {currentUser.userType !== "Admin" ? (
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
              ) : (
                <></>
              )}
            </div>
          ))}
          {currentUser.userType !== "Admin" ? (
            <div className="flex items-end justify-end w-full">
              <button
                type="button"
                onClick={addDriverLicenseFields}
                className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add More
              </button>
            </div>
          ) : (
            <></>
          )}
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
                  fieldName="statesOperated"
                  uid={uid}
                />
                <input
                  type="text"
                  name="statesOperated"
                  id={`statesOperated-${index}`}
                  value={experience.statesOperated.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.statesOperated
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
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
                  fieldName="ClassEquipment"
                  uid={uid}
                />
                <input
                  type="text"
                  name="ClassEquipment"
                  id={`ClassEquipment-${index}`}
                  value={experience.ClassEquipment.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.ClassEquipment
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
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
                  fieldName="EquipmentType"
                  uid={uid}
                />
                <input
                  type="text"
                  name="EquipmentType"
                  id={`EquipmentType-${index}`}
                  value={experience.EquipmentType.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.EquipmentType
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
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
                  id={`DateTo51`}
                  status={experience.DateTo51.status}
                  note={experience.DateTo51.note}
                  index={index}
                  fieldName="DateTo51"
                  uid={uid}
                />
                <input
                  type="date"
                  name="DateTo51"
                  id={`DateTo51-${index}`}
                  value={experience.DateTo51.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.DateTo51
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].DateTo51 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].DateTo51}
                    </p>
                  )}
              </div>
              <div>
                <FormLabelWithStatus
                  label="Date From"
                  id={`DateFrom51`}
                  status={experience.DateFrom51.status}
                  note={experience.DateFrom51.note}
                  index={index}
                  fieldName="DateFrom51"
                  uid={uid}
                />
                <input
                  type="date"
                  name="DateFrom51"
                  id={`DateFrom51-${index}`}
                  value={experience.DateFrom51.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.DateFrom51
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].DateFrom51 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].DateFrom51}
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
                  fieldName="ApproximatelyMiles"
                  uid={uid}
                />

                <input
                  type="text"
                  name="ApproximatelyMiles"
                  id={`ApproximatelyMiles-${index}`}
                  value={experience.ApproximatelyMiles.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.ApproximatelyMiles
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
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
                  id={`comments51`}
                  status={experience.comments51.status}
                  note={experience.comments51.note}
                  index={index}
                  fieldName="comments51"
                  uid={uid}
                />

                <input
                  type="text"
                  name="comments51"
                  id={`comments51-${index}`}
                  value={experience.comments51.value}
                  onChange={(e) => handleDriverExpChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverExperienceErrors[index]?.comments51
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverExperienceErrors[index] &&
                  driverExperienceErrors[index].comments51 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverExperienceErrors[index].comments51}
                    </p>
                  )}
              </div>
              {currentUser.userType !== "Admin" ? (
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
              ) : (
                <></>
              )}
            </div>
          ))}
          {currentUser.userType !== "Admin" ? (
            <div className="flex items-end justify-end w-full">
              <button
                type="button"
                onClick={addDriverExperience}
                className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add More
              </button>
            </div>
          ) : (
            <></>
          )}
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
                  fieldName="school"
                  uid={uid}
                />
                <input
                  type="text"
                  name="school"
                  id={`school-${index}`}
                  value={educationHistory[index].school.value} // Make sure you reference the correct array
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverEducationError[index]?.school
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverEducationError[index]?.school && (
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
                  fieldName="educationLevel"
                  uid={uid}
                />
                <input
                  type="text"
                  name="educationLevel"
                  id={`educationLevel-${index}`}
                  value={education.educationLevel.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverEducationError[index]?.educationLevel
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
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
                  id={`DateFrom52`}
                  status={education.DateFrom52.status} // Adjust the status logic as needed
                  note={education.DateFrom52.note} // Adjust the note logic as needed
                  index={index}
                  fieldName="DateFrom52"
                  uid={uid}
                />
                <input
                  type="date"
                  name="DateFrom52"
                  id={`DateFrom52-${index}`}
                  value={education.DateFrom52.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverEducationError[index]?.DateFrom52
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].DateFrom52 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].DateFrom52}
                    </p>
                  )}
              </div>
              <div>
                <FormLabelWithStatus
                  label="Date To"
                  id={`DateTo52`}
                  status={education.DateTo52.status} // Adjust the status logic as needed
                  note={education.DateTo52.note} // Adjust the note logic as needed
                  index={index}
                  fieldName="DateTo52"
                  uid={uid}
                />
                <input
                  type="date"
                  name="DateTo52"
                  id={`DateTo52-${index}`}
                  value={education.DateTo52.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverEducationError[index]?.DateTo52
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].DateTo52 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].DateTo52}
                    </p>
                  )}
              </div>

              <div>
                <FormLabelWithStatus
                  label="Comments"
                  id={`comments52`}
                  status={education.comments52.status} // Adjust the status logic as needed
                  note={education.comments52.note} // Adjust the note logic as needed
                  index={index}
                  fieldName="comments52"
                  uid={uid}
                />
                <input
                  type="text"
                  name="comments52"
                  id={`comments52-${index}`}
                  value={education.comments52.value}
                  onChange={(e) => handleEducationHistoryChange(e, index)}
                  disabled={isDisabled}
                  className={`w-full p-2 mt-1 border rounded-md ${
                    driverEducationError[index]?.comments52
                      ? "border-red-500 border-2"
                      : ""
                  } ${
                    isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                  }`}
                />
                {driverEducationError[index] &&
                  driverEducationError[index].comments52 && (
                    <p className="mt-1 text-xs text-red-500">
                      {driverEducationError[index].comments52}
                    </p>
                  )}
              </div>
              {currentUser.userType !== "Admin" ? (
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
              ) : (
                <></>
              )}
            </div>
          ))}
          {currentUser.userType !== "Admin" && (
            <div className="flex items-end justify-end w-full">
              <button
                type="button"
                onClick={addEducationHistory}
                className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add More
              </button>
            </div>
          )}
        </form>

        <form className="w-full bg-white shadow-md">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <SingleLabelLogic
                htmlFor="safeDrivingAwards"
                labelName="List any safe driving awards you have earned"
                status={extraSkills.safeDrivingAwards.status} // Adjust the status accordingly
                note={extraSkills.safeDrivingAwards.note} // Adjust the note accordingly
                fieldName="safeDrivingAwards"
                uid={uid}
                important={true}
              />
              <input
                type="text"
                name="safeDrivingAwards"
                id="safeDrivingAwards"
                value={extraSkills.safeDrivingAwards.value}
                onChange={(e) => handleExtraSkillChange(e)}
                disabled={isDisabled}
                className={`w-full p-2 mt-1 border rounded-md  ${
                  isDisabled ? "" : "bg-white border-gray-300"
                }`}
              />
            </div>
            <div>
              <SingleLabelLogic
                htmlFor="specialTraining"
                labelName="List any special training that will enable you to be a better driver"
                status={extraSkills.specialTraining.status} // Adjust the status accordingly
                note={extraSkills.specialTraining.note} // Adjust the note accordingly
                fieldName="specialTraining"
                uid={uid}
                important={true}
              />
              <input
                type="text"
                name="specialTraining"
                id="specialTraining"
                value={extraSkills.specialTraining.value}
                onChange={(e) => handleExtraSkillChange(e)}
                disabled={isDisabled}
                className={`w-full p-2 mt-1 border rounded-md  ${
                  isDisabled ? "" : "bg-white border-gray-300"
                }`}
              />
            </div>
            <div>
              <SingleLabelLogic
                htmlFor="otherSkills"
                labelName="Other Skills or Training"
                status={extraSkills.otherSkills.status} // Adjust the status accordingly
                note={extraSkills.otherSkills.note} // Adjust the note accordingly
                fieldName="otherSkills"
                uid={uid}
                important={true}
              />
              <input
                type="text"
                name="otherSkills"
                id="otherSkills"
                value={extraSkills.otherSkills.value}
                onChange={(e) => handleExtraSkillChange(e)}
                disabled={isDisabled}
                className={`w-full p-2 mt-1 border rounded-md  ${isDisabled}`}
              />
            </div>
          </div>
        </form>
        {currentUser.userType !== "Admin" ? (
          <div className="flex items-center justify-between w-full mt-10">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 font-semibold text-white bg-gray-400 rounded-md hover:bg-gray-500"
            >
              Back
            </button>
            <div>
              <button
                type="button"
                onClick={() => handleSave(currentUser.uid)}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 ml-4 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ApplicationForm5;
