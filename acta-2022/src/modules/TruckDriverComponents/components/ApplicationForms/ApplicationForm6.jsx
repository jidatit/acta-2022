import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../../../../AuthContext";
import { useNavigate } from "react-router";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
const ApplicationForm6 = () => {
  const {
    setIsSaveClicked,
    violationField,
    isSaveClicked,
    currentUser,
    noViolationChecked,
  } = useAuth();
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [noViolationCheckeds, setNoViolationChecked] =
    useState(noViolationChecked);
  const [violationFields, setViolationFields] = useState(
    violationField.length > 0
      ? violationField
      : [
          {
            date: "",
            offense: "",
            location: "",
            vehicleOperated: "",
          },
        ]
  );
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  useEffect(() => {
    setNoViolationChecked(noViolationChecked);

    setViolationFields(violationField);
  }, [violationField, noViolationChecked]);
  useEffect(() => {
    if (violationFields.length === 0) {
      setViolationFields([
        {
          date: "",
          offense: "",
          location: "",
          vehicleOperated: "",
        },
      ]);
    }
  }, [violationFields]);

  const handleBack = () => {
    // Check if save is clicked
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    // Navigate back to the previous form
    navigate("/TruckDriverLayout/ApplicationForm5");
  };
  const handleVolationFieldChange = (e, index) => {
    if (noViolationCheckeds) return;

    const { name, value } = e.target;
    const updatedFields = [...violationFields];
    updatedFields[index][name] = value;
    setViolationFields(updatedFields);

    const allFieldsEmpty = updatedFields.every((field) =>
      Object.values(field).every((val) => val.trim() === "")
    );
    setIsSaveClicked(allFieldsEmpty);

    if (errors[index] && errors[index][name]) {
      const updatedErrors = [...errors];
      delete updatedErrors[index][name];
      setErrors(updatedErrors);
    }
  };
  const validateViolationFields = () => {
    const newErrors = violationFields.map((field) => {
      const fieldErrors = {};
      Object.entries(field).forEach(([key, value]) => {
        if (value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });
      return fieldErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        violationRecords: noViolationCheckeds ? [] : violationFields,

        submittedAt: new Date(),
        noViolations: noViolationCheckeds,
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form6: applicationData,
          completedForms: 6,
        });
      } else {
        await setDoc(docRef, {
          form6: applicationData,
          completedForms: 6,
        });
      }

      //console.log("Data successfully saved to Firebase");
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isViolationField = validateViolationFields();

    if (noViolationCheckeds || isViolationField) {
      setIsSaveClicked(true);

      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm7");
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if there is at least one field filled out
    const hasViolationData =
      !noViolationCheckeds &&
      violationFields.some((field) =>
        Object.values(field).some((val) => val.trim() !== "")
      );

    if (noViolationCheckeds || hasViolationData) {
      // Perform save
      toast.success("Form is successfully saved");
      setIsSaveClicked(true);

      try {
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);
        const docSnap = await getDoc(docRef);

        const applicationData = {
          violationRecords: noViolationCheckeds ? [] : violationFields,

          submittedAt: new Date(),
          noViolations: noViolationCheckeds,
        };

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            form6: applicationData,
          });
        } else {
          await setDoc(docRef, {
            form6: applicationData,
          });
        }
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Please complete at least one field before saving.");
    }
  };

  const addViolationFields = () => {
    setViolationFields([
      ...violationFields,
      {
        date: "",
        offense: "",
        location: "",
        vehicleOperated: "",
      },
    ]);
  };
  const removeViolationField = (index) => {
    setViolationFields(violationFields.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-4 w-full flex-wrap overflow-x-hidden">
      <div className="flex flex-row items-start justify-start w-full">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Certifications of violations
          </h1>
        </div>

        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>
      <p className="mt-3 text-sm smd:text-lg text-black font-radios">
        Each driver shall furnish the list required in accordance with paragraph
        (a) of this section. If the driver has not been convicted of, or
        forfeited bond or collateral on account of, any violation which must be
        listed he/she shall so certify.I certify that the following is a true
        and complete list of traffic violations (other than parking violations)
        for which I have been convicted or forfeited bond or collateral during
        the past 12 months.
      </p>
      <div className="flex flex-col gap-y-1">
        <p className="mt-3 text-lg text-black font-radios">
          §391.27 Record of violations
        </p>
        <p className="text-[17px] smd:text-lg text-black font-radios">
          DRIVER'S CERTIFICATION
        </p>
      </div>
      <div className="flex flex-col w-full gap-y-8 ">
        <div className="flex flex-col ">
          <p className="text-[17px] smd:text-lg text-black font-radios">
            Check this box if
          </p>
          <div className="flex flex-row gap-x-3 items-center">
            <input
              type="checkbox"
              checked={noViolationCheckeds}
              onChange={() => setNoViolationChecked(!noViolationCheckeds)}
              className=""
            />
            <p className="text-[17px] smd:text-lg text-black font-radios">
              No Violation
            </p>
          </div>

          <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 ">
            <div className="flex flex-row mb-8 gap-x-2"></div>
            {noViolationCheckeds === false && (
              <>
                {violationFields.map((address, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
                  >
                    <div>
                      <label
                        htmlFor={`date-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Date*
                      </label>
                      <input
                        type="date"
                        name="date"
                        id={`date-${index}`}
                        value={address.date}
                        onChange={(e) => handleVolationFieldChange(e, index)}
                        className={`w-full p-2 mt-1 border ${
                          errors[index] && errors[index].date
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {errors[index] && errors[index].date && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[index].date}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`offense-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Offense*
                      </label>
                      <input
                        type="text"
                        name="offense"
                        id={`offense-${index}`}
                        value={address.offense}
                        onChange={(e) => handleVolationFieldChange(e, index)}
                        className={`w-full p-2 mt-1 border ${
                          errors[index] && errors[index].offense
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {errors[index] && errors[index].offense && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[index].offense}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`location-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Location*
                      </label>
                      <input
                        type="text"
                        name="location"
                        id={`location-${index}`}
                        value={address.location}
                        onChange={(e) => handleVolationFieldChange(e, index)}
                        className={`w-full p-2 mt-1 border ${
                          errors[index] && errors[index].location
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {errors[index] && errors[index].location && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[index].location}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`vehicleOperated-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        vehicleOperated*
                      </label>
                      <input
                        type="text"
                        name="vehicleOperated"
                        id={`vehicleOperated-${index}`}
                        value={address.vehicleOperated}
                        onChange={(e) => handleVolationFieldChange(e, index)}
                        className={`w-full p-2 mt-1 border ${
                          errors[index] && errors[index].vehicleOperated
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {errors[index] && errors[index].vehicleOperated && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[index].vehicleOperated}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => removeViolationField(index)}
                          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-end justify-end w-full">
                  <button
                    type="button"
                    onClick={addViolationFields}
                    className="px-6 py-2 mb-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Add More
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="flex items-center justify-between px-1 mt-2">
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
    </div>
  );
};

export default ApplicationForm6;
