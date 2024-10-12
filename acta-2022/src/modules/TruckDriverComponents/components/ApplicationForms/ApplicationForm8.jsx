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
      relievedTime: "00:00",
      relievedDate: "",
    },
  ];
  const navigate = useNavigate();
  const { formData8, setIsSaveClicked, currentUser, isSaveClicked } = useAuth();
  const [localFormData, setLocalFormData] = useState(
    formData8 || defaultFormData
  );
  const [errors, setErrors] = useState([]);
  const convertTimeToAMPM = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour24 = parseInt(hours, 10);
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12; // Convert to 12-hour format

    return `${hour12}:${minutes}:00 ${ampm}`; // Format as 'hh:mm:ss AM/PM'
  };

  const formatTimeForInput = (time) => {
    if (!time) return ""; // Return empty if no time is set
    const [hour, minute, , period] = time.split(/[:\s]/); // Split on ':' and space
    const hour24 = period === "PM" && hour < 12 ? parseInt(hour) + 12 : hour; // Convert to 24-hour format
    return `${String(hour24).padStart(2, "0")}:${minute}`; // Return in 24-hour format for input
  };
  // Handler function for when the time input changes

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
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
        "relievedTime",
        "relievedDate",
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

    // Convert input value to desired format
    const timeFormatted = convertTimeToAMPM(value); // Convert the time to AM/PM format

    const updatedFields = localFormData.map((field, i) =>
      i === index ? { ...field, [name]: timeFormatted } : field
    );

    // Calculate total hours as before...
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

    // Update errors based on new input
    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name]: timeFormatted.trim() === "" ? "This field is required" : "",
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
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full ">
      <div className=" flex flex-col items-start justify-start w-full">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Statement of On-Duty Hours*
          </h1>
          <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
        </div>
      </div>

      <div className=" flex flex-col w-full flex-wrap">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pr-4">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6 w-full">
                <div className="grid w-full grid-cols-1 md:grid-cols-1">
                  <br />

                  <div className="flex flex-col gap-y-6 mt-7 w-screen mb-6">
                    <p className="text-black font-radios text-[15px] smd:text-lg w-[79%] sssm:w-[79%] smd:w-[79%] md:w-[70%] xxl:w-[70%] ">
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day1-${index}`}
                          className="block w-full text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 1 (yesterday)*
                        </label>
                        <input
                          type="date"
                          name="day1"
                          id={`day1-${index}`}
                          value={field.day1}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day1 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day1}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day2-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 2*
                        </label>
                        <input
                          type="date"
                          name="day2"
                          id={`day2-${index}`}
                          value={field.day2}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day2
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day2 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day2}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day3-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 3*
                        </label>
                        <input
                          type="date"
                          name="day3"
                          id={`day3-${index}`}
                          value={field.day3}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day3
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day3 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day3}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day4-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 4*
                        </label>
                        <input
                          type="date"
                          name="day4"
                          id={`day4-${index}`}
                          value={field.day4}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day4
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day4 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day4}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day5-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 5*
                        </label>
                        <input
                          type="date"
                          name="day5"
                          id={`day5-${index}`}
                          value={field.day5}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day5
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day5 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day5}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day6-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 6*
                        </label>
                        <input
                          type="date"
                          name="day6"
                          id={`day6-${index}`}
                          value={field.day6}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day6
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day6 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day6}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
                        <label
                          htmlFor={`day7-${index}`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Day 7*
                        </label>
                        <input
                          type="date"
                          name="day7"
                          id={`day7-${index}`}
                          value={field.day7}
                          onChange={(e) => handleInputChange(index, e)}
                          className={`w-full p-2.5 mt-1 border rounded-md ${
                            errors[index]?.day7
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[index]?.day7 && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[index].day7}
                          </p>
                        )}
                      </div>
                      <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%]">
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
                          className={`w-full p-2.5 mt-1 border rounded-md ${
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
                <div className="lg:w-[21%] md:w-[35%] w-[80%] -mt-2">
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

                <div className="flex items-center gap-x-4 lg:w-[21%] md:w-[35%] w-[80%] mt-7">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`time-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Relieved Time*
                    </label>
                    <form className="w-full mx-auto mt-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center p-3.5  pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-1 smd:mr-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="time"
                          id={`time-${index}`} // Unique ID for accessibility
                          name={`relievedTime`} // Ensure this name matches in validation
                          className={`bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-3.5 smd:p-2.5 ${
                            errors[index]?.relievedTime
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min="09:00"
                          max="18:00"
                          required
                          value={formatTimeForInput(field.relievedTime)} // Format the time for input
                          onChange={(e) => handleInputChange(index, e)} // Call handler on change
                        />
                      </div>
                      {errors[index]?.relievedTime && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].relievedTime}
                        </p>
                      )}
                    </form>
                  </div>
                </div>
                <div className="xxl:w-[15%] md:w-[25%] smd:w-[35%] w-[65%] mt-3">
                  <label
                    htmlFor={`relievedDate-${index}`}
                    className="block text-sm mb-3 font-semibold text-gray-900 font-radios"
                  >
                    Relieved Date*
                  </label>
                  <input
                    type="date"
                    name="relievedDate"
                    id={`relievedDate-${index}`}
                    value={field.relievedDate}
                    onChange={(e) => handleInputChange(index, e)}
                    className={`w-full p-2.5 mt-1 border rounded-md ${
                      errors[index]?.relievedDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[index]?.relievedDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].relievedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </form>
        <div className="flex items-center justify-between px-1 pt-3">
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

export default ApplicationForm8;
