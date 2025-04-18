import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { useAuthAdmin } from "../../../../AdminContext";
import { useEdit } from "../../../../../EditContext";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
const ApplicationForm9 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const { fetchUserData, currentUser } = adminAuthData;
  const { isSaveClicked, setIsSaveClicked, formData9, applicationStatus } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;
  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);
  const [localFormData, setLocalFormData] = useState(formData9);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (formData9) {
      setLocalFormData(formData9);
    }
    //console.log(localFormData);
  }, [formData9]);
  const { editStatus, setEditStatus } = useEdit();
  const checkIfAllFieldsApproved = useCallback(() => {
    return localFormData.every((field) =>
      Object.values(field).every((subField) => subField.status === "approved")
    );
  }, [localFormData]);
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

  const hasValue = (fieldName, index) => {
    let toValue = checkIfAllFieldsApproved();

    if (
      (toValue || applicationStatus === "approved") &&
      currentUser.userType !== "Admin"
    ) {
      setEditStatus(false);
      return true;
    }
    // Guard clauses for safety
    if (currentUser && currentUser.userType !== "Admin") {
      if (!formData9 || !Array.isArray(formData9)) return false;

      const field = formData9[index];
      if (!field) return false;

      const fieldData = field[fieldName];
      if (!fieldData) return false;

      // If in edit mode, enable all fields
      if (editStatus && (!toValue || applicationStatus === "approved")) {
        return false;
      }

      // Check if the radio button field has a value
      return fieldData.value === "yes" || fieldData.value === "no";
    }
  };

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm8");
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
        if (9 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 9;
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
          savedForms: 9,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
    }
  };
  const saveForm9 = async () => {
    const applicationData = {
      compensatedWork: localFormData,
    };
    await saveToFirebase(9, applicationData);
  };
  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};

      const requiredFields = ["currentlyWorking", "workingForAnotherEmployer"];

      requiredFields.forEach((key) => {
        if (
          !field[key] ||
          !field[key].value ||
          field[key].value.trim() === ""
        ) {
          fieldErrors[key] = "This field is required";
        }
      });

      return fieldErrors;
    });

    setErrors(newErrors);
    return newErrors.every(
      (fieldErrors) => Object.keys(fieldErrors).length === 0
    );
  };
  const updateDriverStatusToFilled = async (uid) => {
    try {
      const collectionName = "TruckDrivers";

      // Query to find the document with the specific UID
      const truckDriversQuery = query(
        collection(db, collectionName),
        where("uid", "==", uid)
      );

      const querySnapshot = await getDocs(truckDriversQuery);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const truckDriverDoc = querySnapshot.docs[0];

        // Update driverStatus to "Filled"
        await updateDoc(doc(db, collectionName, truckDriverDoc.id), {
          driverStatus: "filled",
        });
        const docRef = doc(db, "truck_driver_applications", uid);
        await updateDoc(docRef, {
          applicationStatus: "filled",
          applicationStatusDate: new Date().toISOString(),
        });
      } else {
        console.error("No matching driver found in the collection.");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(false);
    if (validateForm()) {
      setIsSaveClicked(true);
      await saveForm9(true);
      if (currentUser.userType !== "Admin") {
        updateDriverStatusToFilled(currentUser.uid);
      }
      setShowModal(true); // Show modal after successful submission
      // navigate("/TruckDriverLayout/ApplicationForm1");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    // Check if at least one field is filled
    if (currentUser.userType !== "Admin") {
      const isAnyFieldFilled = localFormData.some((field) =>
        Object.values(field).some((value) => value.value.trim() !== "")
      );

      if (!isAnyFieldFilled) {
        toast.error("At least one field must be filled before saving");
        return;
      }
    }

    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        compensatedWork: localFormData,
        submittedAt: new Date(),
      };
      let updateObject = {
        form9: applicationData,
      };
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        // Always update savedForms if current form number is higher
        if (9 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 9;
        }

        // Keep the existing completedForms value
        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }
        await updateDoc(docRef, updateObject);
        if (currentUser.userType !== "Admin") {
          updateDriverStatusToFilled(currentUser.uid);
        }
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 9, // Set initial savedForms to current form number
          completedForms: 9, // No forms completed yet, just saved
        });
        if (currentUser.userType !== "Admin") {
          updateDriverStatusToFilled(currentUser.uid);
        }
      }
      setIsSaveClicked(true);
      setEditStatus(false);
      toast.success("Form is successfully saved");
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };
  if (currentUser.userType === "Admin") {
    useEffect(() => {
      setClicked(false);
      if (clicked) {
        handleSave(uid, 9);
      }
    }, [clicked]);
  }
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? {
            ...field,
            [name.replace(`company-${index}-`, "")]: {
              ...field[name.replace(`company-${index}-`, "")],
              value: value,
              status: "pending",
            },
          }
        : field
    );

    setLocalFormData(updatedFields);

    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name.replace(`company-${index}-`, "")]:
              (name.includes("currentlyWorking") ||
                name.includes("workingForAnotherEmployer")) &&
              value.trim() === ""
                ? "This field is required"
                : "",
          }
        : error
    );

    setErrors(updatedErrors);

    // const allFieldsEmpty = updatedFields.every((field) =>
    //   Object.values(field).every((fieldValue) => fieldValue.value.trim() === "")
    // );
    // setIsSaveClicked(allFieldsEmpty);
  };
  const isDisabled =
    checkIfAllFieldsApproved() || applicationStatus === "approved";
  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-6 pr-4 ${
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
      <div className="flex flex-col w-full justify-end">
        <div className="flex flex-row items-start justify-start w-full ">
          <div className=" flex flex-col items-start justify-start w-full">
            <h1 className="w-full mb-4 text-xl font-bold text-black">
              Driver Certification for Other Compensated Work
            </h1>
          </div>
          {currentUser.userType !== "Admin" && (
            <FaBell className="p-2 text-white bg-black rounded-md shadow-lg cursor-pointer text-4xl" />
          )}
        </div>
      </div>
      <div className="flex flex-col w-full -mt-4 smd:-mt-0">
        <p className="text-black font-radios text-[16px] smd:text-lg">
          INSTRUCTIONS: When employed by a motor carrier, a driver must report
          to the carrier all on-duty time including time working for other
          employers. The definition of on-duty time found in Section 395.2
          paragraphs (8) and (9) of the Federal Motor Carrier Safely Regulations
          includes time performing any other work in the capacity of, or in the
          employ or service of, a common, contractor private motor carrier, also
          performing any compensated work for any non motor carrier entity.
        </p>
      </div>
      <div className=" flex flex-col w-full gap-y-8">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div
                className="flex flex-col smd:w-[95%] w-[90%] mb-6"
                key={index}
              >
                <div className="w-full mb-6">
                  <FormLabelWithStatus
                    htmlFor="currentlyWorking"
                    label="Are you currently working for another employer?"
                    status={field.currentlyWorking.status} // Adjust the status accordingly
                    note={field.currentlyWorking.note} // Adjust the note accordingly
                    fieldName="currentlyWorking"
                    uid={uid}
                    index={index}
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`company-${index}-currentlyWorking`}
                        value="yes"
                        checked={field.currentlyWorking.value === "yes"}
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={isDisabled}
                        className={`text-black form-radio ${
                          isDisabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name={`company-${index}-currentlyWorking`}
                        value="no"
                        checked={field.currentlyWorking.value === "no"}
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={isDisabled}
                        className={`text-black form-radio ${
                          isDisabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors[index]?.currentlyWorking && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].currentlyWorking}
                    </p>
                  )}
                </div>

                <div className="w-full mb-6">
                  <FormLabelWithStatus
                    htmlFor="workingForAnotherEmployer"
                    label="At this time do you intend to work for another employer
                    while still employed by this company?"
                    status={field.workingForAnotherEmployer.status} // Adjust the status accordingly
                    note={field.workingForAnotherEmployer.note} // Adjust the note accordingly
                    fieldName="workingForAnotherEmployer"
                    uid={uid}
                    index={index}
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`company-${index}-workingForAnotherEmployer`}
                        value="yes"
                        checked={
                          field.workingForAnotherEmployer.value === "yes"
                        }
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={isDisabled}
                        className={`text-black form-radio ${
                          isDisabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name={`company-${index}-workingForAnotherEmployer`}
                        value="no"
                        checked={field.workingForAnotherEmployer.value === "no"}
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={isDisabled}
                        className={`text-black form-radio ${
                          isDisabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors[index]?.workingForAnotherEmployer && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].workingForAnotherEmployer}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </form>
        {showModal && (
          <div
            id="successModal"
            className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="w-32 h-32 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-24 h-24 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold font-radios text-center mb-4">
                Form Submitted Successfully!
              </p>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/TruckDriverLayout/ApplicationForm1"); // Continue to next form
                }}
                className="py-2 px-3 text-white bg-black hover:bg-[#353535] rounded-lg w-full"
              >
                Continue
              </button>
            </div>
          </div>
        )}
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
                className="px-4 py-2 ml-4 font-semibold text-white bg-black rounded-md hover:bg-[#353535]"
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

export default ApplicationForm9;
