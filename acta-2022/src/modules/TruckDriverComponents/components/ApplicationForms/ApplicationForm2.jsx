import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { useAuthAdmin } from "../../../../AdminContext";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
import { useEdit } from "../../../../../EditContext";
const ApplicationForm2 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const initialFields = [
    {
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
    },
  ];
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();

  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const { setIsSaveClicked, FormData } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;

  const [localFormData, setLocalFormData] = useState(FormData || [{}]);
  const { editStatus, setEditStatus } = useEdit();
  const [savedFields, setSavedFields] = useState([]);
  // Simplified hasValue function using context

  const hasValue = useCallback(
    (fieldName, index) => {
      // Check if FormData exists and has the index

      if (currentUser && currentUser.userType !== "Admin") {
        const fieldHasValue = FormData?.[index]?.[fieldName]?.value;
        return fieldHasValue && !editStatus;
      }
    },
    [FormData, editStatus]
  );

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
      setLocalFormData([{}]); // Reset form data when changing UID
    }
  }, [uid]);

  useEffect(() => {
    if (FormData !== null) {
      setLocalFormData(FormData);
    } else {
      setLocalFormData([{}]);
    }
  }, [FormData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update localFormData whenever FormData changes

  useEffect(() => {
    setIsSaveClicked(true);
  }, [setIsSaveClicked]);
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // Update only the field that changed
    setLocalFormData((prevFormData) =>
      prevFormData.map((field, i) =>
        i === index
          ? { ...field, [name]: { ...field[name], value: value } }
          : field
      )
    );

    // Delay setting isSaveClicked to ensure it's only reset when necessary
    setIsSaveClicked(false);
  };

  const handleBack = () => {
    navigate("/TruckDriverLayout/ApplicationForm1");
  };
  const saveForm2 = async (isSubmit = false) => {
    const applicationData = {
      previousAddresses: localFormData,
    };
    await saveToFirebase(2, applicationData, isSubmit);
  };
  const saveToFirebase = async (formNumber, formData, isSubmit = false) => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      // Create the form data update object
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
        if (2 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 2;
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
          savedForms: 2,
          completedForms: formNumber,
        });
      }

      toast.success(`Form saved successfully`);
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error("Error saving the application, please try again.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(true);

    try {
      await saveForm2(true); // Pass true to indicate this is a submit action
      navigate("/TruckDriverLayout/ApplicationForm3");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting the form, please try again.");
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        previousAddresses: localFormData,
        submittedAt: new Date(),
      };

      let updateObject = {
        form2: applicationData,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        // Always update savedForms if current form number is higher
        if (2 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 2;
        }

        // Keep the existing completedForms value
        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }

        await updateDoc(docRef, updateObject);
      } else {
        // For new documents
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 2, // Set initial savedForms to current form number
          completedForms: 2, // No forms completed yet, just saved
        });
      }
      setIsSaveClicked(true);
      setEditStatus(false);
      toast.success("Form is successfully saved");
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again.");
    }
  };
  const getFormProgress = async (uid) => {
    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          savedForms: data.savedForms || 0,
          completedForms: data.completedForms || 0,
        };
      }
      return { savedForms: 0, completedForms: 0 };
    } catch (error) {
      console.error("Error getting form progress:", error);
      return { savedForms: 0, completedForms: 0 };
    }
  };
  if (currentUser.userType === "Admin") {
    useEffect(() => {
      console.log("child clicked", clicked);
      setClicked(false);
      if (clicked) {
        handleSave(uid, 2);
      }
    }, [clicked]);
  }
  const addAddressFields = () => {
    setLocalFormData([
      ...localFormData,
      {
        street1: { value: "", status: "pending", note: "" },
        street2: { value: "", status: "pending", note: "" },
        city: { value: "", status: "pending", note: "" },
        state: { value: "", status: "pending", note: "" },
        zipCode: { value: "", status: "pending", note: "" },
      },
    ]);
  };

  const removeAddressField = (index) => {
    const updatedFormData = localFormData.filter((_, i) => i !== index);
    setLocalFormData(updatedFormData);
  };

  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-12  ${
        currentUser.userType === "Admin" ? "max-h-[85vh] " : "min-h-[94.9vh]"
      }`}
    >
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Previous Addresses
          </h1>
          <p className="text-lg text-black font-radios">
            List all addresses in previous three years
          </p>
        </div>
        {currentUser.userType !== "Admin" && (
          <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
        )}
      </div>

      <div className="flex flex-col w-full gap-y-8 h-full">
        <form className="w-full p-6 bg-white shadow-md h-[50vh] border-b-1 border-b-gray-400">
          {Array.isArray(localFormData) &&
            localFormData.map((address, index) => (
              <divs
                key={index}
                className="grid grid-cols-1 w-full smd:-mt-0 -mt-11 smd:-ml-0 -ml-4  gap-4 mb-6 ssm:grid-cols-2 md:grid-cols-3"
              >
                <div>
                  <FormLabelWithStatus
                    label="Street 1"
                    id={`street1`}
                    status={address?.street1?.status}
                    note={address?.street1?.note}
                    index={index}
                    fieldName="street1"
                    uid={uid}
                  />
                  <input
                    type="text"
                    name="street1"
                    id={`street1-${index}`}
                    value={address?.street1?.value}
                    onChange={(e) => handleChange(e, index)}
                    disabled={hasValue("street1", index)}
                    className={`w-full p-2 mt-1 border rounded-md  ${
                      hasValue("street1", index)
                        ? ""
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <FormLabelWithStatus
                    label="Street 2"
                    id={`street2`}
                    status={address?.street2?.status}
                    note={address?.street2?.note}
                    index={index}
                    fieldName="street2"
                    uid={uid}
                  />
                  <input
                    type="text"
                    name="street2"
                    id={`street2-${index}`}
                    value={address?.street2?.value}
                    onChange={(e) => handleChange(e, index)}
                    disabled={hasValue("street2", index)}
                    className={`w-full p-2 mt-1 border rounded-md  ${
                      hasValue("street2", index)
                        ? ""
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <FormLabelWithStatus
                    label="City"
                    id={`city`}
                    status={address?.city?.status}
                    note={address?.city?.note}
                    index={index}
                    fieldName="city"
                    uid={uid}
                  />
                  <input
                    type="text"
                    name="city"
                    id={`city-${index}`}
                    value={address?.city?.value}
                    onChange={(e) => handleChange(e, index)}
                    disabled={hasValue("city", index)}
                    className={`w-full p-2 mt-1 border rounded-md  ${
                      hasValue("city", index) ? "" : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <FormLabelWithStatus
                    label="State"
                    id={`state`}
                    status={address?.state?.status}
                    note={address?.state?.note}
                    index={index}
                    fieldName="state"
                    uid={uid}
                  />
                  <input
                    type="text"
                    name="state"
                    id={`state-${index}`}
                    value={address?.state?.value}
                    onChange={(e) => handleChange(e, index)}
                    disabled={hasValue("state", index)}
                    className={`w-full p-2 mt-1 border rounded-md  ${
                      hasValue("state", index) ? "" : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <FormLabelWithStatus
                    label="Zip Code"
                    id={`zipCode`}
                    status={address?.zipCode?.status}
                    note={address?.zipCode?.note}
                    index={index}
                    fieldName="zipCode"
                    uid={uid}
                  />
                  <input
                    type="text"
                    name="zipCode"
                    id={`zipCode-${index}`}
                    value={address?.zipCode?.value}
                    onChange={(e) => handleChange(e, index)}
                    disabled={hasValue("zipCode", index)}
                    className={`w-full p-2 mt-1 border rounded-md  ${
                      hasValue("zipCode", index)
                        ? ""
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div className="flex items-center mt-4">
                  {index >= initialFields.length && ( // Only show remove button for dynamically added fields
                    <button
                      type="button"
                      onClick={() => removeAddressField(index)}
                      className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </divs>
            ))}
          {currentUser.userType !== "Admin" && (
            <div className="flex items-end justify-end w-full">
              <button
                type="button"
                onClick={addAddressFields}
                className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
                onClick={() => handleSave(currentUser.uid, 2)}
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

export default ApplicationForm2;
