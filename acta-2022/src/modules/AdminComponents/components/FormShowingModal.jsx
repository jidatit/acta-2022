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
  if (!openModal) return null;

  const CurrentForm = forms[currentFormIndex];

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

  return (
    <div className="fixed inset-0 w-screen bg-black bg-opacity-50 h-screen z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-[90%] h-[90%] mx-4 overflow-y-auto relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Application Form {currentFormIndex + 1}
          </h3>
          <div className="space-y-4">
            <CurrentForm clicked={clicked} setClicked={setClicked} uid={uid} />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between rounded-b-lg">
          <Button
            color="gray"
            onClick={handleBack}
            disabled={currentFormIndex === 0}
          >
            Back
          </Button>

          <div className="flex justify-end w-full gap-x-2">
            <button
              type="submit"
              onClick={handleClick}
              className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentFormIndex === forms.length - 1}
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWithForms;
