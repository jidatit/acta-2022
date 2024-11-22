import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../AuthContext";
import { useNavigate } from "react-router";
import { FaBell } from "react-icons/fa";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
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
const ApplicationForm8 = ({ uid, clicked, setClicked }) => {
  const defaultFormData = [
    {
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
    },
  ];
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const { editStatus, setEditStatus } = useEdit();
  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const { isSaveClicked, setIsSaveClicked, formData8, applicationStatus } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);

  const [localFormData, setLocalFormData] = useState(
    formData8 || defaultFormData
  );
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);

  const checkIfAllFieldsApproved = useCallback(() => {
    if (!Array.isArray(localFormData)) {
      console.error("localFormData is not an array:", localFormData);
      return false;
    }
    return localFormData.every((field) =>
      Object.values(field || {}).every(
        (subField) => subField.status === "approved"
      )
    );
  }, [localFormData]);
  useEffect(() => {
    if (Array.isArray(formData8)) {
      setLocalFormData(formData8);
    } else {
      console.error("formData8 is not an array:", formData8);
      setLocalFormData(defaultFormData);
    }
  }, [formData8]);
  useEffect(() => {
    // If editStatus is true and all fields are approved, disable edit mode
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
  const [errors, setErrors] = useState([]);
  const convertTimeToAMPM = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour24 = parseInt(hours, 10);
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12; // Convert to 12-hour format

    return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`; // Format as 'hh:mm AM/PM'
  };
  const hasValue = (fieldName, index) => {
    // If we don't have access to localFormData or it's not an array, return false
    let toValue = checkIfAllFieldsApproved();

    if (
      (toValue || applicationStatus === "approved") &&
      currentUser.userType !== "Admin"
    ) {
      setEditStatus(false);
      return true;
    }
    if (currentUser && currentUser.userType !== "Admin") {
      if (!formData8 || !Array.isArray(formData8)) return false;

      const field = formData8[index];
      if (!field) return false;

      // Get the field value using the fieldName
      const fieldData = field[fieldName];

      // If we're in edit mode, enable all fields regardless of value
      if (editStatus && (!toValue || applicationStatus === "approved")) {
        return false;
      }

      // Check if the field exists and has a value
      if (fieldData && fieldData.value) {
        // For date fields, check if it's a valid date string
        if (
          fieldName.toLowerCase().includes("date") ||
          (fieldName.startsWith("day") && !fieldName.includes("HoursWorked"))
        ) {
          return fieldData.value !== "";
        }

        // For hours worked fields
        if (fieldName.includes("HoursWorked")) {
          return fieldData.value !== "";
        }

        // For total hours
        if (fieldName === "TotalHours") {
          return fieldData.value !== "";
        }

        // For relieved time
        if (fieldName === "relievedTime") {
          return fieldData.value !== "00:00" && fieldData.value !== "";
        }

        // For any other fields
        return Boolean(fieldData.value);
      }

      return false;
    }
  };
  // Update the formatTimeForInput function
  const formatTimeForInput = (time) => {
    if (!time || typeof time !== "object" || !time.value) return "";

    const [hourMinute, period] = time.value.split(" ");
    const [hour, minute] = hourMinute.split(":");
    let hour24 = parseInt(hour, 10);

    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };
  // Handler function for when the time input changes

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (formData8 && formData8.length > 0) {
      setLocalFormData(formData8);
    } else {
      setLocalFormData(defaultFormData); // Ensure structure is in place even if formData8 is empty
    }
  }, [formData8]);
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm7");
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
      let updateObject = {
        [`form${formNumber}`]: formUpdate,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentCompletedForms = existingData.completedForms || 0;
        const currentSavedForms = existingData.savedForms || 0;
        if (8 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 8;
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
          savedForms: 8,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
    }
  };
  const saveForm8 = async (isSubmit = false) => {
    const applicationData = {
      onDutyHours: localFormData,
    };
    await saveToFirebase(8, applicationData, isSubmit);
  };
  const validateForm = () => {
    const newErrors = localFormData.map((formEntry) => {
      const fieldErrors = {};

      const requiredFields = [
        "day1",
        "day2",
        "day3",
        "day4",
        "day5",
        "day6",
        "day7",
        "day1HoursWorked",
        "day2HoursWorked",
        "day3HoursWorked",
        "day4HoursWorked",
        "day5HoursWorked",
        "day6HoursWorked",
        "day7HoursWorked",
        "TotalHours",
        "relievedTime",
        "relievedDate",
      ];

      requiredFields.forEach((key) => {
        const value = formEntry[key].value;
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" && isNaN(value))
        ) {
          fieldErrors[key] = "This field is required";
        }
      });

      return fieldErrors;
    });

    setErrors(newErrors);
    return newErrors?.every(
      (fieldErrors) => Object.keys(fieldErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(false);

    if (validateForm()) {
      setIsSaveClicked(true);

      await saveForm8(true);
      navigate("/TruckDriverLayout/ApplicationForm9");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    // Check if at least one field is filled for non-admin users
    if (currentUser.userType !== "Admin") {
      // Debug logging
      console.log("Form Data to validate:", localFormData);

      // Check if localFormData is array and not empty
      if (!Array.isArray(localFormData) || localFormData.length === 0) {
        toast.error("No form data available to save");
        return;
      }

      // Improved validation to check each entry's fields
      const isAnyFieldFilled = localFormData.some((formEntry) => {
        // Debug each entry
        console.log("Checking entry:", formEntry);

        return Object.entries(formEntry).some(([key, field]) => {
          // Skip checking status and note fields
          if (key === "status" || key === "note") return false;

          // Check if field has a value property and it's not empty
          const hasValue = field?.value && field.value.toString().trim() !== "";
          console.log(`Field ${key}:`, { value: field?.value, hasValue });
          return hasValue;
        });
      });

      console.log("Validation result:", { isAnyFieldFilled });

      if (!isAnyFieldFilled) {
        toast.error("Please fill in at least one field before saving");
        return;
      }
    }

    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        onDutyHours: localFormData,
        submittedAt: new Date(),
      };

      let updateObject = {
        form8: applicationData,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        if (8 > currentSavedForms) {
          updateObject.savedForms = 8;
        }

        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }

        await updateDoc(docRef, updateObject);
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 8,
          completedForms: 8,
        });
      }

      setIsSaveClicked(true);
      setEditStatus(false);
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the form. Please try again");
    }
  };
  if (currentUser.userType === "Admin") {
    useEffect(() => {
      console.log("child clicked", clicked);
      setClicked(false);
      if (clicked) {
        handleSave(uid, 8);
      }
    }, [clicked]);
  }
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    if (
      name === "day1" ||
      name === "day2" ||
      name === "day3" ||
      name === "day4" ||
      name === "day5" ||
      name === "day6" ||
      name === "day7" ||
      name === "relievedDate"
    ) {
      const updatedFields = localFormData.map((field, i) =>
        i === index
          ? {
              ...field,
              [name]: { value: value, status: "pending", note: "" },
            }
          : field
      );
      setLocalFormData(updatedFields);
    } else if (name === "relievedTime") {
      const timeFormatted = convertTimeToAMPM(value); // Convert to AM/PM format
      const updatedFields = localFormData.map((field, i) =>
        i === index
          ? {
              ...field,
              [name]: { value: timeFormatted, status: "pending", note: "" },
            }
          : field
      );
      setLocalFormData(updatedFields);
    } else {
      const updatedFields = localFormData.map((field, i) =>
        i === index
          ? {
              ...field,
              [name]: { value: value, status: "pending", note: "" },
            }
          : field
      );

      // Calculate total hours as before...
      const totalHours = [
        "day1HoursWorked",
        "day2HoursWorked",
        "day3HoursWorked",
        "day4HoursWorked",
        "day5HoursWorked",
        "day6HoursWorked",
        "day7HoursWorked",
      ].reduce((sum, dayField) => {
        const hours = parseFloat(updatedFields[index][dayField].value) || 0; // Handle empty fields or NaN
        return sum + hours;
      }, 0);

      // Update the TotalHours field with the calculated sum
      updatedFields[index].TotalHours = {
        value: totalHours,
        status: "pending",
        note: "",
      };
      setLocalFormData(updatedFields);
    }

    // Update errors based on new input
    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name]: value.trim() === "" ? "This field is required" : "",
          }
        : error
    );

    setErrors(updatedErrors);

    const allFieldsEmpty = localFormData?.every((address) =>
      Object.values(address)?.every(
        (fieldValue) => fieldValue.value.trim() === ""
      )
    );

    setIsSaveClicked(allFieldsEmpty);
  };
  const isDisabled =
    checkIfAllFieldsApproved() || applicationStatus === "approved";
  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full pr-4 ${
        currentUser.userType === "Admin" ? "min-h-[85vh]" : "min-h-[94.9vh]"
      }`}
    >
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
      <div className=" flex flex-col w-full">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Statement of On-Duty Hours*
          </h1>
          {currentUser.userType !== "Admin" && (
            <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
          )}
        </div>
      </div>

      <div className=" flex flex-col w-full flex-wrap">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pr-4">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6 w-full">
                <div className="grid w-full grid-cols-1 md:grid-cols-1">
                  <div className="flex flex-col gap-y-6 smd:mt-4 w-screen mb-6">
                    <p className="text-black font-radios text-[15px] smd:text-lg w-[79%] sssm:w-[79%] smd:w-[79%] md:w-[70%] xxl:w-[70%] ">
                      INSTRUCTIONS: Motor carriers when using a driver for the
                      first time shall obtain from the driver a signed statement
                      giving the total time on- duty during the immediately
                      preceding 7 days and time at which such driver was last
                      relleved from duty prior to beginning work for such
                      carrier.
                      <br />
                      Rule 395.8(1)(2) Federal Motor Carrier Safety
                      Regulations.NOTE: Hours for any compensated work during
                      the preceding 7 days, including work for a non-motor
                      carrier entity, must be recorded on this form.
                    </p>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 1 (yesterday)"
                          id={`day1`}
                          status={field.day1?.status}
                          note={field.day1?.note}
                          index={index}
                          fieldName="day1"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day1"
                          id={`day1-${index}`}
                          value={field.day1.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day1 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day1 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day1HoursWorked`}
                          status={field.day1HoursWorked?.status}
                          note={field.day1HoursWorked?.note}
                          index={index}
                          fieldName="day1HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day1HoursWorked"
                          id={`day1HoursWorked-${index}`}
                          value={field.day1HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day1HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day1HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 2"
                          id={`day2`}
                          status={field.day2?.status}
                          note={field.day2?.note}
                          index={index}
                          fieldName="day2"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day2"
                          id={`day2-${index}`}
                          value={field.day2.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day2 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day2 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day2}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day2HoursWorked`}
                          status={field.day2HoursWorked?.status}
                          note={field.day2HoursWorked?.note}
                          index={index}
                          fieldName="day2HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day2HoursWorked"
                          id={`day2HoursWorked-${index}`}
                          value={field.day2HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day2HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day2HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day2HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 3"
                          id={`day3`}
                          status={field.day3?.status}
                          note={field.day3?.note}
                          index={index}
                          fieldName="day3"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day3"
                          id={`day3-${index}`}
                          value={field.day3.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day3 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day3 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day3}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day3HoursWorked`}
                          status={field.day3HoursWorked?.status}
                          note={field.day3HoursWorked?.note}
                          index={index}
                          fieldName="day3HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day3HoursWorked"
                          id={`day3HoursWorked-${index}`}
                          value={field.day3HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day3HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day3HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day3HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 4"
                          id={`day4`}
                          status={field.day4?.status}
                          note={field.day4?.note}
                          index={index}
                          fieldName="day4"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day4"
                          id={`day4-${index}`}
                          value={field.day4.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day4 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day4 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day4}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day4HoursWorked`}
                          status={field.day4HoursWorked?.status}
                          note={field.day4HoursWorked?.note}
                          index={index}
                          fieldName="day4HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day4HoursWorked"
                          id={`day4HoursWorked-${index}`}
                          value={field.day4HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day4HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day4HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day4HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 5"
                          id={`day5`}
                          status={field.day5?.status}
                          note={field.day5?.note}
                          index={index}
                          fieldName="day5"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day5"
                          id={`day5-${index}`}
                          value={field.day5.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day5 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day5 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day5}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day5HoursWorked`}
                          status={field.day5HoursWorked?.status}
                          note={field.day5HoursWorked?.note}
                          index={index}
                          fieldName="day5HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day5HoursWorked"
                          id={`day5HoursWorked-${index}`}
                          value={field.day5HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day5HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day5HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day5HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 6"
                          id={`day6`}
                          status={field.day6?.status}
                          note={field.day6?.note}
                          index={index}
                          fieldName="day6"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day6"
                          id={`day6-${index}`}
                          value={field.day6.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day6 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day6 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day6}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day6HoursWorked`}
                          status={field.day6HoursWorked?.status}
                          note={field.day6HoursWorked?.note}
                          index={index}
                          fieldName="day6HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day6HoursWorked"
                          id={`day6HoursWorked-${index}`}
                          value={field.day6HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day6HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day6HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day6HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Day 7"
                          id={`day7`}
                          status={field.day7?.status}
                          note={field.day7?.note}
                          index={index}
                          fieldName="day7"
                          uid={uid}
                        />
                        <input
                          type="date"
                          name="day7"
                          id={`day7-${index}`}
                          value={field.day7.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day7 ? "border-red-500 border-2" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day7 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day7}
                          </p>
                        )}
                      </div>
                      <div
                        className={` ${
                          currentUser.userType === "Admin"
                            ? " xxl:w-[25%] md:w-[35%] smd:w-[35%] w-[65%]"
                            : "xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]"
                        }`}
                      >
                        <FormLabelWithStatus
                          label="Hours Worked"
                          id={`day7HoursWorked`}
                          status={field.day7HoursWorked?.status}
                          note={field.day7HoursWorked?.note}
                          index={index}
                          fieldName="day7HoursWorked"
                          uid={uid}
                        />
                        <input
                          type="number"
                          name="day7HoursWorked"
                          id={`day7HoursWorked-${index}`}
                          value={field.day7HoursWorked.value}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={isDisabled}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day7HoursWorked
                              ? "border-red-500 border-2"
                              : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {errors[index]?.day7HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day7HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-[21%] md:w-[35%] w-[80%] -mt-2">
                  <FormLabelWithStatus
                    label="Total Hours"
                    id={`TotalHours`}
                    status={field.TotalHours?.status}
                    note={field.TotalHours?.note}
                    index={index}
                    fieldName="TotalHours"
                    uid={uid}
                  />
                  <input
                    type="number"
                    name="TotalHours"
                    id={`TotalHours-${index}`}
                    value={field.TotalHours.value}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={isDisabled}
                    className={`w-full p-2 mt-1 border rounded-md ${
                      errors[index]?.TotalHours ? "border-red-500 border-2" : ""
                    } ${
                      isDisabled ? " text-gray-400" : "bg-white border-gray-300"
                    }`}
                  />
                  {errors[index]?.TotalHours && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].TotalHours}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-x-4 lg:w-[21%] md:w-[35%] w-[80%] mt-7">
                  <div className="w-full flex flex-col">
                    <FormLabelWithStatus
                      label="Relieved Time"
                      id={`relievedTime`}
                      status={field.relievedTime?.status}
                      note={field.relievedTime?.note}
                      index={index}
                      fieldName="relievedTime"
                      uid={uid}
                    />
                    <form className="w-full mx-auto mt-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center p-3.5  pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-1 smd:mr-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="time"
                          id={`time-${index}`}
                          name="relievedTime"
                          disabled={isDisabled}
                          className={` bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3.5 smd:p-2.5 ${
                            errors[index]?.relievedTime ? "border-red-500" : ""
                          } ${
                            isDisabled
                              ? "text-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                          min="09:00"
                          max="18:00"
                          required
                          value={
                            field.relievedTime?.value
                              ? formatTimeForInput(field.relievedTime)
                              : ""
                          }
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </div>
                      {errors[index]?.relievedTime && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].relievedTime}
                        </p>
                      )}
                    </form>
                  </div>
                </div>
                <div className=" lg:w-[21%] md:w-[35%] w-[80%] mt-3">
                  <FormLabelWithStatus
                    label="Relieved Date"
                    id={`relievedDate`}
                    status={field.relievedDate?.status}
                    note={field.relievedDate?.note}
                    index={index}
                    fieldName="relievedDate"
                    uid={uid}
                  />
                  <input
                    type="date"
                    name="relievedDate"
                    id={`relievedDate-${index}`}
                    value={field.relievedDate.value}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={isDisabled}
                    className={`w-full p-2.5 mt-1 border rounded-md ${
                      errors[index]?.relievedDate
                        ? "border-red-500 border-2"
                        : ""
                    } ${
                      isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                    }`}
                  />
                  {errors[index]?.relievedDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].relievedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
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

export default ApplicationForm8;
