import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";
import { useAuthAdmin } from "../../../../AdminContext";
import { useEdit } from "../../../../../EditContext";

const ApplicationForm7 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();

  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const { isSaveClicked, setIsSaveClicked, alcoholDrugTesting } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);

  const [localFormData, setLocalFormData] = useState(alcoholDrugTesting);
  const [errors, setErrors] = useState([]);
  const { editStatus, setEditStatus } = useEdit();
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (alcoholDrugTesting) {
      setLocalFormData(alcoholDrugTesting);
    }
    //console.log(localFormData);
  }, [alcoholDrugTesting]);
  const hasValue = useCallback(
    (fieldName, index) => {
      // If in edit mode, enable all fields
      if (currentUser && currentUser.userType !== "Admin") {
        if (editStatus) {
          return false;
        }

        // If form hasn't been saved yet, return false to keep fields enabled
        if (!isSaveClicked) {
          return false;
        }

        // Check if the field exists and has a value
        const field = alcoholDrugTesting[index]?.[fieldName];
        return field?.value ? true : false;
      }
    },
    [editStatus, isSaveClicked, alcoholDrugTesting]
  );

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm6");
  };
  const saveToFirebase = async (formNumber, formData, isSubmit = false) => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

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
        if (7 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 7;
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
          savedForms: 7,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
    }
  };
  const saveForm7 = async (isSubmit = false) => {
    const applicationData = {
      AlcoholDrugTest: localFormData,
    };
    await saveToFirebase(7, applicationData, isSubmit);
  };
  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};

      // Validate 'testedPositiveEver'
      if (
        !field.testedPositiveEver.value ||
        (field.testedPositiveEver.value &&
          field.testedPositiveEver.value.trim() === "")
      ) {
        fieldErrors.testedPositiveEver = "This field is required";
      }

      if (
        field.testedPositiveEver.value === "yes" &&
        (!field.DOTCompletion.value ||
          (field.DOTCompletion.value &&
            field.DOTCompletion.value.trim() === ""))
      ) {
        fieldErrors.DOTCompletion = "This field is required";
      }
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

      await saveForm7(true);
      navigate("/TruckDriverLayout/ApplicationForm8");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    // Check if at least one field is filled
    if (currentUser.userType !== "Admin") {
      const isAnyFieldFilled = localFormData.some((field) =>
        Object.values(field).some(
          (input) => input.value && input.value.trim() !== ""
        )
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
        AlcoholDrugTest: localFormData,
        submittedAt: new Date(),
      };
      let updateObject = {
        form7: applicationData,
      };
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        // Always update savedForms if current form number is higher
        if (7 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 7;
        }

        // Keep the existing completedForms value
        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }
        await updateDoc(docRef, updateObject);
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 7, // Set initial savedForms to current form number
          completedForms: 7, // No forms completed yet, just saved
        });
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
        handleSave(uid, 7);
      }
    }, [clicked]);
  }
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) => {
      if (i === index) {
        const updatedField = {
          ...field,
          [name]: {
            ...field[name],
            value: value,
          },
        };
        // If 'testedPositiveEver' is "no", set 'DOTCompletion' to an empty string
        if (name === "testedPositiveEver" && value === "no") {
          updatedField.DOTCompletion = {
            value: "",
            status: "pending",
            note: "",
          };
        }
        return updatedField;
      }
      return field;
    });

    setLocalFormData(updatedFields);

    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name]: value.trim() === "" ? "This field is required" : "",
          }
        : error
    );

    setErrors(updatedErrors);
  };

  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-6 pr-4 ${
        currentUser.userType === "Admin" ? "min-h-[85vh]" : "min-h-[94.9vh]"
      }`}
    >
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="  flex flex-col items-start justify-start w-full">
          <h1 className="smd:w-full mb-4 w-[97%] text-[17px] smd:text-xl font-bold text-black">
            Previous Pre-Employment Employee Alcohol and Drug Testing Statement
          </h1>
        </div>
        {currentUser.userType !== "Admin" && (
          <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
        )}
      </div>
      <div className="flex flex-col gap-y-5 w-full -mt-4 smd:-mt-0">
        <p className="text-black font-radios w-full text-[16px] smd:text-lg">
          Sec. 40.25() As the employer, you must also ask the employee whether
          he or she has tested positive, or refused to test, on any pre-
          employment drug or alcohol test administered by an employer to which
          the employee applied for, but did not obtain, safety sensitive
          transportation work covered by DOT agency, drug and alcohol testing
          rules during the past two years.
        </p>
        <p className="text-black font-radios w-full text-[16px] smd:text-lg">
          If the employee admits that he or she had a positive test or refusal
          to test, you must not use the employee to perform safety-sensitive
          functions for you, until and unless the employee documents successful
          completion of the return-to-duty process, (see Sec. 40.25(b)(5) and
          (e))
        </p>
      </div>
      <div className=" flex flex-col w-full gap-y-8">
        <form
          className="w-full bg-white shadow-md border-b-1 border-b-gray-400"
          onSubmit={handleSubmit}
        >
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div className="flex flex-col w-full mb-6" key={index}>
                <div>
                  <SingleLabelLogic
                    htmlFor="testedPositiveEver"
                    labelName="Have you ever been tested positive or refused to be tested on any pre-employment drug test in which you were not hired during the past two years?"
                    status={field.testedPositiveEver.status}
                    note={field.testedPositiveEver.note}
                    fieldName="testedPositiveEver"
                    uid={uid}
                  />

                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`testedPositiveEver`}
                        value="yes"
                        checked={field.testedPositiveEver.value === "yes"}
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={hasValue("testedPositiveEver", index)}
                        className={`text-blue-500 form-radio ${
                          hasValue("testedPositiveEver", index)
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name={`testedPositiveEver`}
                        value="no"
                        checked={field.testedPositiveEver.value === "no"}
                        onChange={(e) => handleInputChange(index, e)}
                        disabled={hasValue("testedPositiveEver", index)}
                        className={`text-blue-500 form-radio ${
                          hasValue("testedPositiveEver", index)
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors[index]?.testedPositiveEver && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].testedPositiveEver}
                    </p>
                  )}
                </div>

                {field.testedPositiveEver.value === "yes" && (
                  <div className="w-full mb-6 mt-4">
                    <SingleLabelLogic
                      htmlFor="DOTCompletion"
                      labelName="If yes, have you successfully completed the DOT return to duty process?"
                      status={field.DOTCompletion.status}
                      note={field.DOTCompletion.note}
                      fieldName="DOTCompletion"
                      uid={uid}
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`DOTCompletion`}
                          value="yes"
                          checked={field.DOTCompletion.value === "yes"}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={hasValue("DOTCompletion", index)}
                          className={`text-blue-500 form-radio ${
                            hasValue("DOTCompletion", index)
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-white cursor-pointer"
                          }`}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <input
                          type="radio"
                          name={`DOTCompletion`}
                          value="no"
                          checked={field.DOTCompletion.value === "no"}
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={hasValue("DOTCompletion", index)}
                          className={`text-blue-500 form-radio ${
                            hasValue("DOTCompletion", index)
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-white cursor-pointer"
                          }`}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {errors[index]?.DOTCompletion && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].DOTCompletion}
                      </p>
                    )}
                  </div>
                )}
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

export default ApplicationForm7;
