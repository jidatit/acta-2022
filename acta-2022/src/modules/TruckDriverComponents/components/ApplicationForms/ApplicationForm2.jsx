import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import IndexLabelLogic from "../../../SharedComponents/components/IndexLableLogic";
const ApplicationForm2 = () => {
  const navigate = useNavigate();
  const { FormData, setIsSaveClicked, currentUser } = useAuth();

  // Initialize localFormData with the new structure
  const [localFormData, setLocalFormData] = useState(FormData || []);

  const initialFields = [
    {
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update localFormData whenever FormData changes
  useEffect(() => {
    if (FormData) {
      setLocalFormData(FormData);
    }
  }, [FormData]);

  useEffect(() => {
    setIsSaveClicked(true);
  }, [setIsSaveClicked]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = [...localFormData];

    // Update value and reset status and note
    newFormData[index][name].value = value;
    newFormData[index][name].status = "pending"; // Update status as needed
    newFormData[index][name].note = ""; // Clear note on change

    setLocalFormData(newFormData);
    setIsSaveClicked(false);
  };

  const handleBack = () => {
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
        await updateDoc(docRef, {
          form2: applicationData,
          completedForms: 2,
        });
      } else {
        await setDoc(docRef, {
          form2: applicationData,
          completedForms: 2,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(true);

    await saveToFirebase();
    navigate("/TruckDriverLayout/ApplicationForm3");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    toast.success("Form is successfully saved");
    setIsSaveClicked(true);

    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        previousAddresses: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form2: applicationData,
        });
      } else {
        await setDoc(docRef, {
          form2: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };

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
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Previous Addresses
          </h1>
          <p className="text-lg text-black font-radios">
            List all addresses in previous three years
          </p>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>

      <div className="flex flex-col w-full gap-y-8 ">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          {Array.isArray(localFormData) &&
            localFormData.map((address, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 mb-6 ssm:grid-cols-2 md:grid-cols-3"
              >
                <IndexLabelLogic
                  label="Street 1"
                  id="street1"
                  name="street1"
                  value={address.street1.value || ""}
                  status={address.street1.status || "pending"}
                  note={address.street1.note || ""}
                  handleChange={handleChange}
                  index={index}
                />
                <IndexLabelLogic
                  label="Street 2"
                  id="street2"
                  name="street2"
                  value={address.street2.value}
                  status={address.street2.status}
                  note={address.street2.note}
                  handleChange={handleChange}
                  index={index}
                />
                <IndexLabelLogic
                  label="City"
                  id="city"
                  name="city"
                  value={address.city.value}
                  status={address.city.status}
                  note={address.city.note}
                  handleChange={handleChange}
                  index={index}
                />
                <IndexLabelLogic
                  label="State"
                  id="state"
                  name="state"
                  value={address.state.value}
                  status={address.state.status}
                  note={address.state.note}
                  handleChange={handleChange}
                  index={index}
                />
                <IndexLabelLogic
                  label="Zip Code"
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode.value}
                  status={address.zipCode.status}
                  note={address.zipCode.note}
                  handleChange={handleChange}
                  index={index}
                />
              </div>
            ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={addAddressFields}
              className="px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
            >
              Add Address
            </button>
          </div>
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
                onClick={handleSave}
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
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm2;
