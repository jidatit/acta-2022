import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import { FaBell } from "react-icons/fa";
const ApplicationForm2 = () => {
  const navigate = useNavigate();
  const { FormData, saveFormData, isSaveClicked, setIsSaveClicked } = useAuth();
  const [localFormData, setLocalFormData] = useState(FormData);

  useEffect(() => {
    setLocalFormData(FormData);
  }, [FormData]);

  const isFormFilled = localFormData.every((address) =>
    Object.values(address).every((value) => value.trim() !== "")
  );

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = [...localFormData];
    newFormData[index][name] = value;
    setLocalFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data to context
    saveFormData(localFormData);
    // Navigate or handle form submission
    console.log(localFormData);
    // navigate("/TruckDriverLayout/ApplicationForm2");
  };
  const handleSave = (e) => {
    e.preventDefault();
    saveFormData(localFormData); // Save form data to context
    setIsSaveClicked(true); // Update save state
  };
  const addAddressFields = () => {
    setLocalFormData([
      ...localFormData,
      { street1: "", street2: "", city: "", state: "", zipCode: "" },
    ]);
  };
  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[80%]">
      <div className="flex flex-row items-start justify-start w-full pr-10">
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

      <div className=" flex flex-col w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md border-b-1 border-b-gray-400">
          {localFormData.map((address, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-6">
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
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
        <div className="flex justify-end w-full gap-x-4">
          <button
            type="submit"
            onClick={handleSave}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormFilled}
            className={`px-6 py-2 font-semibold text-white rounded-lg  ${
              isFormFilled
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm2;
