import { useCallback, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
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
const ApplicationForm3 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();

  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const { isSaveClicked, setIsSaveClicked, FormData3, applicationStatus } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;

  const [localFormData, setLocalFormData] = useState(FormData3 || [{}]);

  const { editStatus, setEditStatus } = useEdit();
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);

  const checkIfAllFieldsApproved = useCallback(() => {
    return localFormData.every((form) =>
      Object.values(form).every((field) => field.status === "approved")
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
  }, [editStatus, localFormData, checkIfAllFieldsApproved]);

  const handleCloseModal = () => {
    setIsApprovedModalOpen(false);
  };
  // Simplified hasValue function using context

  const hasValue = useCallback(
    (fieldName, index) => {
      let toValue = checkIfAllFieldsApproved();
      if (
        (toValue || applicationStatus === "approved") &&
        currentUser.userType !== "Admin"
      ) {
        setEditStatus(false);
        return true;
      }
      if (currentUser && currentUser.userType !== "Admin") {
        const fieldHasValue = FormData3?.[index]?.[fieldName]?.value;
        return fieldHasValue && !editStatus;
      }
    },
    [FormData3, editStatus]
  );
  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
      setLocalFormData([{}]); // Reset form data when changing UID
    }
  }, [uid]);

  useEffect(() => {
    if (FormData3 !== null) {
      setLocalFormData(FormData3);
    } else {
      setLocalFormData([{}]);
    }
  }, [FormData3]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setIsSaveClicked(true);
  }, []);

  const handleBack = () => {
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    navigate("/TruckDriverLayout/ApplicationForm2");
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
        if (3 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 3;
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
          savedForms: 3,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
      throw error; // Re-throw to handle in calling function
    }
  };
  const saveForm3 = async (isSubmit = false) => {
    const applicationData = {
      EmploymentHistory: localFormData,
    };
    await saveToFirebase(3, applicationData, isSubmit);
  };

  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};
      const requiredFields = [
        "companyName31",
        "city31",
        "zipCode31",
        "contactPerson",
        "phone31",
        "from31",
        "to31",
        "position",
        "leavingReason",
        "subjectToFMCSRs",
        "jobDesignatedAsSafetySensitive",
      ];

      requiredFields.forEach((key) => {
        if (field[key].value.trim() === "") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(false);

    try {
      if (validateForm()) {
        setIsSaveClicked(true);
        await saveForm3(true); // Pass true to indicate this is a submit action
        navigate("/TruckDriverLayout/ApplicationForm4");
      } else {
        toast.error("Please complete all required fields to continue.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting the form, please try again.");
    }
  };

  const handleSave = async (uid) => {
    console.log("editStatus", editStatus);
    try {
      if (currentUser.userType !== "Admin") {
        // Improved validation logic to check all fields
        const checkFieldValue = (field) => {
          // Handle null or undefined
          if (field === null || field === undefined) return false;

          // Handle nested objects with value property (like form controls)
          if (typeof field === "object") {
            // Check if it's an array
            if (Array.isArray(field)) {
              return field.some((item) => {
                if (typeof item === "object") {
                  // Check each field in the array item
                  return Object.values(item).some((subField) =>
                    typeof subField === "object" && subField.value
                      ? subField.value.toString().trim().length > 0
                      : subField?.toString().trim().length > 0
                  );
                }
                return item?.toString().trim().length > 0;
              });
            }

            // Handle regular objects
            if (field.hasOwnProperty("value")) {
              return field.value?.toString().trim().length > 0;
            }

            // Check nested object values
            return Object.values(field).some((val) => checkFieldValue(val));
          }

          // Handle primitive values
          return field.toString().trim().length > 0;
        };

        const isAnyFieldFilled = Object.entries(localFormData).some(
          ([key, value]) => {
            const fieldHasValue = checkFieldValue(value);
            console.log(`Checking field ${key}:`, {
              value,
              hasValue: fieldHasValue,
            });
            return fieldHasValue;
          }
        );

        console.log("Form validation result:", { isAnyFieldFilled });

        if (!isAnyFieldFilled) {
          toast.error("Please fill at least one field before saving");
          return;
        }
      }

      let docRef = "";
      if (uid) {
        docRef = doc(db, "truck_driver_applications", uid);
      } else {
        docRef = doc(db, "truck_driver_applications", currentUser.uid);
      }
      const docSnap = await getDoc(docRef);
      const applicationData = {
        EmploymentHistory: localFormData,
        submittedAt: new Date(),
      };

      let updateObject = {
        form3: applicationData,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        if (3 > currentSavedForms) {
          updateObject.savedForms = 3;
        }

        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }

        await updateDoc(docRef, updateObject);
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 3,
          completedForms: 3,
        });
      }

      setIsSaveClicked(true);
      setEditStatus(false);
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the form. Please try again.");
    }
  };

  if (currentUser.userType === "Admin") {
    useEffect(() => {
      setClicked(false);
      if (clicked) {
        handleSave(uid);
      }
    }, [clicked]);
  }
  const handleAddCompany = () => {
    setLocalFormData([
      ...localFormData,
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
    setErrors([...errors, {}]); // Add an empty error object for the new company
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? {
            ...field,
            [name.replace(`company-${index}-`, "")]: {
              ...field[name.replace(`company-${index}-`, "")],
              value,
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
              (name.includes("subjectToFMCSRs") ||
                name.includes("jobDesignatedAsSafetySensitive")) &&
              value.trim() === ""
                ? "This field is required"
                : "",
          }
        : error
    );

    setErrors(updatedErrors);

    const allFieldsEmpty = updatedFields.every((address) =>
      Object.values(address).every(
        (fieldValue) => fieldValue.value.trim() === ""
      )
    );
    setIsSaveClicked(allFieldsEmpty);
  };

  const removeCompany = (index) => {
    setLocalFormData(localFormData.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };
  const isDisabled =
    checkIfAllFieldsApproved() || applicationStatus === "approved";
  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4 ${
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
      <div className=" flex flex-col items-start justify-start w-full ">
        <div className="flex flex-col w-full justify-end">
          <div className="flex flex-row items-start justify-between w-full">
            <h1 className="w-full mb-4 text-xl font-bold text-black">
              Employment History*
            </h1>
            {currentUser.userType !== "Admin" && (
              <FaBell className="p-2 text-white bg-black rounded-md shadow-lg cursor-pointer text-4xl" />
            )}
          </div>
        </div>
        <p className="mt-3 text-[16px] md:text-lg px-1 smd:p-0 text-justify text-black font-radios">
          *The Federal Motor Carrier Safety Regulations (49 CFR 391.21) require
          that all applicants wishing to drive a commercial vehicle list all
          employment for the last three (3) years. In addition, if you have
          driven a commercial vehicle previously, you must provide employment
          history for an additional seven (7) years (for a total of ten (10)
          years). Any gaps in employment in excess of one (1) month must be
          explained. Start with the last or current position, including any
          military experience, and work backwards(attach separate sheets if
          necessary). You are required to list the complete mailing address,
          including street number, city, state, zip; and complete all other
          information.
        </p>
      </div>

      <div className=" flex flex-col gap-y-4 flex-wrap ">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6">
                <div className="grid w-full grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                  <div>
                    <FormLabelWithStatus
                      label="Company Name"
                      id={`companyName31-${index}`}
                      status={field.companyName31.status}
                      note={field.companyName31.note}
                      index={index}
                      fieldName="companyName31"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="companyName31"
                      id={`companyName31-${index}`}
                      value={field.companyName31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.companyName31
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.companyName31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].companyName31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Street"
                      id="street31"
                      status={field.street31.status}
                      note={field.street31.note}
                      index={index}
                      fieldName="street31"
                      uid={uid}
                      important={true}
                    />
                    <input
                      type="text"
                      name="street31"
                      id={`street31-${index}`}
                      value={field.street31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.street31 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.street31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].street31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="City,State"
                      id="city31"
                      status={field.city31.status}
                      note={field.city31.note}
                      index={index}
                      fieldName="city31"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="city31"
                      id={`city31-${index}`}
                      value={field.city31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.city31 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.city31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].city31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Zip Code"
                      id="zipCode31"
                      status={field.zipCode31.status}
                      note={field.zipCode31.note}
                      index={index}
                      fieldName="zipCode31"
                      uid={uid}
                    />
                    <input
                      type="number"
                      name="zipCode31"
                      id={`zipCode31-${index}`}
                      value={field.zipCode31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.zipCode31
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.zipCode31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].zipCode31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Contact Person"
                      id="contactPerson"
                      status={field.contactPerson.status}
                      note={field.contactPerson.note}
                      index={index}
                      fieldName="contactPerson"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="contactPerson"
                      id={`contactPerson-${index}`}
                      value={field.contactPerson.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.contactPerson
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.contactPerson && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Phone #"
                      id="phone31"
                      status={field.phone31.status}
                      note={field.phone31.note}
                      index={index}
                      fieldName="phone31"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="phone31"
                      id={`phone31-${index}`}
                      value={field.phone31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.phone31 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.phone31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].phone31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Fax #"
                      id="fax1"
                      status={field.fax1.status}
                      note={field.fax1.note}
                      index={index}
                      fieldName="fax1"
                      uid={uid}
                      important={true}
                    />
                    <input
                      type="text"
                      name="fax1"
                      id={`fax1-${index}`}
                      value={field.fax1.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.fax1 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.fax1 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].fax1}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="From"
                      id="from31"
                      status={field.from31.status}
                      note={field.from31.note}
                      index={index}
                      fieldName="from31"
                      uid={uid}
                    />
                    <input
                      type="date"
                      name="from31"
                      id={`from31-${index}`}
                      value={field.from31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.from31 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.from31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].from31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="To"
                      id="to31"
                      status={field.to31.status}
                      note={field.to31.note}
                      index={index}
                      fieldName="to31"
                      uid={uid}
                    />
                    <input
                      type="date"
                      name="to31"
                      id={`to31-${index}`}
                      value={field.to31.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.to31 ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.to31 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].to31}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Position"
                      id="position"
                      status={field.position.status}
                      note={field.position.note}
                      index={index}
                      fieldName="position"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="position"
                      id={`position-${index}`}
                      value={field.position.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.position ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.position && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].position}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Salary"
                      id="salary"
                      status={field.salary.status}
                      note={field.salary.note}
                      index={index}
                      fieldName="salary"
                      uid={uid}
                      important={true}
                    />
                    <input
                      type="text"
                      name="salary"
                      id={`salary-${index}`}
                      value={field.salary.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.salary ? "border-red-500 border-2" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.salary && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].salary}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabelWithStatus
                      label="Reason For Leaving"
                      id="leavingReason"
                      status={field.leavingReason.status}
                      note={field.leavingReason.note}
                      index={index}
                      fieldName="leavingReason"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="leavingReason"
                      id={`leavingReason-${index}`}
                      value={field.leavingReason.value}
                      onChange={(e) => handleInputChange(index, e)}
                      disabled={isDisabled}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.leavingReason ? "border-red-500" : ""
                      } ${
                        isDisabled
                          ? "text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors[index]?.leavingReason && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].leavingReason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col smd:w-screen w-[90%] mb-6">
                    <div className="w-full mb-6">
                      <FormLabelWithStatus
                        htmlFor="subjectToFMCSRs"
                        label="Were you subject to the FMCSRs* while employed?"
                        status={field?.subjectToFMCSRs?.status}
                        note={field?.subjectToFMCSRs?.note}
                        fieldName="subjectToFMCSRs"
                        index={index}
                        uid={uid}
                      />
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`company-${index}-subjectToFMCSRs`}
                            value="yes"
                            checked={field.subjectToFMCSRs.value === "yes"}
                            onChange={(e) => handleInputChange(index, e)}
                            disabled={isDisabled}
                            className="text-black form-radio"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            name={`company-${index}-subjectToFMCSRs`}
                            value="no"
                            checked={field.subjectToFMCSRs.value === "no"}
                            onChange={(e) => handleInputChange(index, e)}
                            disabled={isDisabled}
                            className="text-black form-radio"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {errors[index]?.subjectToFMCSRs && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].subjectToFMCSRs}
                        </p>
                      )}
                    </div>

                    <div
                      className={` ${
                        currentUser.userType === "Admin"
                          ? "w-auto smd:w-[80%] lg:w-[80%]"
                          : "xxl:w-full lg:w-[65%] xl:w-[75%] smd:w-[60%]"
                      } mb-6`}
                    >
                      <FormLabelWithStatus
                        htmlFor="jobDesignatedAsSafetySensitive"
                        label="Was your job designated as a safety-sensitive function in any DOT-regulated mode subject to the drug and alcohol testing requirements."
                        status={field?.jobDesignatedAsSafetySensitive?.status}
                        note={field?.jobDesignatedAsSafetySensitive?.note}
                        fieldName="jobDesignatedAsSafetySensitive"
                        index={index}
                        uid={uid}
                      />
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`company-${index}-jobDesignatedAsSafetySensitive`}
                            value="yes"
                            checked={
                              field.jobDesignatedAsSafetySensitive.value ===
                              "yes"
                            }
                            onChange={(e) => handleInputChange(index, e)}
                            disabled={isDisabled}
                            className="text-black form-radio"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            name={`company-${index}-jobDesignatedAsSafetySensitive`}
                            value="no"
                            checked={
                              field.jobDesignatedAsSafetySensitive.value ===
                              "no"
                            }
                            onChange={(e) => handleInputChange(index, e)}
                            disabled={isDisabled}
                            className="text-black form-radio"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {errors[index]?.jobDesignatedAsSafetySensitive && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].jobDesignatedAsSafetySensitive}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      {index !== 0 && ( // Only show remove button for dynamically added fields
                        <button
                          type="button"
                          onClick={() => removeCompany(index)}
                          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {currentUser.userType !== "Admin" && (
            <div className="flex items-end justify-end w-full">
              <button
                type="button"
                onClick={handleAddCompany}
                className="px-6 py-2 font-semibold text-white bg-black rounded-md hover:bg-[#353535]"
              >
                Add More
              </button>
            </div>
          )}
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

export default ApplicationForm3;
