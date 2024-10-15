import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";

const ApplicationForm7 = () => {
  const navigate = useNavigate();
  const { alcoholDrugTesting, setIsSaveClicked, currentUser, isSaveClicked } =
    useAuth();

  const [localFormData, setLocalFormData] = useState(alcoholDrugTesting);
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    if (alcoholDrugTesting) {
      setLocalFormData(alcoholDrugTesting);
    }
    //console.log(localFormData);
  }, [alcoholDrugTesting]);

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm6");
  };
  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        AlcoholDrugTest: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form7: applicationData,
          completedForms: 7, // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form7: applicationData,
          completedForms: 7,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };
  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};

      // Validate 'testedPositiveEver'
      if (
        !field.testedPositiveEver.value ||
        (field.testedPositiveEver.value &&
          field.testedPositiveEver.value.trim() === "")
      ) {
        fieldErrors.testedPositiveEver = "This field is required";
      }

      if (
        field.testedPositiveEver.value === "yes" &&
        (!field.DOTCompletion.value ||
          (field.DOTCompletion.value &&
            field.DOTCompletion.value.trim() === ""))
      ) {
        fieldErrors.DOTCompletion = "This field is required";
      }
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
      navigate("/TruckDriverLayout/ApplicationForm8");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if at least one field is filled
    const isAnyFieldFilled = localFormData.some((field) =>
      Object.values(field).some(
        (input) => input.value && input.value.trim() !== ""
      )
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
        AlcoholDrugTest: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form7: applicationData,
          // Update this with the specific key for this form
        });
      } else {
        await setDoc(docRef, {
          form7: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) => {
      if (i === index) {
        const updatedField = {
          ...field,
          [name]: {
            ...field[name],
            value: value,
          },
        };
        // If 'testedPositiveEver' is "no", set 'DOTCompletion' to an empty string
        if (name === "testedPositiveEver" && value === "no") {
          updatedField.DOTCompletion = {
            value: "",
            status: "pending",
            note: "",
          };
        }
        return updatedField;
      }
      return field;
    });

    setLocalFormData(updatedFields);

    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name]: value.trim() === "" ? "This field is required" : "",
          }
        : error
    );

    setErrors(updatedErrors);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((input) => input.value.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-6">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="  flex flex-col items-start justify-start w-full">
          <h1 className="smd:w-full mb-4 w-[97%] text-[17px] smd:text-xl font-bold text-black">
            Previous Pre-Employment Employee Alcohol and Drug Testing Statement
          </h1>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>
      <div className="flex flex-col gap-y-5 w-full">
        <p className="text-black font-radios w-full text-[16px] smd:text-lg">
          Sec. 40.25() As the employer, you must also ask the employee whether
          he or she has tested positive, or refused to test, on any pre-
          employment drug or alcohol test administered by an employer to which
          the employee applied for, but did not obtain, safety sensitive
          transportation work covered by DOT agency, drug and alcohol testing
          rules during the past two years.
        </p>
        <p className="text-black font-radios w-full text-[16px] smd:text-lg">
          If the employee admits that he or she had a positive test or refusal
          to test, you must not use the employee to perform safety-sensitive
          functions for you, until and unless the employee documents successful
          completion of the return-to-duty process, (see Sec. 40.25(b)(5) and
          (e))
        </p>
      </div>
      <div className=" flex flex-col w-full gap-y-8">
        <form
          className="w-full bg-white shadow-md border-b-1 border-b-gray-400"
          onSubmit={handleSubmit}
        >
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div className="flex flex-col w-full mb-6" key={index}>
                <div className="w-full mb-6">
                  <label
                    htmlFor={`company-${index}-testedPositiveEver`}
                    className="block w-full text-[15px] smd:text-lg text-gray-900 font-radios"
                  >
                    Have you ever been tested positive or refused to be tested
                    on any pre-employment drug test in which you were not hired
                    during the past two years?*
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`testedPositiveEver`}
                        value="yes"
                        checked={field.testedPositiveEver.value === "yes"}
                        onChange={(e) => handleInputChange(index, e)}
                        className="text-blue-500 form-radio"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name={`testedPositiveEver`}
                        value="no"
                        checked={field.testedPositiveEver.value === "no"}
                        onChange={(e) => handleInputChange(index, e)}
                        className="text-blue-500 form-radio"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors[index]?.testedPositiveEver && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[index].testedPositiveEver}
                    </p>
                  )}
                </div>
                {field.testedPositiveEver.value === "yes" && (
                  <div className="w-full mb-6">
                    <label
                      htmlFor={`company-${index}-DOTCompletion`}
                      className="block w-full text-[15px] smd:text-lg text-gray-900 font-radios"
                    >
                      If yes, have you successfully completed the DOT return to
                      duty process?*
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`DOTCompletion`}
                          value="yes"
                          checked={field.DOTCompletion.value === "yes"}
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <input
                          type="radio"
                          name={`DOTCompletion`}
                          value="no"
                          checked={field.DOTCompletion.value === "no"}
                          onChange={(e) => handleInputChange(index, e)}
                          className="text-blue-500 form-radio"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {errors[index]?.DOTCompletion && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].DOTCompletion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
        </form>
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg"
          >
            Back
          </button>
          <div className="flex justify-end w-full gap-x-2">
            <button
              type="submit"
              onClick={handleSave}
              className="px-6 py-2 font-semibold text-white bg-green-600 hover:bg-green-800 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm7;
