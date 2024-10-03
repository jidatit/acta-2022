import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";

const ApplicationForm9 = () => {
  const navigate = useNavigate();
  const { formData9, setIsSaveClicked, currentUser, isSaveClicked } = useAuth();
  const [localFormData, setLocalFormData] = useState(formData9);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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
    navigate("/TruckDriverLayout/ApplicationForm9");
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        compensatedWork: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form9: applicationData,
          completedForms: 9, // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form9: applicationData,
          completedForms: 9,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };
  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};

      // Only required fields should be validated

      const requiredFields = ["currentlyWorking", "workingForAnotherEmployer"];

      requiredFields.forEach((key) => {
        if (field[key].trim() === "") {
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
      await saveToFirebase();
      setShowModal(true); // Show modal after successful submission
      // navigate("/TruckDriverLayout/ApplicationForm1");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if at least one field is filled
    const isAnyFieldFilled = localFormData.some((field) =>
      Object.values(field).some((value) => value.trim() !== "")
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    toast.success("Form is successfully saved");

    setIsSaveClicked(true);

    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
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

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? { ...field, [name.replace(`company-${index}-`, "")]: value }
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

    const allFieldsEmpty = updatedFields.every((address) =>
      Object.values(address).every((fieldValue) => fieldValue.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };
  return (
    <div className="flex flex-col ml-5 smd:ml-0 items-start justify-start overflow-x-hidden h-full gap-y-12 w-[85%] md:w-[80%]">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className=" ml-1 smd:ml-0 flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driver Certification for Other Compensated Work
          </h1>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
      </div>
      <div className="flex flex-col gap-y-5 w-full md:w-[95%]">
        <p className="text-black font-radios text-lg">
          INSTRUCTIONS: When employed by a motor carrier, a driver must report
          to the carrier all on-duty time including time working for other
          employers. The definition of on-duty time found in Section 395.2
          paragraphs (8) and (9) of the Federal Motor Carrier Safely Regulations
          includes time performing any other work in the capacity of, or in the
          employ or service of, a common, contractor private motor carrier, also
          performing any compensated work for any non motor carrier entity.
        </p>
      </div>
      <div className=" flex flex-col w-[95%] smd:w-[85%] gap-y-8">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div
                className="flex flex-col smd:w-[95%] w-[90%] mb-6"
                key={index}
              >
                <div className="w-full mb-6">
                  <label
                    htmlFor={`company-${index}-currentlyWorking`}
                    className="block text-lg text-gray-900 font-radios"
                  >
                    Are you currently working for another employer?*
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`company-${index}-currentlyWorking`}
                        value="yes"
                        checked={field.currentlyWorking === "yes"}
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
                        checked={field.currentlyWorking === "no"}
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
                  <label
                    htmlFor={`company-${index}-workingForAnotherEmployer`}
                    className="block text-lg text-gray-900 font-radios"
                  >
                    At this time do you intend to work for another employer
                    while still employed by this company?*
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`company-${index}-workingForAnotherEmployer`}
                        value="yes"
                        checked={field.workingForAnotherEmployer === "yes"}
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
                        checked={field.workingForAnotherEmployer === "no"}
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
        <div className="flex items-center justify-between w-full gap-x-2">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg"
          >
            Back
          </button>
          <div className="flex justify-end w-full gap-x-2">
            <button
              type="submit"
              onClick={handleSave}
              className="px-6 py-2 font-semibold text-white bg-green-600 hover:bg-green-800 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm9;
