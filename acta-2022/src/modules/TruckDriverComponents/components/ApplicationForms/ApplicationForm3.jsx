import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
const ApplicationForm3 = () => {
  const navigate = useNavigate();
  const { FormData3, setIsSaveClicked, currentUser, isSaveClicked } = useAuth();

  const [localFormData, setLocalFormData] = useState(FormData3);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (FormData3) {
      setLocalFormData(FormData3);
    }
    //console.log(localFormData);
  }, [FormData3]);

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm2");
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        EmploymentHistory: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form3: applicationData,
          completedForms: 3, // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form3: applicationData,
          completedForms: 3,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };
  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};

      // Only required fields should be validated
      const requiredFields = [
        "companyName",
        "city",
        "zipCode",
        "contactPerson",
        "phone",
        "from",
        "to",
        "position",
        "leavingReason",
        "subjectToFMCSRs",
        "jobDesignatedAsSafetySensitive",
      ];

      requiredFields.forEach((key) => {
        if (field[key].trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });

      return fieldErrors;
    });

    setErrors(newErrors);
    return newErrors.every(
      (fieldErrors) => Object.keys(fieldErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(false);

    if (validateForm()) {
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm4");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if at least one field is filled
    const isAnyFieldFilled = localFormData.some((field) =>
      Object.values(field).some((value) => value.trim() !== "")
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    toast.success("Form is successfully saved");

    setIsSaveClicked(true);

    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        EmploymentHistory: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form3: applicationData,
          // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form3: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
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
    setErrors([...errors, {}]); // Add an empty error object for the new company
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? { ...field, [name.replace(`company-${index}-`, "")]: value }
        : field
    );

    setLocalFormData(updatedFields);

    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name.replace(`company-${index}-`, "")]:
              (name.includes("subjectToFMCSRs") ||
                name.includes("jobDesignatedAsSafetySensitive")) &&
              value.trim() === ""
                ? "This field is required"
                : "",
          }
        : error
    );

    setErrors(updatedErrors);

    const allFieldsEmpty = updatedFields.every((address) =>
      Object.values(address).every((fieldValue) => fieldValue.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };
  const removeCompany = (index) => {
    setLocalFormData(localFormData.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  //console.log(localFormData);
  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12">
      <div className=" flex flex-col items-start justify-start w-full ">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Employment History*
          </h1>
          <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
        </div>
        <p className="mt-3 text-[16px] md:text-lg px-1 smd:p-0 text-justify text-black font-radios">
          *The Federal Motor Carrier Safety Regulations (49 CFR 391.21) require
          that all applicants wishing to drive a commercial vehicle list all
          employment for the last three (3) years. In addition, if you have
          driven a commercial vehicle previously, you must provide employment
          history for an additional seven (7) years (for a total of ten (10)
          years). Any gaps in employment in excess of one (1) month must be
          explained. Start with the last or current position, including any
          military experience, and work backwards(attach separate sheets if
          necessary). You are required to list the complete mailing address,
          including street number, city, state, zip; and complete all other
          information.
        </p>
      </div>

      <div className=" flex flex-col gap-y-4 flex-wrap">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6">
                <div className="grid w-full grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`companyName-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Company Name*
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id={`companyName-${index}`}
                      value={field.companyName}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.companyName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`street-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Street*
                    </label>
                    <input
                      type="text"
                      name="street"
                      id={`street-${index}`}
                      value={field.street}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.street
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.street && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].street}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`city-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      City/State*
                    </label>
                    <input
                      type="text"
                      name="city"
                      id={`city-${index}`}
                      value={field.city}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`zipCode-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Zip Code*
                    </label>
                    <input
                      type="number"
                      name="zipCode"
                      id={`zipCode-${index}`}
                      value={field.zipCode}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.zipCode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.zipCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`contactPerson-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Contact Person*
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      id={`contactPerson-${index}`}
                      value={field.contactPerson}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.contactPerson
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.contactPerson && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`phone-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Phone #*
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id={`phone-${index}`}
                      value={field.phone}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`fax1-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Fax #
                    </label>
                    <input
                      type="text"
                      name="fax1"
                      id={`fax1-${index}`}
                      value={field.fax1}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.fax1
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.fax1 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].fax1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`from-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      From*
                    </label>
                    <input
                      type="date"
                      name="from"
                      id={`from-${index}`}
                      min={new Date().toISOString().split("T")[0]}
                      value={field.from}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.from
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.from && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].from}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`to-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      To*
                    </label>
                    <input
                      type="date"
                      name="to"
                      id={`to-${index}`}
                      value={field.to}
                      onChange={(e) => handleInputChange(index, e)}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.to ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.to && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].to}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`position-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Position*
                    </label>
                    <input
                      type="text"
                      name="position"
                      id={`position-${index}`}
                      value={field.position}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.position
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.position && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].position}
                      </p>
                    )}
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
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.salary
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.salary && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].salary}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`leavingReason-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Reason for Leaving*
                    </label>
                    <input
                      type="text"
                      name="leavingReason"
                      id={`leavingReason-${index}`}
                      value={field.leavingReason}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.leavingReason
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.leavingReason && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].leavingReason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col smd:w-screen w-[90%] mb-6">
                    <div className="w-full mb-6">
                      <label
                        htmlFor={`company-${index}-subjectToFMCSRs`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Were you subject to the FMCSRs while employed?*
                      </label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`company-${index}-subjectToFMCSRs`}
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
                            name={`company-${index}-subjectToFMCSRs`}
                            value="no"
                            checked={field.subjectToFMCSRs === "no"}
                            onChange={(e) => handleInputChange(index, e)}
                            className="text-blue-500 form-radio"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {errors[index]?.subjectToFMCSRs && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].subjectToFMCSRs}
                        </p>
                      )}
                    </div>

                    <div className="w-full mb-6">
                      <label
                        htmlFor={`company-${index}-jobDesignatedAsSafetySensitive`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Was your job designated as a safety-sensitive function
                        in any DOT-regulated mode subject to the drug and
                        alcohol testing requirements?*
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
                      {errors[index]?.jobDesignatedAsSafetySensitive && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].jobDesignatedAsSafetySensitive}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center mt-4">
                      {index !== 0 && ( // Only show remove button for dynamically added fields
                        <button
                          type="button"
                          onClick={() => removeCompany(index)}
                          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
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
              Add More
            </button>
          </div>
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

export default ApplicationForm3;
