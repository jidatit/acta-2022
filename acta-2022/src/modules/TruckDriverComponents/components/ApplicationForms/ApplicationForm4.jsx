import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";

const ApplicationForm4 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  const {
    addressField,
    trafficConvictionField,

    setIsSaveClicked,
    isSaveClicked,
    currentUser,
    noAccidentsCheckeds,
    noTrafficConvictionsCheckeds,
  } = useAuth();
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
  const [trafficErrors, setTrafficErrors] = useState([]);

  // State to track if the checkboxes are checked
  const [noAccidentsChecked, setNoAccidentsChecked] =
    useState(noAccidentsCheckeds);
  const [noTrafficConvictionsChecked, setNoTrafficConvictionsChecked] =
    useState(noTrafficConvictionsCheckeds);

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
    const updatedFields = [...addressFields];
    updatedFields[index][name].value = value;
    setAddressFields(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.value.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };

  const handleTrafficChange = (e, index) => {
    if (noTrafficConvictionsChecked) return;

    const { name, value } = e.target;
    const updatedFields = [...trafficConvictionFields];
    updatedFields[index][name].value = value;
    setTrafficConvictionFields(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.value.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };

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
    setErrors(newErrors);
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

  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
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

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form4: applicationData,
          completedForms: 4,
        });
      } else {
        await setDoc(docRef, {
          form4: applicationData,
          completedForms: 4,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
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
      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm5");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

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

    if (
      noAccidentsChecked ||
      hasAddressData ||
      noTrafficConvictionsChecked ||
      hasTrafficData
    ) {
      // Perform save
      toast.success("Form is successfully saved");
      setIsSaveClicked(true);

      try {
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);
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

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            form4: applicationData,
          });
        } else {
          await setDoc(docRef, {
            form4: applicationData,
          });
        }
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Please complete at least one field before saving.");
    }
  };

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
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-6 pr-4">
      <div className="flex flex-row items-start gap-x-2 justify-start w-full">
        <div className="flex flex-col items-start justify-start w-full smd:ml-0">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driving background and Qualifications
          </h1>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>

      {/* First Form */}
      <div className="flex flex-col gap-y-8 w-full">
        <form className="w-full bg-white shadow-md">
          <div className="flex flex-col gap-y-3.5">
            <p className="text-[17px] smd:text-lg text-black font-radios">
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
                    <label
                      htmlFor={`date-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Date*
                    </label>
                    <input
                      type="date"
                      name="date"
                      id={`date-${index}`}
                      value={address.date.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].date && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`accidentType-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Type of Accident*
                    </label>
                    <input
                      type="text"
                      name="accidentType"
                      id={`accidentType-${index}`}
                      value={address.accidentType.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].accidentType
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].accidentType && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].accidentType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`location-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={address.location.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].location
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].location && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].location}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`fatalities-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Fatalities*
                    </label>
                    <input
                      type="text"
                      name="fatalities"
                      id={`fatalities-${index}`}
                      value={address.fatalities.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].fatalities
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].fatalities && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].fatalities}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`penalties-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Penalties*
                    </label>
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={address.penalties.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].penalties
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].penalties && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].penalties}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`comments-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Comments*
                    </label>
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={address.comments.value}
                      onChange={(e) => handleAddressChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        errors[index] && errors[index].comments
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors[index] && errors[index].comments && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[index].comments}
                      </p>
                    )}
                  </div>
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
                </div>
              ))}
              <div className="flex items-end justify-end w-full">
                <button
                  type="button"
                  onClick={addAddressFields}
                  className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add More
                </button>
              </div>
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
                    <label
                      htmlFor={`date-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Date*
                    </label>
                    <input
                      type="date"
                      name="date"
                      id={`date-${index}`}
                      value={traffic.date.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        trafficErrors[index] && trafficErrors[index].date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {trafficErrors[index] && trafficErrors[index].date && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`offenseType-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Type of Offense*
                    </label>
                    <input
                      type="text"
                      name="offenseType"
                      id={`offenseType-${index}`}
                      value={traffic.offenseType.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        trafficErrors[index] && trafficErrors[index].offenseType
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {trafficErrors[index] &&
                      trafficErrors[index].offenseType && (
                        <p className="mt-1 text-xs text-red-500">
                          {trafficErrors[index].offenseType}
                        </p>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor={`location-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={traffic.location.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        trafficErrors[index] && trafficErrors[index].location
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {trafficErrors[index] && trafficErrors[index].location && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].location}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`penalties-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Penalties*
                    </label>
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={traffic.penalties.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        trafficErrors[index] && trafficErrors[index].penalties
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {trafficErrors[index] && trafficErrors[index].penalties && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].penalties}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`comments-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Comments*
                    </label>
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={traffic.comments.value}
                      onChange={(e) => handleTrafficChange(e, index)}
                      className={`w-full p-2 mt-1 border ${
                        trafficErrors[index] && trafficErrors[index].comments
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    {trafficErrors[index] && trafficErrors[index].comments && (
                      <p className="mt-1 text-xs text-red-500">
                        {trafficErrors[index].comments}
                      </p>
                    )}
                  </div>
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
                </div>
              ))}
              <div className="flex items-end justify-end w-full">
                <button
                  type="button"
                  onClick={addTrafficFields}
                  className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add More
                </button>
              </div>
            </>
          )}
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
              className={`px-6 py-2 font-semibold text-white bg-green-500 hover:bg-green-800 rounded-lg`}
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

export default ApplicationForm4;
