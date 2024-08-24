import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
const ApplicationForm = () => {
  const navigate = useNavigate();
  const { setIsSaveClicked } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: "",
    appliedDate: "",
    positionApplied: "",
    ssn: "",
    DOB: "",
    gender: "",
    referredBy: "",
    legalRightToWork: "",
    payExpected: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    cellPhone: "",
    Email: "",
    EmergencyContact: "",
    Relationship: "",
    CDL: "",
    CDLState: "",
    CDLClass: "",
    CDLExpirationDate: "",
    EverBeenDeniedALicense: "",
    PermitPrivilegeOfLicense: "",
    TestedPositiveOrRefusedDotDrug: "",
    EverConvictedOfFelony: "",
  });
  const isFormFilled = Object.values(formData).every(
    (value) => value.trim() !== ""
  );
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    setIsSaveClicked(true);
    navigate("/TruckDriverLayout/ApplicationForm2");
  };
  const saveFormInfo = (e) => {
    e.preventDefault();
    setIsSaveClicked(true);
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-y-12">
      <div className="flex flex-row items-center justify-center w-full pr-10">
        <h1 className="w-full text-xl font-bold text-center text-black">
          Application Form
        </h1>
        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>
      <div className=" flex flex-col w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white rounded-md shadow-md border-b-1 border-b-gray-400">
          {/* Line 1: Applicant Name */}
          <div className="mb-6">
            <label
              htmlFor="applicantName"
              className="block text-sm font-semibold text-gray-900 font-radios"
            >
              Applicant Name
            </label>
            <input
              type="text"
              name="applicantName"
              id="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* Line 2: Applied Date, Position Applied For, SSN */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="appliedDate"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Application Date
              </label>
              <input
                type="date"
                name="appliedDate"
                id="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="positionApplied"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Position Applied For
              </label>
              <select
                name="positionApplied"
                id="positionApplied"
                value={formData.positionApplied}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="">Select Position</option>
                <option value="position1">Position 1</option>
                <option value="position2">Position 2</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="ssn"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                SSN
              </label>
              <input
                type="text"
                name="ssn"
                id="ssn"
                value={formData.ssn}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Line 3: Date of Birth, Gender, Who Referred You */}
          <div className="grid justify-center grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="DOB"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="DOB"
                id="DOB"
                value={formData.DOB}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 font-radios">
                Gender
              </label>
              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="text-blue-500 form-radio"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="text-blue-500 form-radio"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="referredBy"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Who Referred You
              </label>
              <input
                type="text"
                name="referredBy"
                id="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Line 4: Legal Right to Work, Pay Expected */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 font-radios">
                Do You Have Legal Right to Work in the United States?
              </label>
              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="legalRightToWork"
                    value="yes"
                    checked={formData.legalRightToWork === "yes"}
                    onChange={handleChange}
                    className="text-blue-500 form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="legalRightToWork"
                    value="no"
                    checked={formData.legalRightToWork === "no"}
                    onChange={handleChange}
                    className="text-blue-500 form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="payExpected"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Rate of Pay Expected
              </label>
              <input
                type="text"
                name="payExpected"
                id="payExpected"
                value={formData.payExpected}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Line 5-8: Address Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="street1"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Street 1
              </label>
              <input
                type="text"
                name="street1"
                id="street1"
                value={formData.street1}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="street2"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Street 2
              </label>
              <input
                type="text"
                name="street2"
                id="street2"
                value={formData.street2}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="cellPhone"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Cell Phone
              </label>
              <input
                type="text"
                name="cellPhone"
                id="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Email
              </label>
              <input
                type="email"
                name="Email"
                id="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="EmergencyContact"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Emergency Contact
              </label>
              <input
                type="text"
                name="EmergencyContact"
                id="EmergencyContact"
                value={formData.EmergencyContact}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="Relationship"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Relationship
              </label>
              <input
                type="text"
                name="Relationship"
                id="Relationship"
                value={formData.Relationship}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="CDL"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                CDL#
              </label>
              <input
                type="text"
                name="CDL"
                id="CDL"
                value={formData.CDL}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="CDLState"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                CDL State
              </label>
              <input
                type="text"
                name="CDLState"
                id="CDLState"
                value={formData.CDLState}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="CDLClass"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                CDL Class
              </label>
              <input
                type="text"
                name="CDLClass"
                id="CDLClass"
                value={formData.CDLClass}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Line 9: Additional Questions */}
          <div className="mb-6">
            <label
              htmlFor="CDLExpirationDate"
              className="block text-sm font-semibold text-gray-900 font-radios"
            >
              CDL Expiration Date
            </label>
            <input
              type="date"
              name="CDLExpirationDate"
              id="CDLExpirationDate"
              value={formData.CDLExpirationDate}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 font-radios">
              Have you ever been denied a license, permit or privilege to
              operate a motor vehicle?
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverBeenDeniedALicense"
                  value="yes"
                  checked={formData.EverBeenDeniedALicense === "yes"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="EverBeenDeniedALicense"
                  value="no"
                  checked={formData.EverBeenDeniedALicense === "no"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 font-radios">
              Have any license, permit or privilege ever been suspended or
              revoked?
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="PermitPrivilegeOfLicense"
                  value="yes"
                  checked={formData.PermitPrivilegeOfLicense === "yes"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="PermitPrivilegeOfLicense"
                  value="no"
                  checked={formData.PermitPrivilegeOfLicense === "no"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 font-radios">
              Have you ever tested positive or refused a DOT drug or alcohol
              pre-employment test within the past 3 years from an employer who
              did not hire you?
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="TestedPositiveOrRefusedDotDrug"
                  value="yes"
                  checked={formData.TestedPositiveOrRefusedDotDrug === "yes"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="TestedPositiveOrRefusedDotDrug"
                  value="no"
                  checked={formData.TestedPositiveOrRefusedDotDrug === "no"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 font-radios">
              Have you ever been convicted of a felony?
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverConvictedOfFelony"
                  value="yes"
                  checked={formData.EverConvictedOfFelony === "yes"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="EverConvictedOfFelony"
                  value="no"
                  checked={formData.EverConvictedOfFelony === "no"}
                  onChange={handleChange}
                  className="text-blue-500 form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          {/* Submit Button */}
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

export default ApplicationForm;
