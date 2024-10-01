import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../AuthContext";
import { useNavigate } from "react-router";
import { FaBell } from "react-icons/fa";
const ApplicationForm8 = () => {
  const defaultFormData = [
    {
      driverName: "", // Driver's Name
      socialSecurityNumber: "", // Social Security Number
      driverLicenseNumber: "", // Driver's License #
      state: "", // State
      expDate: "", // Exp. Date (MM/DD/YYYY)
      typeOfLicense: "", // Type of License
      restrictions: "", // Restrictions
      endorsement: "", // Endorsement
      day1: "", // Day 1 (Yesterday)
      day1HoursWorked: "", // Hours worked on Day 1 (Yesterday)
      day2: "", // Day 2
      day2HoursWorked: "", // Hours worked on Day 2
      day3: "", // Day 3
      day3HoursWorked: "", // Hours worked on Day 3
      day4: "", // Day 4
      day4HoursWorked: "", // Hours worked on Day 4
      day5: "", // Day 5
      day5HoursWorked: "", // Hours worked on Day 5
      day6: "", // Day 6
      day6HoursWorked: "", // Hours worked on Day 6
      day7: "", // Day 7
      day7HoursWorked: "", // Hours worked on Day 7
      TotalHours: "", // Total hours worked
    },
  ];
  const navigate = useNavigate();
  const { formData8, setIsSaveClicked, currentUser, isSaveClicked } = useAuth();
  const [localFormData, setLocalFormData] = useState(
    formData8 || defaultFormData
  );
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (formData8 && formData8.length > 0) {
      setLocalFormData(formData8);
    } else {
      setLocalFormData(defaultFormData); // Ensure structure is in place even if formData8 is empty
    }
  }, [formData8]);
  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm7");
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        onDutyHours: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form8: applicationData,
          completedForms: 8, // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form8: applicationData,
          completedForms: 8,
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
        "state", // State
        "expDate", // Exp. Date (MM/DD/YYYY)
        "typeOfLicense", // Type of License
        "day1",
        "day2",
        "day3",
        "day4",
        "day5",
        "day6",
        "day7",
        "day1HoursWorked",
        "day2HoursWorked",
        "day3HoursWorked",
        "day4HoursWorked",
        "day5HoursWorked",
        "day6HoursWorked",
        "day7HoursWorked",
        "TotalHours",
      ];

      requiredFields.forEach((key) => {
        if (typeof field[key] === "string") {
          if (field[key].trim() === "") {
            fieldErrors[key] = "This field is required";
          }
        } else if (field[key] == null || field[key] === "") {
          // If the value is null or undefined or empty (for non-string fields like numbers)
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
      navigate("/TruckDriverLayout/ApplicationForm9");
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
        onDutyHours: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form8: applicationData,
          // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form8: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? { ...field, [name.replace(`company-${index}-`, "")]: value }
        : field
    );
    const totalHours = [
      "day1HoursWorked",
      "day2HoursWorked",
      "day3HoursWorked",
      "day4HoursWorked",
      "day5HoursWorked",
      "day6HoursWorked",
      "day7HoursWorked",
    ].reduce((sum, dayField) => {
      const hours = parseFloat(updatedFields[index][dayField]) || 0; // Handle empty fields or NaN
      return sum + hours;
    }, 0);

    // Update the TotalHours field with the calculated sum
    updatedFields[index].TotalHours = totalHours;
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

  return (
    <div className="flex flex-col items-start justify-start h-full md:ml-10 gap-y-12 w-[96%] md:w-[90%] flex-wrap overflow-x-hidden">
      <div className=" flex flex-col items-start justify-start w-full ">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="w-full md:ml-4 ml-6 mb-4 text-xl font-bold text-black">
            Statement of On-Duty Hours*
          </h1>
          <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
        </div>
      </div>

      <div className=" flex flex-col w-[99%] gap-y-8 flex-wrap">
        <form className="w-full p-6 bg-white shadow-md border-b-1 border-b-gray-400">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6">
                <div className="grid w-full grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`driverName-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Driver Name*
                    </label>
                    <input
                      type="text"
                      name="driverName"
                      id={`driverName-${index}`}
                      value={field.driverName}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.driverName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.driverName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].driverName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`socialSecurityNumber-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Social Security Number*
                    </label>
                    <input
                      type="text"
                      name="socialSecurityNumber"
                      id={`socialSecurityNumber-${index}`}
                      value={field.socialSecurityNumber}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.socialSecurityNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.socialSecurityNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].socialSecurityNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`driverLicenseNumber-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Driver's License Number # *
                    </label>
                    <input
                      type="text"
                      name="driverLicenseNumber"
                      id={`driverLicenseNumber-${index}`}
                      value={field.driverLicenseNumber}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.driverLicenseNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.driverLicenseNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].driverLicenseNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`state-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      State*
                    </label>
                    <input
                      type="text"
                      name="state"
                      id={`state-${index}`}
                      value={field.state}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.state && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`expDate-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      ExpDate*
                    </label>
                    <input
                      type="date"
                      name="expDate"
                      id={`expDate-${index}`}
                      value={field.expDate}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.expDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.expDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].expDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`typeOfLicense-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Type Of License*
                    </label>
                    <input
                      type="text"
                      name="typeOfLicense"
                      id={`typeOfLicense-${index}`}
                      value={field.typeOfLicense}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.typeOfLicense
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.typeOfLicense && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].typeOfLicense}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`restrictions-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Restrictions*
                    </label>
                    <input
                      type="text"
                      name="restrictions"
                      id={`restrictions-${index}`}
                      value={field.restrictions}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.restrictions
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.restrictions && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].restrictions}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`endorsement-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Endorsement*
                    </label>
                    <input
                      type="text"
                      name="endorsement"
                      id={`endorsement-${index}`}
                      value={field.endorsement}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.endorsement
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.endorsement && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].endorsement}
                      </p>
                    )}
                  </div>

                  <br />

                  <div className="flex flex-col gap-y-6 mt-7 smd:w-screen w-[90%] mb-6">
                    <p className="text-black font-radios text-[18px] smd:text-lg w-[100%] smd:w-[80%] lg:w-[90%]">
                      INSTRUCTIONS: Motor carriers when using a driver for the
                      first time shall obtain from the driver a signed statement
                      giving the total time on- duty during the immediately
                      preceding 7 days and time at which such driver was last
                      relleved from duty prior to beginning work for such
                      carrier.
                      <br />
                      Rule 395.8(1)(2) Federal Motor Carrier Safety
                      Regulations.NOTE: Hours for any compensated work during
                      the preceding 7 days, including work for a non-motor
                      carrier entity, must be recorded on this form.
                    </p>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day1-${index}`}
                          className="block w-full text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 1 (yesterday)*
                        </label>
                        <select
                          name="day1"
                          id={`day1-${index}`}
                          value={field.day1}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day1 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day1HoursWorked-${index}`}
                          className="block w-full text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day1HoursWorked"
                          id={`day1HoursWorked-${index}`}
                          value={field.day1HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day1HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day1HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day2-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 2*
                        </label>
                        <select
                          name="day2"
                          id={`day2-${index}`}
                          value={field.day2}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day2
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day2 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day2}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day2HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day2HoursWorked"
                          id={`day2HoursWorked-${index}`}
                          value={field.day2HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day2HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day2HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day2HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day3-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 3*
                        </label>
                        <select
                          name="day3"
                          id={`day3-${index}`}
                          value={field.day3}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day3
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day3 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day3}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day3HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day3HoursWorked"
                          id={`day3HoursWorked-${index}`}
                          value={field.day3HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day3HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day1HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day4-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 4*
                        </label>
                        <select
                          name="day4"
                          id={`day4-${index}`}
                          value={field.day4}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day4
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day4 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day4}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day4HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day4HoursWorked"
                          id={`day4HoursWorked-${index}`}
                          value={field.day4HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day4HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day4HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day4HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day5-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 1 (yesterday)*
                        </label>
                        <select
                          name="day5"
                          id={`day5-${index}`}
                          value={field.day5}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day5
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day5 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day5}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day5HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day5HoursWorked"
                          id={`day5HoursWorked-${index}`}
                          value={field.day5HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day5HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day5HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day5HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day6-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 6 *
                        </label>
                        <select
                          name="day6"
                          id={`day6-${index}`}
                          value={field.day6}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day6
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day6 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day6}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day6HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day6HoursWorked"
                          id={`day6HoursWorked-${index}`}
                          value={field.day6HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day6HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day6HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day6HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day7-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 7*
                        </label>
                        <select
                          name="day7"
                          id={`day7-${index}`}
                          value={field.day7}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day7
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {errors[index]?.day7 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day7}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[80%]">
                        <label
                          htmlFor={`day7HoursWorked-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Hours Worked*
                        </label>
                        <input
                          type="number"
                          name="day7HoursWorked"
                          id={`day7HoursWorked-${index}`}
                          value={field.day7HoursWorked}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2 mt-1 border rounded-md ${
                            errors[index]?.day7HoursWorked
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day7HoursWorked && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day7HoursWorked}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-[21%] md:w-[35%] w-[80%]">
                  <label
                    htmlFor={`TotalHours-${index}`}
                    className="block text-sm font-semibold text-gray-900 font-radios"
                  >
                    Total Hours*
                  </label>
                  <input
                    type="number"
                    name="TotalHours"
                    id={`TotalHours-${index}`}
                    value={field.TotalHours}
                    onChange={(e) => handleInputChange(index, e)}
                    className={`w-full p-2 mt-1 border rounded-md ${
                      errors[index]?.TotalHours
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[index]?.TotalHours && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].TotalHours}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </form>
        <div className="flex items-center justify-between w-[90%] smd:w-full ml-4 ">
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

export default ApplicationForm8;
