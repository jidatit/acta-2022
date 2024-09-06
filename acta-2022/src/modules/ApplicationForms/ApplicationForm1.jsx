import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
const ApplicationForm = () => {
  const navigate = useNavigate();
  const { setIsSaveClicked, currentUser, FormData1 } = useAuth();
  const [formData, setFormData] = useState(FormData1);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);

  useEffect(() => {
    if (FormData1) {
      setFormData(FormData1);
    }
  }, [FormData1]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      // Exclude "street 2" and "who referred you" fields from validation
      if (key !== "street2" && key !== "referredBy") {
        const value = formData[key];

        // Check if the value is a string before trimming
        if (typeof value === "string" && !value.trim()) {
          newErrors[key] = "This Field is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const applicationData = { ...formData, submittedAt: new Date() };

        // Reference to the specific document in the collection
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);

        // Check if the document exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Document exists, update it
          await updateDoc(docRef, {
            form1: applicationData, // Use a descriptive key for each form
          });
        } else {
          // Document does not exist, create it
          await setDoc(docRef, {
            form1: applicationData,
          });
        }
        console.log(formData);

        setIsSaveClicked(true);
        navigate("/TruckDriverLayout/ApplicationForm2");
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Form is not valid, please fill in all required fields");
    }
  };

  const saveFormInfo = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSaveClicked(true);

      try {
        const applicationData = { ...formData, submittedAt: new Date() };

        // Reference to the specific document in the collection
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);

        // Check if the document exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Document exists, update it
          await updateDoc(docRef, {
            form1: applicationData,
            completedForms: 1, // Use a descriptive key for each form
          });
        } else {
          // Document does not exist, create it
          await setDoc(docRef, {
            form1: applicationData,
            completedForms: 1,
          });
        }
        toast.success("Form is successfully saved");
        setIsSaveClicked(true);
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Form is not valid, please fill in all required fields");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-y-12">
      <div className="flex flex-row items-center justify-center w-full pr-10">
        <h1 className="w-full text-xl font-bold text-center text-black">
          Application Form
        </h1>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
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
              className={`w-full p-2 mt-1 border rounded-md ${
                errors.applicantName
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
            />
            {errors.applicantName && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.applicantName}
              </p>
            )}
          </div>

          {/* Line 2: Applied Date, Position Applied For, SSN */}
          <div className="grid grid-cols-1 gap-4 mb-6 md md:grid-cols-3">
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
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.appliedDate
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.appliedDate && (
                <p className="mt-1 text-[15px] font-radios text-red-500">
                  {errors.appliedDate}
                </p>
              )}
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
                className={`w-full p-[12px] mt-1 border rounded-md ${
                  errors.positionApplied
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Position</option>
                <option value="position1">Position 1</option>
                <option value="position2">Position 2</option>
              </select>
              {errors.positionApplied && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  This Field is required
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.ssn ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.ssn && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.ssn}
                </p>
              )}
            </div>
          </div>

          {/* Line 3: Date of Birth, Gender, Who Referred You */}
          <div className="grid justify-center grid-cols-1 gap-4 mb-6 md:grid-cols-3">
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
                max={new Date().toISOString().split("T")[0]} // Setting max to today's date
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.DOB ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.DOB && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.DOB}
                </p>
              )}
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
                    className={`text-blue-500 form-radio ${
                      errors.gender ? "border-red-500 border-2" : ""
                    }`}
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
                    className={`text-blue-500 form-radio ${
                      errors.gender ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.gender}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.referredBy ? "border-gray-300" : "border-gray-300"
                }`}
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
                    className={`text-blue-500 form-radio ${
                      errors.legalRightToWork ? "border-red-500 border-2" : ""
                    }`}
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
                    className={`text-blue-500 form-radio ${
                      errors.legalRightToWork ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.legalRightToWork && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.legalRightToWork}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.payExpected
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.payExpected && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.payExpected}
                </p>
              )}
            </div>
          </div>

          {/* Line 5-8: Address Details */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.street1 ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.street1 && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.street1}
                </p>
              )}
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
                className="w-full p-2 mt-1 border rounded-md border-gray-300"
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.city ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.city}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.state ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.state}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Zip Code
              </label>
              <input
                type="number"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.zipCode ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.zipCode}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="cellPhone"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Cell Phone
              </label>
              <input
                type="number"
                name="cellPhone"
                id="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.cellPhone
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.cellPhone && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.cellPhone}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.Email ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.Email && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.Email}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.EmergencyContact
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.EmergencyContact && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.EmergencyContact}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.Relationship
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.Relationship && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.Relationship}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDL ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.CDL && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDL}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDLState
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.CDLState && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDLState}
                </p>
              )}
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
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDLClass
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.CDLClass && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDLClass}
                </p>
              )}
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
              min={new Date().toISOString().split("T")[0]}
              className={`w-full p-2 mt-1 border rounded-md ${
                errors.CDLExpirationDate
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
            />
            {errors.CDLExpirationDate && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.CDLExpirationDate}
              </p>
            )}
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
                  className={`text-blue-500 form-radio ${
                    errors.EverBeenDeniedALicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
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
                  className={`text-blue-500 form-radio ${
                    errors.EverBeenDeniedALicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.EverBeenDeniedALicense && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.EverBeenDeniedALicense}
              </p>
            )}
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
                  className={`text-blue-500 form-radio ${
                    errors.PermitPrivilegeOfLicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
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
                  className={`text-blue-500 form-radio ${
                    errors.PermitPrivilegeOfLicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.PermitPrivilegeOfLicense && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.PermitPrivilegeOfLicense}
              </p>
            )}
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
                  className={`text-blue-500 form-radio ${
                    errors.TestedPositiveOrRefusedDotDrug
                      ? "border-red-500 border-2"
                      : ""
                  }`}
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
                  className={`text-blue-500 form-radio ${
                    errors.TestedPositiveOrRefusedDotDrug
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.TestedPositiveOrRefusedDotDrug && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.TestedPositiveOrRefusedDotDrug}
              </p>
            )}
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
                  className={`text-blue-500 form-radio ${
                    errors.EverConvictedOfFelony
                      ? "border-red-500 border-2 "
                      : ""
                  }`}
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
                  className={`text-blue-500 form-radio ${
                    errors.EverConvictedOfFelony
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.EverConvictedOfFelony && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.EverConvictedOfFelony}
              </p>
            )}
          </div>

          {/* Submit Button */}
        </form>
        <div className="flex justify-end w-full gap-x-4">
          <button
            type="submit"
            onClick={saveFormInfo}
            className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
