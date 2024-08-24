import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
const ApplicationForm3 = () => {
  const navigate = useNavigate();
  const {
    saveFormData3,
    FormData3,
    setFormData3,
    setIsSaveClicked,
  } = useAuth();
  const [localFormData, setLocalFormData] = useState(FormData3);
  const isFormFilled = localFormData.every((field) =>
    Object.values(field).every((value) => {
      console.log("Checking value:", value); // Debugging line
      return value.trim() !== "";
    })
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaveClicked(false);
    console.log(localFormData);

    // navigate("/TruckDriverLayout/ApplicationForm2");
  };

  const saveFormInfo = (e) => {
    e.preventDefault();
    saveFormData3(localFormData);
    setIsSaveClicked(true);
    console.log(localFormData);
  };

  const handleAddCompany = () => {
    setLocalFormData([
      ...localFormData,
      {
        companyName: "",
        street: "",
        city: "",
        zipCode: "",
        contactPerson: "",
        phone: "",
        fax1: "",
        from: "",
        to: "",
        position: "",
        salary: "",
        leavingReason: "",
        subjectToFMCSRs: "",
        jobDesignatedAsSafetySensitive: "",
      },
    ]);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? { ...field, [name.replace(`company-${index}-`, "")]: value }
        : field
    );
    setLocalFormData(updatedFields);
  };

  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[80%]">
      <div className="flex flex-row items-start justify-start w-full pr-10">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Previous Addresses
          </h1>
          <p className="mt-3 text-lg text-black font-radios">
            *The Federal Motor Carrier Safety Regulations (49 CFR 391.21)
            require that all applicants wishing to drive a commercial vehicle
            list all employment for the last three (3) years. In addition, if
            you have driven a commercial vehicle previously, you must provide
            employment history for an additional seven (7) years (for a total of
            ten (10) years). Any gaps in employment in excess of one (1) month
            must be explained. Start with the last or current position,
            including any military experience, and work backwards(attach
            separate sheets if necessary). You are required to list the complete
            mailing address, including street number, city, state, zip; and
            complete all other information.
          </p>
        </div>

        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>

      <div className=" flex flex-col w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md border-b-1 border-b-gray-400">
          {localFormData.map((field, index) => (
            <div key={index} className="mb-6">
              <div className="grid w-full grid-cols-3 gap-4 mb-6">
                <div>
                  <label
                    htmlFor={`companyName-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id={`companyName-${index}`}
                    value={field.companyName}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`street-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    id={`street-${index}`}
                    value={field.street}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`city-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    City/State
                  </label>
                  <input
                    type="text"
                    name="city"
                    id={`city-${index}`}
                    value={field.city}
                    onChange={(e) => handleInputChange(index, e)}
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
                    value={field.zipCode}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`contactPerson-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    id={`contactPerson-${index}`}
                    value={field.contactPerson}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`phone-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Phone#
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id={`phone-${index}`}
                    value={field.phone}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`fax1-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    FAX#1
                  </label>
                  <input
                    type="text"
                    name="fax1"
                    id={`fax1-${index}`}
                    value={field.fax1}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`from-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    id={`from-${index}`}
                    value={field.from}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`to-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    id={`to-${index}`}
                    value={field.to}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`position-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    id={`position-${index}`}
                    value={field.position}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`salary-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    id={`salary-${index}`}
                    value={field.salary}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`leavingReason-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Leaving Reason
                  </label>
                  <input
                    type="text"
                    name="leavingReason"
                    id={`leavingReason-${index}`}
                    value={field.leavingReason}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-screen mb-6">
                  <div className="w-full mb-6">
                    <label
                      htmlFor={`company-${index}-subjectToFMCSRs`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Subject to FMCSRs
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`company-${index}-subjectToFMCSRs`} // Use a template literal to create a unique string
                          value="yes"
                          checked={field.subjectToFMCSRs === "yes"}
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <input
                          type="radio"
                          name={`company-${index}-subjectToFMCSRs`} // Use the same string as above
                          value="no"
                          checked={field.subjectToFMCSRs === "no"}
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="w-full mb-6">
                    <label
                      className="block text-sm font-semibold text-gray-900 font-radios"
                      htmlFor={`company-${index}-jobDesignatedAsSafetySensitive`}
                    >
                      Job Designated as Safety Sensitive
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`company-${index}-jobDesignatedAsSafetySensitive`}
                          value="yes"
                          checked={
                            field.jobDesignatedAsSafetySensitive === "yes"
                          }
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <input
                          type="radio"
                          name={`company-${index}-jobDesignatedAsSafetySensitive`}
                          value="no"
                          checked={
                            field.jobDesignatedAsSafetySensitive === "no"
                          }
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={handleAddCompany}
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Company
            </button>
          </div>
        </form>
        <div className="flex justify-end w-full gap-x-4">
          <button
            type="submit"
            onClick={saveFormInfo}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormFilled}
            className={`px-6 py-2 font-semibold text-white rounded-lg ${
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

export default ApplicationForm3;
