import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";

const ApplicationForm4 = () => {
  const navigate = useNavigate();
  const {
    addressField,
    trafficConvictionField,
    saveAddressField4,
    saveTrafficConviction4,
    setIsSaveClicked,
    isSaveClicked,
    currentUser,
  } = useAuth();

  const [addressFields, setAddressFields] = useState(addressField);
  const [trafficConvictionFields, setTrafficConvictionFields] = useState(
    trafficConvictionField
  );

  const [errors, setErrors] = useState([]);
  const [trafficErrors, setTrafficErrors] = useState([]);

  // State to track if the checkboxes are checked
  const [noAccidentsChecked, setNoAccidentsChecked] = useState(false);
  const [
    noTrafficConvictionsChecked,
    setNoTrafficConvictionsChecked,
  ] = useState(false);
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    setAddressFields(addressField);
    setTrafficConvictionFields(trafficConvictionField);
  }, [addressField, trafficConvictionField]);
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
    updatedFields[index][name] = value;
    setAddressFields(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (errors[index] && errors[index][name]) {
      const updatedErrors = [...errors];
      delete updatedErrors[index][name];
      setErrors(updatedErrors);
    }
  };

  const handleTrafficChange = (e, index) => {
    if (noTrafficConvictionsChecked) return;

    const { name, value } = e.target;
    const updatedFields = [...trafficConvictionFields];
    updatedFields[index][name] = value;
    setTrafficConvictionFields(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (trafficErrors[index] && trafficErrors[index][name]) {
      const updatedErrors = [...trafficErrors];
      delete updatedErrors[index][name];
      setTrafficErrors(updatedErrors);
    }
  };

  const validateAddressFields = () => {
    const newErrors = addressFields.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.trim() === "") {
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
        if (value.trim() === "") {
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
        previousAddresses: noAccidentsChecked ? [] : addressFields,
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

      // console.log("Data successfully saved to Firebase");
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
      saveAddressField4(noAccidentsChecked ? [] : addressFields);
      saveTrafficConviction4(
        noTrafficConvictionsChecked ? [] : trafficConvictionFields
      );
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm5");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isAddressValid = validateAddressFields();
    const isTrafficValid = validateTrafficFields();

    if (
      (noAccidentsChecked || isAddressValid) &&
      (noTrafficConvictionsChecked || isTrafficValid)
    ) {
      saveAddressField4(noAccidentsChecked ? [] : addressFields);
      saveTrafficConviction4(
        noTrafficConvictionsChecked ? [] : trafficConvictionFields
      );
      toast.success("Form is successfully saved");
      setIsSaveClicked(true);

      await saveToFirebase();
    }
  };

  const addAddressFields = () => {
    setAddressFields([
      ...addressFields,
      {
        date: "",
        accidentType: "",
        location: "",
        fatalities: "",
        penalties: "",
        comments: "",
      },
    ]);
  };

  const addTrafficFields = () => {
    setTrafficConvictionFields([
      ...trafficConvictionFields,
      { date: "", offenseType: "", location: "", penalties: "", comments: "" },
    ]);
  };
  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[89%] md:w-[80%]">
      <div className="flex flex-row items-start justify-start w-full pr-10">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Driving background and Qualifications
          </h1>
          <p className="text-lg text-black font-radios">
            Provide accident record and forfeitures record for previous 3 years
          </p>
        </div>
        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>

      {/* First Form */}
      <div className="flex flex-col w-[90%] md:w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <input
              type="checkbox"
              checked={noAccidentsChecked}
              onChange={() => setNoAccidentsChecked(!noAccidentsChecked)}
              className="p-3"
            />
            <p className="text-lg text-black font-radios">
              No accidents in past 3 years
            </p>
          </div>
          {!noAccidentsChecked && (
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
                      Date
                    </label>
                    <input
                      type="text"
                      name="date"
                      id={`date-${index}`}
                      value={address.date}
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
                      Type of Accident
                    </label>
                    <input
                      type="text"
                      name="accidentType"
                      id={`accidentType-${index}`}
                      value={address.accidentType}
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
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={address.location}
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
                      Fatalities
                    </label>
                    <input
                      type="text"
                      name="fatalities"
                      id={`fatalities-${index}`}
                      value={address.fatalities}
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
                      Penalties
                    </label>
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={address.penalties}
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
                      Comments
                    </label>
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={address.comments}
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
                </div>
              ))}
              <div className="flex items-end justify-end w-full">
                <button
                  type="button"
                  onClick={addAddressFields}
                  className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Address
                </button>
              </div>
            </>
          )}
        </form>

        {/* Second Form */}
        <form className="w-full p-6 bg-white shadow-md border-b-1 border-b-gray-400">
          <p className="mb-4 text-lg text-black font-radios">
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
            <p className="text-lg text-black font-radios">
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
                      Date
                    </label>
                    <input
                      type="text"
                      name="date"
                      id={`date-${index}`}
                      value={traffic.date}
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
                      Type of Offense
                    </label>
                    <input
                      type="text"
                      name="offenseType"
                      id={`offenseType-${index}`}
                      value={traffic.offenseType}
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
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id={`location-${index}`}
                      value={traffic.location}
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
                      Penalties
                    </label>
                    <input
                      type="text"
                      name="penalties"
                      id={`penalties-${index}`}
                      value={traffic.penalties}
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
                      Comments
                    </label>
                    <input
                      type="text"
                      name="comments"
                      id={`comments-${index}`}
                      value={traffic.comments}
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
                </div>
              ))}
              <div className="flex items-end justify-end w-full">
                <button
                  type="button"
                  onClick={addTrafficFields}
                  className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Traffic Conviction
                </button>
              </div>
            </>
          )}
        </form>

        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
          >
            back
          </button>
          <div className="flex justify-end w-full gap-x-4">
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
