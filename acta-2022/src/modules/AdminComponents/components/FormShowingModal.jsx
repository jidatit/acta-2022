import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { X } from "lucide-react";

// Importing all 9 application form components
import ApplicationForm from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm1";
import ApplicationForm2 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm2";
import ApplicationForm3 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm3";
import ApplicationForm4 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm4";
import ApplicationForm5 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm5";
import ApplicationForm6 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm6";
import ApplicationForm7 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm7";
import ApplicationForm8 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm8";
import ApplicationForm9 from "../../TruckDriverComponents/components/ApplicationForms/ApplicationForm9";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { toast } from "react-toastify";
import FormStatusHeader from "./FormStatusHeader";

const forms = [
  ApplicationForm,
  ApplicationForm2,
  ApplicationForm3,
  ApplicationForm4,
  ApplicationForm5,
  ApplicationForm6,
  ApplicationForm7,
  ApplicationForm8,
  ApplicationForm9,
];

const ModalWithForms = ({ openModal, setOpenModal, uid, driverStatus }) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [applicationStatus, setApplicationStatus] = useState("");
  const [availableForms, setAvailableForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFormData = async () => {
      if (!uid) return;

      setIsLoading(true);
      try {
        const docRef = doc(db, "truck_driver_applications", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);

          // Get savedForms count from root of document
          const savedFormsCount = data.savedForms || 0;

          // Generate available forms array based on savedForms count
          const available = Array.from(
            { length: Math.min(savedFormsCount, forms.length) },
            (_, index) => index
          );

          setAvailableForms(available);

          // If current form index is not available, set to last available form
          if (!available.includes(currentFormIndex)) {
            setCurrentFormIndex(available[available.length - 1] || 0);
          }
        } else {
          // If no document exists, only first form is available
          setAvailableForms([0]);
          setCurrentFormIndex(0);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Error loading form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [uid]);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "TruckDrivers"));
        const driverStatuses = querySnapshot.docs.map(
          (doc) => doc.data().driverStatus
        );
        if (driverStatuses.length > 0) {
          setApplicationStatus(driverStatuses[0]);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, [uid]);

  if (!openModal || isLoading) return null;

  const CurrentForm = forms[currentFormIndex];
  const isLastForm = currentFormIndex === forms.length - 1;

  const handleNext = () => {
    const nextIndex = currentFormIndex + 1;
    if (availableForms.includes(nextIndex)) {
      setCurrentFormIndex(nextIndex);
    } else {
      toast.warning(
        "Please complete and save the current form before proceeding to the next one."
      );
    }
  };

  const handleBack = () => {
    const prevIndex = currentFormIndex - 1;
    if (prevIndex >= 0 && availableForms.includes(prevIndex)) {
      setCurrentFormIndex(prevIndex);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentFormIndex(0);
  };

  const isNextEnabled = () => {
    const nextIndex = currentFormIndex + 1;
    return availableForms.includes(nextIndex);
  };
  const handleClick = () => {
    setClicked(true);
  };
  const isFormEmpty = (formIndex) => {
    const formKey = `form${formIndex + 1}`;
    return !formData[formKey] || Object.keys(formData[formKey]).length === 0;
  };
  const handleApproveAll = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentForm = `form${currentFormIndex + 1}`;
        const formData = data[currentForm];

        // Create an object to store the updated form
        const updatedData = { ...data };

        // Function to recursively update all status fields to "approved"
        const updateStatusFields = (obj) => {
          if (!obj || typeof obj !== "object") return obj;

          let updated = Array.isArray(obj) ? [...obj] : { ...obj };

          // If the current object has a status field, update it
          if ("status" in obj) {
            updated.status = "approved";
          }

          // Recursively update nested objects and arrays
          Object.keys(updated).forEach((key) => {
            if (typeof updated[key] === "object") {
              updated[key] = updateStatusFields(updated[key]);
            }
          });

          return updated;
        };

        // Update the current form's data
        if (currentFormIndex + 1 === 1) {
          // Handle form1 (top-level fields)
          updatedData[currentForm] = updateStatusFields(formData);
        } else {
          // Handle other forms (nested fields)
          updatedData[currentForm] = updateStatusFields(formData);
        }

        // Update the document in Firebase
        await updateDoc(docRef, {
          [currentForm]: updatedData[currentForm],
        });

        toast.success(
          `Successfully approved all fields in Form ${currentFormIndex + 1}`
        );
      } else {
        toast.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error in handleApproveAll:", error);
      toast.error("Error updating statuses: " + error.message);
    }
  };
  const handleRejectAll = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);
      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentForm = `form${currentFormIndex + 1}`;
        const formData = data[currentForm];

        // Create an object to store the updated form
        const updatedData = { ...data };

        // Function to recursively update all status fields to "approved"
        const updateStatusFields = (obj) => {
          if (!obj || typeof obj !== "object") return obj;

          let updated = Array.isArray(obj) ? [...obj] : { ...obj };

          // If the current object has a status field, update it
          if ("status" in obj) {
            updated.status = "rejected";
          }

          // Recursively update nested objects and arrays
          Object.keys(updated).forEach((key) => {
            if (typeof updated[key] === "object") {
              updated[key] = updateStatusFields(updated[key]);
            }
          });

          return updated;
        };

        // Update the current form's data
        if (currentFormIndex + 1 === 1) {
          // Handle form1 (top-level fields)
          updatedData[currentForm] = updateStatusFields(formData);
        } else {
          // Handle other forms (nested fields)
          updatedData[currentForm] = updateStatusFields(formData);
        }

        // Update the document in Firebase
        await updateDoc(docRef, {
          [currentForm]: updatedData[currentForm],
        });

        toast.success(
          `Successfully rejected all fields in Form ${currentFormIndex + 1}`
        );
      } else {
        toast.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error in handleApproveAll:", error);
      toast.error("Error updating statuses: " + error.message);
    }
  };
  const handleApplicationStatus = async (status) => {
    try {
      setIsSubmitting(true);

      // First update truck_driver_applications collection
      const docRef = doc(db, "truck_driver_applications", uid);
      await updateDoc(docRef, {
        applicationStatus: status,
        applicationStatusDate: new Date().toISOString(),
      });

      // Then update TruckDrivers collection
      // First query to find the document with matching uid
      const truckDriversQuery = query(
        collection(db, "TruckDrivers"),
        where("uid", "==", uid)
      );

      const querySnapshot = await getDocs(truckDriversQuery);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const truckDriverDoc = querySnapshot.docs[0];

        // Update the status in the found document
        await updateDoc(doc(db, "TruckDrivers", truckDriverDoc.id), {
          driverStatus: status,
          statusUpdateDate: new Date().toISOString(),
        });
      } else {
        console.warn("No matching document found in TruckDrivers collection");
      }

      toast.success(
        `Application ${
          status === "approved" ? "approved" : "rejected"
        } successfully!`
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Error updating application status: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDotClick = (index) => {
    if (availableForms.includes(index)) {
      setCurrentFormIndex(index);
    } else {
      toast.warning("This form is not available yet.");
    }
  };

  return (
    <div className="fixed inset-0 w-screen bg-black bg-opacity-50 h-screen z-50 flex justify-center items-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-[96%] md:w-[97%] xl:w-[90%] h-[90%] mx-4 flex flex-col ">
        {/* Fixed Header */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col md:flex-row md:justify-between w-full mt-8 gap-y-6">
            <div className="flex flex-col gap-y-4 md:items-center smd:flex-row  ">
              <h3 className="text-xl font-semibold ">
                Page {currentFormIndex + 1}
              </h3>
              <FormStatusHeader
                formData={formData}
                applicationStatus={applicationStatus}
                driverStatus={driverStatus}
              />
            </div>
            <div className="flex gap-x-4 items-center ">
              {" "}
              <button
                onClick={handleApproveAll}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Approve All
              </button>
              <button
                onClick={handleRejectAll}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4">
            <CurrentForm clicked={clicked} setClicked={setClicked} uid={uid} />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-4 rounded-b-lg flex-shrink-0">
          {/* Progress Dots - Always on top, centered */}
          <div className="flex justify-center w-full mt-4">
            <div className="flex gap-2">
              {forms.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    availableForms.includes(index)
                      ? currentFormIndex === index
                        ? "bg-blue-600"
                        : "bg-blue-400"
                      : "bg-gray-300"
                  }`}
                  title={
                    availableForms.includes(index)
                      ? `Form ${index + 1}`
                      : "Not available yet"
                  }
                  onClick={() => handleDotClick(index)}
                  style={{
                    cursor: availableForms.includes(index)
                      ? "pointer"
                      : "default",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-row justify-between items-center w-full gap-x-2 md:-mt-4">
            {/* Left - Back Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleBack}
                disabled={currentFormIndex === 0}
                className={`px-4 py-2 rounded ${
                  currentFormIndex === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Back
              </button>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex gap-x-2">
              <button
                type="submit"
                onClick={handleClick}
                className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
              >
                Save
              </button>

              {isLastForm ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleApplicationStatus("rejected")}
                    disabled={isSubmitting}
                    className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplicationStatus("approved")}
                    disabled={isSubmitting}
                    className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve Application
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isNextEnabled()}
                  className={`px-4 py-2 rounded ${
                    !isNextEnabled()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWithForms;
