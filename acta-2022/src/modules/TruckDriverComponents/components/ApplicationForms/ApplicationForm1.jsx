import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";

import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";
import { useAuthAdmin } from "../../../../AdminContext";
import { useAuth } from "../../../../AuthContext";
const ApplicationForm = ({ uid, clicked, setClicked }) => {
  const navigate = useNavigate();

  // Assuming this gives you userType for conditional logic
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const { fetchUserData, currentUser } = adminAuthData;
  // Use object destructuring with default values
  const { setIsSaveClicked, FormData1 } =
    currentUser?.userType === "Admin" ? adminAuthData : authData;

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(FormData1 || []); // Initial state with empty array if undefined

  useEffect(() => {
    if (uid) {
      fetchUserData(uid); // Fetch the data for the specific UID
      setFormData([]); // Reset form data when changing UID
    }
  }, [uid]);
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);

  useEffect(() => {
    if (FormData1 !== null) {
      setFormData(FormData1);
    } else {
      setFormData(null);
    }
  }, [FormData1]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value: value }, // Update only the value property
    }));

    // Clear the error if input is not empty
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key].value; // Access the value property here

      // Check if the value is a string before trimming
      if (typeof value === "string" && !value.trim()) {
        if (key !== "street2" && key !== "referredBy" && key !== "Email") {
          newErrors[key] = "This field is required";
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

        setIsSaveClicked(true);
        navigate("/TruckDriverLayout/ApplicationForm2");
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const saveFormInfo = async (uid) => {
    // Check if at least one field is filled
    const isAnyFieldFilled = Object.values(formData).some(
      (field) => field.value.trim() !== "" // Access the value property here
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    try {
      const applicationData = { ...formData, submittedAt: new Date() };

      // Reference to the specific document in the collection
      const docRef = doc(db, "truck_driver_applications", uid);

      // Check if the document exists
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(docRef, {
          form1: applicationData,
          // Use a descriptive key for each form
        });
      } else {
        // Document does not exist, create it
        await setDoc(docRef, {
          form1: applicationData,
        });
      }

      toast.success("Form is successfully saved");
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };
  if (currentUser.userType === "Admin") {
    useEffect(() => {
      console.log("child clicked", clicked);
      setClicked(false);
      if (clicked) {
        saveFormInfo(uid);
      }
    }, [clicked]);
  }

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row items-center justify-center w-full ">
        <h1 className="w-full text-xl font-bold text-center text-black">
          Application Form
        </h1>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
      </div>
      <div className=" flex flex-col w-full gap-y-8">
        <form className="w-full rounded-md shadow-md border-b-1 border-b-gray-400">
          {/* Line 1: Applicant Name */}
          <div className="mb-6">
            <SingleLabelLogic
              htmlFor="applicantName"
              labelName="Applicant Name"
              value={formData?.applicantName?.value}
              status={formData?.applicantName?.status}
              note={formData?.applicantName?.note}
              fieldName="applicantName"
              uid={uid}
            />
            <input
              type="text"
              name="applicantName"
              id="applicantName"
              value={formData?.applicantName?.value}
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
              <SingleLabelLogic
                htmlFor="appliedDate"
                labelName="Applied Date"
                value={formData?.appliedDate?.value}
                status={formData?.appliedDate?.status}
                note={formData?.appliedDate?.note}
                fieldName="appliedDate"
                uid={uid}
              />

              <input
                type="date"
                name="appliedDate"
                id="appliedDate"
                value={formData?.appliedDate?.value}
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
              <SingleLabelLogic
                htmlFor="positionApplied"
                labelName="Position Applied For"
                value={formData?.positionApplied?.value}
                status={formData?.positionApplied?.status}
                note={formData?.positionApplied?.note}
                fieldName="positionApplied"
                uid={uid}
              />
              <select
                name="positionApplied"
                id="positionApplied"
                value={formData.positionApplied.value}
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
              <SingleLabelLogic
                htmlFor="ssn"
                labelName="SSN"
                value={formData?.ssn?.value}
                status={formData?.ssn?.status}
                note={formData?.ssn?.note}
                fieldName="ssn"
                uid={uid}
              />
              <input
                type="text"
                name="ssn"
                id="ssn"
                value={formData.ssn.value}
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
              <SingleLabelLogic
                htmlFor="DOB"
                labelName="Date of Birth"
                value={formData?.DOB?.value}
                status={formData?.DOB?.status}
                note={formData?.DOB?.note}
                fieldName="DOB"
                uid={uid}
              />
              <input
                type="date"
                name="DOB"
                id="DOB"
                value={formData.DOB.value}
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
              <SingleLabelLogic
                htmlFor="gender"
                labelName="Gender"
                value={formData?.gender?.value}
                status={formData?.gender?.status}
                note={formData?.gender?.note}
                fieldName="gender"
                uid={uid}
              />
              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender.value === "male"}
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
                    checked={formData.gender.value === "female"}
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
              <SingleLabelLogic
                htmlFor="referredBy"
                labelName="Who Referred You"
                value={formData?.referredBy?.value}
                status={formData?.referredBy?.status}
                note={formData?.referredBy?.note}
                fieldName="referredBy"
                uid={uid}
              />
              <input
                type="text"
                name="referredBy"
                id="referredBy"
                value={formData.referredBy.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.referredBy ? "border-gray-300" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Line 4: Legal Right to Work, Pay Expected */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <SingleLabelLogic
                htmlFor="legalRightToWork"
                labelName="Do You Have Legal Right to Work in the United States?"
                value={formData?.legalRightToWork?.value}
                status={formData?.legalRightToWork?.status}
                note={formData?.legalRightToWork?.note}
                fieldName="legalRightToWork"
                uid={uid}
              />
              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="legalRightToWork"
                    value="yes"
                    checked={formData.legalRightToWork.value === "yes"}
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
                    checked={formData.legalRightToWork.value === "no"}
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
              <SingleLabelLogic
                htmlFor="payExpected"
                labelName="Rate of Pay Expected"
                value={formData?.payExpected?.value}
                status={formData?.payExpected?.status}
                note={formData?.payExpected?.note}
                fieldName="payExpected"
                uid={uid}
              />
              <input
                type="text"
                name="payExpected"
                id="payExpected"
                value={formData.payExpected.value}
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
              <SingleLabelLogic
                htmlFor="street1"
                labelName="Street 1"
                value={formData?.street1?.value}
                status={formData?.street1?.status}
                note={formData?.street1?.note}
                fieldName="street1"
                uid={uid}
              />
              <input
                type="text"
                name="street1"
                id="street1"
                value={formData.street1.value}
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
              <SingleLabelLogic
                htmlFor="street2"
                labelName="Street 2"
                value={formData?.street2?.value}
                status={formData?.street2?.status}
                note={formData?.street2?.note}
                fieldName="street2"
                uid={uid}
              />
              <input
                type="text"
                name="street2"
                id="street2"
                value={formData.street2.value}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md border-gray-300"
              />
            </div>
            <div>
              <SingleLabelLogic
                htmlFor="city"
                labelName="City"
                value={formData?.city?.value}
                status={formData?.city?.status}
                note={formData?.city?.note}
                fieldName="city"
                uid={uid}
              />
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city.value}
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
              <SingleLabelLogic
                htmlFor="state"
                labelName="State"
                value={formData?.state?.value}
                status={formData?.state?.status}
                note={formData?.state?.note}
                fieldName="state"
                uid={uid}
              />
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state.value}
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
              <SingleLabelLogic
                htmlFor="zipCode"
                labelName="Zip Code"
                value={formData?.zipCode?.value}
                status={formData?.zipCode?.status}
                note={formData?.zipCode?.note}
                fieldName="zipCode"
                uid={uid}
              />
              <input
                type="number"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode.value}
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
              <SingleLabelLogic
                htmlFor="cellPhone"
                labelName="Cell Phone #"
                value={formData?.cellPhone?.value}
                status={formData?.cellPhone?.status}
                note={formData?.cellPhone?.note}
                fieldName="cellPhone"
                uid={uid}
              />
              <input
                type="text"
                name="cellPhone"
                id="cellPhone"
                value={formData.cellPhone.value}
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
              <SingleLabelLogic
                htmlFor="Email"
                labelName="Email"
                value={formData?.Email?.value}
                status={formData?.Email?.status}
                note={formData?.Email?.note}
                fieldName="Email"
                uid={uid}
              />
              <input
                type="email"
                required
                name="Email"
                id="Email"
                disabled={true}
                value={currentUser.email}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md text-gray-400 ${
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
              <SingleLabelLogic
                htmlFor="EmergencyContact"
                labelName="Emergency Contact"
                value={formData?.EmergencyContact?.value}
                status={formData?.EmergencyContact?.status}
                note={formData?.EmergencyContact?.note}
                fieldName="EmergencyContact"
                uid={uid}
              />
              <input
                type="text"
                name="EmergencyContact"
                id="EmergencyContact"
                value={formData.EmergencyContact.value}
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
              <SingleLabelLogic
                htmlFor="Relationship"
                labelName="Relationship"
                value={formData?.Relationship?.value}
                status={formData?.Relationship?.status}
                note={formData?.Relationship?.note}
                fieldName="Relationship"
                uid={uid}
              />
              <input
                type="text"
                name="Relationship"
                id="Relationship"
                value={formData.Relationship.value}
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
              <SingleLabelLogic
                htmlFor="CDL"
                labelName="CDL #"
                value={formData?.CDL?.value}
                status={formData?.CDL?.status}
                note={formData?.CDL?.note}
                fieldName="CDL"
                uid={uid}
              />
              <input
                type="text"
                name="CDL"
                id="CDL"
                value={formData.CDL.value}
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
              <SingleLabelLogic
                htmlFor="CDLState"
                labelName="CDL State"
                value={formData?.CDLState?.value}
                status={formData?.CDLState?.status}
                note={formData?.CDLState?.note}
                fieldName="CDLState"
                uid={uid}
              />
              <input
                type="text"
                name="CDLState"
                id="CDLState"
                value={formData.CDLState.value}
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
              <SingleLabelLogic
                htmlFor="CDLClass"
                labelName="CDL Class"
                value={formData?.CDLClass?.value}
                status={formData?.CDLClass?.status}
                note={formData?.CDLClass?.note}
                fieldName="CDLClass"
                uid={uid}
              />
              <input
                type="text"
                name="CDLClass"
                id="CDLClass"
                value={formData.CDLClass.value}
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
            <SingleLabelLogic
              htmlFor="CDLExpirationDate"
              labelName="CDL Expiration Date"
              value={formData?.CDLExpirationDate?.value}
              status={formData?.CDLExpirationDate?.status}
              note={formData?.CDLExpirationDate?.note}
              fieldName="CDLExpirationDate"
              uid={uid}
            />
            <input
              type="date"
              name="CDLExpirationDate"
              id="CDLExpirationDate"
              value={formData.CDLExpirationDate.value}
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
            <SingleLabelLogic
              htmlFor="EverBeenDeniedALicense"
              labelName="Have you ever been denied a license, permit or privilege to
              operate a motor vehicle?"
              value={formData?.EverBeenDeniedALicense?.value}
              status={formData?.EverBeenDeniedALicense?.status}
              note={formData?.EverBeenDeniedALicense?.note}
              fieldName="EverBeenDeniedALicense"
              uid={uid}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverBeenDeniedALicense"
                  value="yes"
                  checked={formData.EverBeenDeniedALicense.value === "yes"}
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
                  checked={formData.EverBeenDeniedALicense.value === "no"}
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
            <SingleLabelLogic
              htmlFor="PermitPrivilegeOfLicense"
              labelName="Have any license, permit or privilege ever been suspended or
              revoked?"
              value={formData?.PermitPrivilegeOfLicense?.value}
              status={formData?.PermitPrivilegeOfLicense?.status}
              note={formData?.PermitPrivilegeOfLicense?.note}
              fieldName="PermitPrivilegeOfLicense"
              uid={uid}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="PermitPrivilegeOfLicense"
                  value="yes"
                  checked={formData.PermitPrivilegeOfLicense.value === "yes"}
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
                  checked={formData.PermitPrivilegeOfLicense.value === "no"}
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
            <SingleLabelLogic
              htmlFor="TestedPositiveOrRefusedDotDrug"
              labelName="Have you ever tested positive or refused a DOT drug or alcohol
              pre-employment test within the past 3 years from an employer who
              did not hire you?"
              value={formData?.TestedPositiveOrRefusedDotDrug?.value}
              status={formData?.TestedPositiveOrRefusedDotDrug?.status}
              note={formData?.TestedPositiveOrRefusedDotDrug?.note}
              fieldName="TestedPositiveOrRefusedDotDrug"
              uid={uid}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="TestedPositiveOrRefusedDotDrug"
                  value="yes"
                  checked={
                    formData.TestedPositiveOrRefusedDotDrug.value === "yes"
                  }
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
                  checked={
                    formData.TestedPositiveOrRefusedDotDrug.value === "no"
                  }
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
            <SingleLabelLogic
              htmlFor="EverConvictedOfFelony"
              labelName="Have you ever been convicted of a felony?"
              value={formData?.EverConvictedOfFelony?.value}
              status={formData?.EverConvictedOfFelony?.status}
              note={formData?.EverConvictedOfFelony?.note}
              fieldName="EverConvictedOfFelony"
              uid={uid}
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverConvictedOfFelony"
                  value="yes"
                  checked={formData.EverConvictedOfFelony.value === "yes"}
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
                  checked={formData.EverConvictedOfFelony.value === "no"}
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
        {currentUser.userType !== "Admin" ? (
          <div className="flex justify-end w-full gap-x-2">
            <button
              type="submit"
              onClick={() => saveFormInfo(currentUser.uid)}
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
