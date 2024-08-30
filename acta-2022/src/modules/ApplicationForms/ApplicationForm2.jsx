import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
const ApplicationForm2 = () => {
  const navigate = useNavigate();
  const {
    FormData,
    saveFormData,
    setIsSaveClicked,
    currentUser,
    isSaveClicked,
  } = useAuth();
  const [localFormData, setLocalFormData] = useState(FormData || []);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (FormData) {
      setLocalFormData(FormData);
    }
    // console.log(localFormData);
  }, [FormData]);

  useEffect(() => {
    setIsSaveClicked(true);
    // console.log(localFormData);
  }, [setIsSaveClicked]);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = [...localFormData];
    newFormData[index][name] = value;
    setLocalFormData(newFormData);

    const allFieldsEmpty = newFormData.every((address) =>
      Object.values(address).every((fieldValue) => fieldValue.trim() === "")
    );
    // console.log(localFormData);
    setIsSaveClicked(allFieldsEmpty);

    if (errors[index] && errors[index][name]) {
      const newErrors = [...errors];
      delete newErrors[index][name];
      setErrors(newErrors);
    }
  };
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm1");
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        previousAddresses: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        // Document exists, so update it
        await updateDoc(docRef, {
          form2: applicationData, // Update this with the specific key for this form
        });
      } else {
        // Document does not exist, so create it
        await setDoc(docRef, {
          form2: applicationData,
        });
      }

      // console.log("Data successfully saved to Firebase");
    } catch (error) {
      console.error("Error saving application: ", error);
      // Optionally, handle specific error cases or show user feedback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = localFormData.map((address) => {
      const addressErrors = {};
      Object.entries(address).forEach(([key, value]) => {
        if (value.trim() === "") {
          addressErrors[key] = "This field is required";
        }
      });
      return addressErrors;
    });

    setErrors(newErrors);

    if (newErrors.every((address) => Object.keys(address).length === 0)) {
      saveFormData(localFormData);
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm3");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = localFormData.map((address) => {
      const addressErrors = {};
      Object.entries(address).forEach(([key, value]) => {
        if (value.trim() === "") {
          addressErrors[key] = "This field is required";
        }
      });
      return addressErrors;
    });

    setErrors(newErrors);

    if (newErrors.every((address) => Object.keys(address).length === 0)) {
      toast.success("Form is successfully saved");
      saveFormData(localFormData);
      setIsSaveClicked(true);

      await saveToFirebase();
    }
  };

  const addAddressFields = () => {
    setLocalFormData([
      ...localFormData,
      { street1: "", street2: "", city: "", state: "", zipCode: "" },
    ]);
  };

  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[85%] md:w-[80%]">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Previous Addresses
          </h1>
          <p className="text-lg text-black font-radios">
            List all addresses in previous three years
          </p>
        </div>
        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>

      <div className=" flex flex-col w-[95%] smd:w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md border-b-1 border-b-gray-400">
          {localFormData.map((address, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 ssm:grid-cols-2 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor={`street1-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Street 1
                </label>
                <input
                  type="text"
                  name="street1"
                  id={`street1-${index}`}
                  value={address.street1}
                  onChange={(e) => handleChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].street1
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].street1 && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].street1}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`street2-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Street 2
                </label>
                <input
                  type="text"
                  name="street2"
                  id={`street2-${index}`}
                  value={address.street2}
                  onChange={(e) => handleChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].street2
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].street2 && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].street2}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`city-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id={`city-${index}`}
                  value={address.city}
                  onChange={(e) => handleChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].city
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].city && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].city}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`state-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id={`state-${index}`}
                  value={address.state}
                  onChange={(e) => handleChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].state
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].state && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].state}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`zipCode-${index}`}
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id={`zipCode-${index}`}
                  value={address.zipCode}
                  onChange={(e) => handleChange(e, index)}
                  className={`w-full p-2 mt-1 border ${
                    errors[index] && errors[index].zipCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors[index] && errors[index].zipCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[index].zipCode}
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
              Add
            </button>
          </div>
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
              className={`px-6 py-2 font-semibold text-white bg-green-600 hover:bg-green-800 rounded-lg`}
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

export default ApplicationForm2;
