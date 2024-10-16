import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";

import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import SingleLabelLogic from "../../../SharedComponents/components/SingleLableLogic";
import { useAuthAdmin } from "../../../../AdminContext";
import { useAuth } from "../../../../AuthContext";
const ApplicationForm = ({ uid }) => {
  const navigate = useNavigate();

  // Assuming this gives you userType for conditional logic
  const authData = useAuth();
  const adminAuthData = useAuthAdmin();
  const { fetchUserData, FormData1, currentUser } = adminAuthData;
  console.log("savedFormData1", FormData1);
  // Use object destructuring with default values
  const { setIsSaveClicked } =
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

    // Specifically check for the email field

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

  const saveFormInfo = async (e) => {
    e.preventDefault();

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
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);

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
          </div>

          {/* Submit Button */}
        </form>
        <div className="flex justify-end w-full gap-x-2">
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
