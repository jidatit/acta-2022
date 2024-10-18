import { useState } from "react";
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

const ModalWithForms = ({ openModal, setOpenModal, uid }) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!openModal) return null;

  const CurrentForm = forms[currentFormIndex];
  const isLastForm = currentFormIndex === forms.length - 1;

  const handleNext = () => {
    if (currentFormIndex < forms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1);
    }
  };

  const handleSave = () => {
    // Call the save function of the current form
    if (CurrentForm.save) {
      CurrentForm.save();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentFormIndex(0); // Reset to first form when closing
  };
  const handleClick = () => {
    setClicked(true);
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
  return (
    <div className="fixed inset-0 w-screen bg-black bg-opacity-50 h-screen z-50 flex justify-center items-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-[96%] smd:w-[90%] h-[90%] mx-4 flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-y-2 smd:flex-row smd:justify-between w-full mt-8">
            <h3 className="text-xl font-semibold">
              Application Form {currentFormIndex + 1}
            </h3>
            <button
              onClick={handleApproveAll}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Approve All
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4">
            <CurrentForm clicked={clicked} setClicked={setClicked} uid={uid} />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col smd:flex-row justify-between rounded-b-lg flex-shrink-0">
          <Button
            color="gray"
            onClick={handleBack}
            disabled={currentFormIndex === 0}
          >
            Back
          </Button>
          <div className="flex flex-col gap-y-2  smd:flex-row justify-end w-full gap-x-2">
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
                  className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Approve Application
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWithForms;
