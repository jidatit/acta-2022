import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import FormLabelWithStatus from "../../../SharedComponents/components/Form3Label";
import { useAuthAdmin } from "../../../../AdminContext";
import { useEdit } from "../../../../../EditContext";

const ApplicationForm4 = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const [addressErrors, setAddressErrors] = useState([]);
  const [trafficErrors, setTrafficErrors] = useState([]);
  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const {
    isSaveClicked,
    setIsSaveClicked,
    addressField,
    trafficConvictionField,
    noAccidentsCheckeds,
    noTrafficConvictionsCheckeds,
  } = currentUser?.userType === "Admin" ? adminAuthData : authData;

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
    }
  }, [uid]);

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount

  const [addressFields, setAddressFields] = useState(
    addressField.length > 0
      ? addressField
      : [
          {
            date: { value: "", status: "pending", note: "" },
            accidentType: { value: "", status: "pending", note: "" },
            location: { value: "", status: "pending", note: "" },
            fatalities: { value: "", status: "pending", note: "" },
            penalties: { value: "", status: "pending", note: "" },
            comments: { value: "", status: "pending", note: "" },
          },
        ]
  );

  useEffect(() => {
    if (addressFields.length === 0) {
      setAddressFields([
        {
          date: { value: "", status: "pending", note: "" },
          accidentType: { value: "", status: "pending", note: "" },
          location: { value: "", status: "pending", note: "" },
          fatalities: { value: "", status: "pending", note: "" },
          penalties: { value: "", status: "pending", note: "" },
          comments: { value: "", status: "pending", note: "" },
        },
      ]);
    }
  }, [addressFields]);
  const [trafficConvictionFields, setTrafficConvictionFields] = useState(
    trafficConvictionField.length > 0
      ? trafficConvictionField
      : [
          {
            date: { value: "", status: "pending", note: "" },
            offenseType: { value: "", status: "pending", note: "" },
            location: { value: "", status: "pending", note: "" },
            penalties: { value: "", status: "pending", note: "" },
            comments: { value: "", status: "pending", note: "" },
          },
        ]
  );

  useEffect(() => {
    if (trafficConvictionFields.length === 0) {
      setTrafficConvictionFields([
        {
          date: { value: "", status: "pending", note: "" },
          offenseType: { value: "", status: "pending", note: "" },
          location: { value: "", status: "pending", note: "" },
          penalties: { value: "", status: "pending", note: "" },
          comments: { value: "", status: "pending", note: "" },
        },
      ]);
    }
  }, [trafficConvictionFields]);

  const [errors, setErrors] = useState([]);

  // State to track if the checkboxes are checked
  const [noAccidentsChecked, setNoAccidentsChecked] =
    useState(noAccidentsCheckeds);
  const [noTrafficConvictionsChecked, setNoTrafficConvictionsChecked] =
    useState(noTrafficConvictionsCheckeds);
  const { editStatus, setEditStatus } = useEdit();
  const hasValue = useCallback(
    (fieldType, fieldName, index) => {
      // If in edit mode, fields should remain enabled
      if (currentUser && currentUser.userType !== "Admin") {
        if (editStatus) {
          return false;
        }
        console.log("saving", isSaveClicked);
        // If form hasn't been saved yet, keep fields enabled for editing
        if (!isSaveClicked) {
          return false;
        }

        // Handle address fields
        if (fieldType === "address") {
          // If index is out of bounds, disable field
          if (index >= addressField.length) {
            return true;
          }

          const field = addressField[index]?.[fieldName];
          // Disable field only if it has a value after save has been clicked
          return field?.value ? true : false;
        }

        // Handle traffic conviction fields
        if (fieldType === "traffic") {
          // If index is out of bounds, disable field
          if (index >= trafficConvictionField.length) {
            return true;
          }

          const field = trafficConvictionField[index]?.[fieldName];
          // Disable field only if it has a value after save has been clicked
          return field?.value ? true : false;
        }

        return false;
      }
    },
    [isSaveClicked, editStatus, addressField, trafficConvictionField]
  );

  // Helper functions
  const hasAddressValue = useCallback(
    (fieldName, index) => hasValue("address", fieldName, index),
    [hasValue]
  );

  const hasTrafficValue = useCallback(
    (fieldName, index) => hasValue("traffic", fieldName, index),
    [hasValue]
  );

  // Simplified hasValue function using context

  // const hasValue = useCallback(
  //   (fieldName, index) => {
  //     // Check if FormData exists and has the index
  //     const fieldHasValue =
  //       FormData3?.[index]?.[fieldName]?.value &&
  //       FormData3[index][fieldName].value.trim() !== "";
  //     return fieldHasValue && !editStatus;
  //   },
  //   [FormData3, editStatus]
  // );
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    setNoAccidentsChecked(noAccidentsCheckeds);
    setNoTrafficConvictionsChecked(noTrafficConvictionsCheckeds);
    setAddressFields(addressField);
    setTrafficConvictionFields(trafficConvictionField);
  }, [
    addressField,
    trafficConvictionField,
    noAccidentsCheckeds,
    noTrafficConvictionsCheckeds,
  ]);
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm3");
  };
  const handleAddressChange = (e, index) => {
    if (noAccidentsChecked) return;

    const { name, value } = e.target;

    setAddressFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, [name]: { ...field[name], value } } : field
      )
    );

    setAddressErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (updatedErrors[index] && updatedErrors[index][name]) {
        const { [name]: removedError, ...remainingErrors } =
          updatedErrors[index];
        updatedErrors[index] = remainingErrors;
      }
      return updatedErrors;
    });
  };
  const handleTrafficChange = (e, index) => {
    if (noTrafficConvictionsChecked) return;

    const { name, value } = e.target;

    setTrafficConvictionFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, [name]: { ...field[name], value } } : field
      )
    );

    setTrafficErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (updatedErrors[index] && updatedErrors[index][name]) {
        const { [name]: removedError, ...remainingErrors } =
          updatedErrors[index];
        updatedErrors[index] = remainingErrors;
      }
      return updatedErrors;
    });
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Validates all address fields and returns true if all fields are valid.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  /******  c4834481-5e2a-49b7-85dd-3bb9945b9eaa  *******/
  const validateAddressFields = () => {
    const newErrors = addressFields.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setAddressErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const validateTrafficFields = () => {
    const newErrors = trafficConvictionFields.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setTrafficErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };
  const saveForm4 = async (isSubmit = false) => {
    const applicationData = {
      accidentRecords: noAccidentsChecked ? [] : addressFields,
      trafficConvictions: noTrafficConvictionsChecked
        ? []
        : trafficConvictionFields,
      noAccidents: noAccidentsChecked,
      noTrafficConvictions: noTrafficConvictionsChecked,
    };
    await saveToFirebase(4, applicationData, isSubmit);
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
        if (4 > currentSavedForms) {
          // 2 is the current form number
          updateObject.savedForms = 4;
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
          savedForms: 4,
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
    const isAddressValid = validateAddressFields();
    const isTrafficValid = validateTrafficFields();
    if (
      (noAccidentsChecked || isAddressValid) &&
      (noTrafficConvictionsChecked || isTrafficValid)
    ) {
      setIsSaveClicked(true);
      await saveForm4(true);
      navigate("/TruckDriverLayout/ApplicationForm5");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (uid) => {
    try {
      // Only check for filled fields if user is not admin
      if (currentUser.userType !== "Admin") {
        // Check if there is at least one field filled out
        const hasAddressData =
          !noAccidentsChecked &&
          addressFields.some((field) =>
            Object.values(field).some((val) => val.value.trim() !== "")
          );

        const hasTrafficData =
          !noTrafficConvictionsChecked &&
          trafficConvictionFields.some((field) =>
            Object.values(field).some((val) => val.value.trim() !== "")
          );

        // Validate fields for non-admin users
        if (
          !(
            noAccidentsChecked ||
            hasAddressData ||
            noTrafficConvictionsChecked ||
            hasTrafficData
          )
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
        accidentRecords: noAccidentsChecked ? [] : addressFields,
        trafficConvictions: noTrafficConvictionsChecked
          ? []
          : trafficConvictionFields,
        submittedAt: new Date(),
        noAccidents: noAccidentsChecked,
        noTrafficConvictions: noTrafficConvictionsChecked,
      };

      let updateObject = {
        form4: applicationData,
      };

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const currentSavedForms = existingData.savedForms || 0;

        if (4 > currentSavedForms) {
          updateObject.savedForms = 4;
        }

        if (existingData.completedForms) {
          updateObject.completedForms = existingData.completedForms;
        }
        await updateDoc(docRef, updateObject);
      } else {
        await setDoc(docRef, {
          ...updateObject,
          savedForms: 4,
          completedForms: 4,
        });
      }
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
        handleSave(uid, 4);
      }
    }, [clicked]);
  }
  const addAddressFields = () => {
    setAddressFields([
      ...addressFields,
      {
        date: { value: "", status: "pending", note: "" },
        accidentType: { value: "", status: "pending", note: "" },
        location: { value: "", status: "pending", note: "" },
        fatalities: { value: "", status: "pending", note: "" },
        penalties: { value: "", status: "pending", note: "" },
        comments: { value: "", status: "pending", note: "" },
      },
    ]);
  };

  const addTrafficFields = () => {
    setTrafficConvictionFields([
      ...trafficConvictionFields,
      {
        date: { value: "", status: "pending", note: "" },
        offenseType: { value: "", status: "pending", note: "" },
        location: { value: "", status: "pending", note: "" },
        penalties: { value: "", status: "pending", note: "" },
        comments: { value: "", status: "pending", note: "" },
      },
    ]);
  };
  const removeAddressField = (index) => {
    setAddressFields(addressFields.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const removeTrafficField = (index) => {
    setTrafficConvictionFields(
      trafficConvictionFields.filter((_, i) => i !== index)
    );
    setTrafficErrors(trafficErrors.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`flex flex-col items-start justify-start overflow-x-hidden w-full gap-y-6 pr-4 ${
        currentUser.userType === "Admin" ? "min-h-[85vh]" : "min-h-[94.9vh]"
      }`}
    >
      <div className="flex flex-row items-start gap-x-2 justify-start w-full">
        <div className="flex flex-col items-start justify-start w-full smd:ml-0">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driving background and Qualifications
          </h1>
        </div>
        {currentUser.userType !== "Admin" && (
          <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
        )}
      </div>

      {/* First Form */}
      <div className="flex flex-col gap-y-8 w-full">
        <form className="w-full bg-white shadow-md">
          <div className="flex flex-col gap-y-3.5">
            <p className="text-[17px] smd:text-lg text-black font-radios smd:mt-0 -mt-4">
              Provide accident record and forfeitures record for previous 3
              years
            </p>
            <div className="flex flex-row mb-6 gap-x-2">
              <input
                type="checkbox"
                checked={noAccidentsChecked}
                onChange={() => setNoAccidentsChecked(!noAccidentsChecked)}
                className="p-3"
              />
              <p className="text-[17px] smd:text-lg text-black ">
                No accidents in past 3 years
              </p>
            </div>
          </div>

          {noAccidentsChecked === false && (
            <>
              {addressFields.map((address, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
                >
                  <div>
                    <FormLabelWithStatus
                      label="Date"
                      id={`date`}
                      status={address.date.status}
                      note={address.date.note}
                      index={index}
                      fieldName="date"
                      uid={uid}
                    />
                    <input
                      type="date"
                      name="date"
                      id={`date-${index}`}
                      value={address.date.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("date", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.date
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("date", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] && addressErrors[index].date && (
                      <p className="mt-1 text-xs text-red-500">
                        {addressErrors[index].date}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Type of Accident"
                      id={`accidentType`}
                      status={address.accidentType.status}
                      note={address.accidentType.note}
                      index={index}
                      fieldName="accidentType"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="accidentType"
                      id={`accidentType-${index}`}
                      value={address.accidentType.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("accidentType", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.accidentType
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("accidentType", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] &&
                      addressErrors[index].accidentType && (
                        <p className="mt-1 text-xs text-red-500">
                          {addressErrors[index].accidentType}
                        </p>
                      )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Location"
                      id={`location`}
                      status={address.location.status}
                      note={address.location.note}
                      index={index}
                      fieldName="location"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={address.location.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("location", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.location
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("location", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] && addressErrors[index].location && (
                      <p className="mt-1 text-xs text-red-500">
                        {addressErrors[index].location}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Fatalities"
                      id={`fatalities`}
                      status={address.fatalities.status}
                      note={address.fatalities.note}
                      index={index}
                      fieldName="fatalities"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="fatalities"
                      id={`fatalities-${index}`}
                      value={address.fatalities.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("fatalities", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.fatalities
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("fatalities", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] &&
                      addressErrors[index].fatalities && (
                        <p className="mt-1 text-xs text-red-500">
                          {addressErrors[index].fatalities}
                        </p>
                      )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Penalties"
                      id={`penalties`}
                      status={address.penalties.status}
                      note={address.penalties.note}
                      index={index}
                      fieldName="penalties"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={address.penalties.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("penalties", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.penalties
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("penalties", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] && addressErrors[index].penalties && (
                      <p className="mt-1 text-xs text-red-500">
                        {addressErrors[index].penalties}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Comments"
                      id={`comments`}
                      status={address.comments.status}
                      note={address.comments.note}
                      index={index}
                      fieldName="comments"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={address.comments.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      disabled={hasAddressValue("comments", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        addressErrors[index]?.comments
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasAddressValue("comments", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {addressErrors[index] && addressErrors[index].comments && (
                      <p className="mt-1 text-xs text-red-500">
                        {addressErrors[index].comments}
                      </p>
                    )}
                  </div>
                  {currentUser.userType !== "Admin" ? (
                    <div className="flex items-center mt-4">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => removeAddressField(index)}
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
                    onClick={addAddressFields}
                    className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Add More
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </form>

        {/* Second Form */}
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          <p className="mb-4 text-[17px] smd:text-lg text-black font-radios">
            Provide traffic convictions and forfeitures record for previous 3
            years
          </p>
          <div className="flex flex-row mb-6 gap-x-2">
            <input
              type="checkbox"
              checked={noTrafficConvictionsChecked}
              onChange={() =>
                setNoTrafficConvictionsChecked(!noTrafficConvictionsChecked)
              }
              className="p-3"
            />
            <p className="text-[17px] smd:text-lg text-black ">
              No traffic convictions in past 3 years
            </p>
          </div>
          {!noTrafficConvictionsChecked && (
            <>
              {trafficConvictionFields.map((traffic, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
                >
                  <div>
                    <FormLabelWithStatus
                      label="Date"
                      id={`date`}
                      status={traffic.date.status}
                      note={traffic.date.note}
                      index={index}
                      fieldName="date"
                      uid={uid}
                    />
                    <input
                      type="date"
                      name="date"
                      id={`date-${index}`}
                      value={traffic.date.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      disabled={hasTrafficValue("date", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        trafficErrors[index]?.date
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasTrafficValue("date", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {trafficErrors[index] && trafficErrors[index].date && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].date}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Type of Offense"
                      id={`offenseType`}
                      status={traffic.offenseType.status}
                      note={traffic.offenseType.note}
                      index={index}
                      fieldName="offenseType"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="offenseType"
                      id={`offenseType-${index}`}
                      value={traffic.offenseType.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      disabled={hasTrafficValue("offenseType", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        trafficErrors[index]?.offenseType
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasTrafficValue("offenseType", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {trafficErrors[index] &&
                      trafficErrors[index].offenseType && (
                        <p className="mt-1 text-xs text-red-500">
                          {trafficErrors[index].offenseType}
                        </p>
                      )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Location"
                      id={`location`}
                      status={traffic.location.status}
                      note={traffic.location.note}
                      index={index}
                      fieldName="location"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={traffic.location.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      disabled={hasTrafficValue("location", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        trafficErrors[index]?.location
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasTrafficValue("location", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {trafficErrors[index] && trafficErrors[index].location && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].location}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Penalties"
                      id={`penalties`}
                      status={traffic.penalties.status}
                      note={traffic.penalties.note}
                      index={index}
                      fieldName="penalties"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={traffic.penalties.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      disabled={hasTrafficValue("penalties", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        trafficErrors[index]?.penalties
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasTrafficValue("penalties", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {trafficErrors[index] && trafficErrors[index].penalties && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].penalties}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithStatus
                      label="Comments"
                      id={`comments`}
                      status={traffic.comments.status}
                      note={traffic.comments.note}
                      index={index}
                      fieldName="comments"
                      uid={uid}
                    />
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={traffic.comments.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      disabled={hasTrafficValue("comments", index)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        trafficErrors[index]?.comments
                          ? "border-red-500 border-2"
                          : ""
                      } ${
                        hasTrafficValue("comments", index)
                          ? ""
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {trafficErrors[index] && trafficErrors[index].comments && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].comments}
                      </p>
                    )}
                  </div>
                  {currentUser.userType !== "Admin" ? (
                    <div className="flex items-center mt-4">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => removeTrafficField(index)}
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
                    onClick={addTrafficFields}
                    className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Add More
                  </button>
                </div>
              )}
            </>
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

export default ApplicationForm4;
