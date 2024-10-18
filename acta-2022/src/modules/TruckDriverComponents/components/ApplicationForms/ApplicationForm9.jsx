import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";
import { useAuthAdmin } from "../../../../AdminContext";

const ApplicationForm9 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const { fetchUserData, currentUser } = adminAuthData;
  const { isSaveClicked, setIsSaveClicked, formData9 } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;
  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);
  const [localFormData, setLocalFormData] = useState(formData9);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm8");
  };
  const saveToFirebase = async (formNumber, formData) => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      // Create the update object with the form data
      const updateObject = {
        [`form${formNumber}`]: {
          ...formData,
          submittedAt: new Date(),
        },
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentCompletedForms = existingData.completedForms || 0;

        // Only update completedForms if the new form number is higher
        if (formNumber > currentCompletedForms) {
          updateObject.completedForms = formNumber;
        }

        await updateDoc(docRef, updateObject);
      } else {
        // For new documents, set the completedForms to the current form number
        await setDoc(docRef, {
          ...updateObject,
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
    if (validateForm()) {
      setIsSaveClicked(true);
      await saveForm9();
      setShowModal(true); // Show modal after successful submission
      // navigate("/TruckDriverLayout/ApplicationForm1");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    // Check if at least one field is filled
    const isAnyFieldFilled = localFormData.some((field) =>
      Object.values(field).some((value) => value.value.trim() !== "")
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    toast.success("Form is successfully saved");

    setIsSaveClicked(true);

    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        compensatedWork: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form9: applicationData,
          // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form9: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };
  if (currentUser.userType === "Admin") {
    useEffect(() => {
      console.log("child clicked", clicked);
      setClicked(false);
      if (clicked) {
        handleSave(uid);
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

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((fieldValue) => fieldValue.value.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };
  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-6">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className=" flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driver Certification for Other Compensated Work
          </h1>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>
      <div className="flex flex-col w-full">
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
                  <SingleLabelLogic
                    htmlFor="currentlyWorking"
                    labelName="Are you currently working for another employer?"
                    status={field.currentlyWorking.status} // Adjust the status accordingly
                    note={field.currentlyWorking.note} // Adjust the note accordingly
                    fieldName="currentlyWorking"
                    uid={uid}
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`company-${index}-currentlyWorking`}
                        value="yes"
                        checked={field.currentlyWorking.value === "yes"}
                        onChange={(e) => handleInputChange(index, e)}
                        className="text-blue-500 form-radio"
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
                        className="text-blue-500 form-radio"
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
                  <SingleLabelLogic
                    htmlFor="workingForAnotherEmployer"
                    labelName="At this time do you intend to work for another employer
                    while still employed by this company?"
                    status={field.workingForAnotherEmployer.status} // Adjust the status accordingly
                    note={field.workingForAnotherEmployer.note} // Adjust the note accordingly
                    fieldName="workingForAnotherEmployer"
                    uid={uid}
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
                        className="text-blue-500 form-radio"
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
                        className="text-blue-500 form-radio"
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
                className="py-2 px-3 text-white bg-blue-500 hover:bg-blue-700 rounded-lg w-full"
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

export default ApplicationForm9;
