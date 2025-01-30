import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { MdNoteAlt } from "react-icons/md";
const FormLabelWithStatus = ({
  label,
  id,
  status,
  note,
  index,
  fieldName,
  uid,
  important = false,
}) => {
  const { currentUser } = useAuth();

  const [existingNote, setExistingNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
  const dropdownRef = useRef(null); // Ref for the dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };
  const handleApproveApplication = () => {
    handleApprove();
    setIsDropdownOpen(false); // Close dropdown after action
  };
  const handleRejectApplication = () => {
    handleReject();
    setIsDropdownOpen(false); // Close dropdown after action
  };
  const handleViewNote = async () => {
    const existingNotes = await getNoteForField(uid, fieldName);

    setExistingNote(existingNotes);
    setIsModalOpen(true); // Show modal through state

    setShowDropdown(false);
  };

  const [notes, setNote] = useState("");
  const handleAddNote = () => {
    setNote("");
    setShowDropdown(false);
    setIsModalOpen(true); // Show modal through state
  };
  // Step 2: Update state on textarea change
  const handleTextareaChange = (e) => {
    setNote(e.target.value);
  };

  const getNoteForField = async (uid, fieldName) => {
    let docRef = [];
    try {
      if (currentUser.userType === "Admin") {
        docRef = doc(db, "truck_driver_applications", uid);
      } else {
        docRef = doc(db, "truck_driver_applications", currentUser.uid);
      }

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return "";
      }

      const data = docSnap.data();
      const updatedData = { ...data };
      const arrayKeys = [
        "previousAddresses",
        "EmploymentHistory",
        "accidentRecords",
        "trafficConvictions",
        "driverExperience",
        "driverLicensePermit",
        "educationHistory",
        "extraSkills",
        "violationRecords",
        "AlcoholDrugTest",
        "onDutyHours",
        "compensatedWork",
      ];

      const retrieveNoteFromNestedField = (obj, targetIndex) => {
        // if (Array.isArray(obj)) {
        //   const item = obj[index];
        //   if (item && item[fieldName] && item[fieldName].note !== undefined) {
        //     return item[fieldName].note;
        //   }
        if (Array.isArray(obj)) {
          return obj.map((item, index) => {
            // Check if the current index matches the target index
            if (index === targetIndex) {
              // Update the specified field for the matching object
              return {
                ...item,
                [fieldName]: {
                  ...item[fieldName],
                },
              };
            }
            return item; // Return unchanged item
          });
        }

        if (obj && typeof obj === "object") {
          for (const key in obj) {
            if (arrayKeys.includes(key) && Array.isArray(obj[key])) {
              const note = retrieveNoteFromNestedField(obj[key], index);
              if (note !== undefined && note !== null) {
                return note;
              }
            }
          }
        }

        return null;
      };

      for (let i = 1; i <= updatedData.savedForms; i++) {
        const formKey = `form${i}`;
        if (updatedData[formKey]) {
          updatedData[formKey] = retrieveNoteFromNestedField(
            updatedData[formKey],
            index
          );

          if (note !== null) {
            return note;
          }
        }
      }

      return "";
    } catch (error) {
      console.error("Error retrieving note:", error);
      toast.error(`Error retrieving note: ${error.message}`);
      return "";
    }
  };

  const handleSave = async () => {
    // try {
    //   const docRef = doc(db, "truck_driver_applications", uid);
    //   const docSnap = await getDoc(docRef);

    //   if (!docSnap.exists()) {
    //     toast.error("Document does not exist!");
    //     return;
    //   }

    //   const data = docSnap.data();
    //   const updatedData = { ...data };

    //   // Array of keys that we want to check for updates
    //   const arrayKeys = [
    //     "PreviousAddresses",
    //     "EmploymentHistory",
    //     "accidentRecords",
    //     "trafficConvictions",
    //     "driverExperience",
    //     "driverLicensePermit",
    //     "educationHistory",
    //     "extraSkills",
    //     "violationRecords",
    //     "AlcoholDrugTest",
    //     "onDutyHours",
    //     "compensatedWork",
    //   ];

    //   const updateNestedField = (obj, targetIndex) => {
    //     // If the object is an array, process each item
    //     if (Array.isArray(obj)) {
    //       return obj.map((item, index) => {
    //         // Check if the current index matches the target index
    //         if (index === targetIndex) {
    //           // Update the specified field for the matching object
    //           return {
    //             ...item,
    //             [fieldName]: {
    //               ...item[fieldName],
    //               note: notes,
    //               dummy: "dummy field",
    //             },
    //           };
    //         }
    //         return item; // Return unchanged item
    //       });
    //     }

    //     // If the object is indeed an object (not null)
    //     if (obj && typeof obj === "object") {
    //       const newObj = {};
    //       for (const key in obj) {
    //         // Check if the key is in the arrayKeys list and if it contains an array
    //         if (arrayKeys.includes(key) && Array.isArray(obj[key])) {
    //           newObj[key] = updateNestedField(obj[key], index); // Recursively update the specified fields
    //         } else {
    //           // Keep other fields unchanged
    //           newObj[key] = obj[key];
    //         }
    //       }
    //       return newObj; // Return the updated object
    //     }

    //     return obj; // Return the object if it's neither an array nor an object
    //   };

    //   // Process each form and apply updates
    //   for (let i = 1; i <= data.savedForms; i++) {
    //     const formKey = `form${i}`;
    //     if (data[formKey]) {
    //       updatedData[formKey] = updateNestedField(data[formKey], index);
    //     }
    //   }

    //   await updateDoc(docRef, updatedData);
    //   setIsModalOpen(false);
    //   toast.success(`Successfully updated status for ${fieldName}`);
    // } catch (error) {
    //   console.error("Error updating status:", error);
    //   toast.error(`Error updating status: ${error.message}`);
    // }
    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Array of keys that we want to check for updates
      const arrayKeys = [
        "previousAddresses",
        "EmploymentHistory",
        "accidentRecords",
        "trafficConvictions",
        "driverExperience",
        "driverLicensePermit",
        "educationHistory",
        "extraSkills",
        "violationRecords",
        "AlcoholDrugTest",
        "onDutyHours",
        "compensatedWork",
      ];

      const updateNestedField = (obj, targetIndex, fieldName) => {
        if (Array.isArray(obj)) {
          return obj.map((item, index) => {
            // Check if the array item has the specific field to update
            if (index === targetIndex && item.hasOwnProperty(fieldName)) {
              return {
                ...item,
                [fieldName]: {
                  ...item[fieldName],
                  note: notes,
                },
              };
            }
            return item;
          });
        }

        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            // If key is one of the target arrays, apply update if it exists
            if (arrayKeys.includes(key) && Array.isArray(obj[key])) {
              newObj[key] = updateNestedField(obj[key], targetIndex, fieldName);
            } else {
              newObj[key] = obj[key];
            }
          }
          return newObj;
        }

        return obj;
      };

      for (let i = 1; i <= data.savedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(
            data[formKey],
            index,
            fieldName
          );
        }
      }
      setIsModalOpen(false);
      await updateDoc(docRef, updatedData);
      toast.success(`Successfully updated status for ${fieldName}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Error updating status: ${error.message}`);
    }
  };
  const handleApprove = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Array of keys that we want to check for updates
      const arrayKeys = [
        "previousAddresses",
        "EmploymentHistory",
        "accidentRecords",
        "trafficConvictions",
        "driverExperience",
        "driverLicensePermit",
        "educationHistory",
        "extraSkills",
        "violationRecords",
        "AlcoholDrugTest",
        "onDutyHours",
        "compensatedWork",
      ];

      const updateNestedField = (obj, targetIndex, fieldName) => {
        if (Array.isArray(obj)) {
          return obj.map((item, index) => {
            // Check if the array item has the specific field to update

            if (index === targetIndex && item.hasOwnProperty(fieldName)) {
              return {
                ...item,
                [fieldName]: {
                  ...item[fieldName],
                  status: "approved",
                  note: "",
                },
              };
            }
            return item;
          });
        }

        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            // If key is one of the target arrays, apply update if it exists
            if (arrayKeys.includes(key) && Array.isArray(obj[key])) {
              newObj[key] = updateNestedField(obj[key], targetIndex, fieldName);
            } else {
              newObj[key] = obj[key];
            }
          }
          return newObj;
        }

        return obj;
      };

      for (let i = 1; i <= data.savedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(
            data[formKey],
            index,
            fieldName
          );
        }
      }

      await updateDoc(docRef, updatedData);
      toast.success(`Successfully updated status for ${fieldName}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  const handleReject = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Array of keys that we want to check for updates
      const arrayKeys = [
        "previousAddresses",
        "EmploymentHistory",
        "accidentRecords",
        "trafficConvictions",
        "driverExperience",
        "driverLicensePermit",
        "educationHistory",
        "extraSkills",
        "violationRecords",
        "AlcoholDrugTest",
        "onDutyHours",
        "compensatedWork",
      ];

      const updateNestedField = (obj, targetIndex, fieldName) => {
        if (Array.isArray(obj)) {
          return obj.map((item, index) => {
            // Check if the array item has the specific field to update

            if (index === targetIndex && item.hasOwnProperty(fieldName)) {
              return {
                ...item,
                [fieldName]: {
                  ...item[fieldName],
                  status: "rejected",
                  note: "",
                },
              };
            }
            return item;
          });
        }

        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            // If key is one of the target arrays, apply update if it exists
            if (arrayKeys.includes(key) && Array.isArray(obj[key])) {
              newObj[key] = updateNestedField(obj[key], targetIndex, fieldName);
            } else {
              newObj[key] = obj[key];
            }
          }
          return newObj;
        }

        return obj;
      };

      for (let i = 1; i <= data.savedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(
            data[formKey],
            index,
            fieldName
          );
        }
      }

      await updateDoc(docRef, updatedData);
      toast.success(`Successfully updated status for ${fieldName}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-row flex-wrap justify-between smd:justify-start items-center gap-x-2 gap-y-2 mb-1 w-full">
      <label
        htmlFor={`${id}-${index}`}
        className=" smd:w-max text-[16px] font-inter font-semibold text-gray-900 font-radios "
      >
        {label}
        {important ? "" : "*"}
      </label>
      <div className={`flex flex-row gap-x-2 smd:w-auto `}>
        {/* Logic for showing icons and notes based on status and user type */}
        {status === "pending" ? (
          <>
            {currentUser.userType === "Admin" && (
              <>
                <div className="w-full smd:w-max flex items-center flex-row gap-x-3 relative">
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center text-xl text-black cursor-pointer z-10"
                    onClick={handleToggleDropdown}
                  >
                    <FaPencil size={16} />
                  </div>

                  {showDropdown && (
                    <div
                      className="absolute top-8 smd:left-0 right-10 z-20 bg-white border border-gray-300 shadow-lg rounded-md py-2 w-60"
                      ref={dropdownRef}
                    >
                      <ul className="flex flex-col">
                        <li
                          className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-150"
                          onClick={() => {
                            handleApprove();
                            setShowDropdown(false);
                          }}
                        >
                          <div className="hover:bg-green-500 text-green-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                            <FaRegCheckCircle size={20} />
                          </div>
                          <span className="text-sm font-medium">
                            Approve Field
                          </span>
                        </li>
                        <li
                          className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-150"
                          onClick={() => {
                            handleReject();
                            setShowDropdown(false);
                          }}
                        >
                          <div className="hover:bg-red-500 text-red-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                            <FaRegTimesCircle size={20} />
                          </div>
                          <span className="text-sm font-medium">
                            Reject Field
                          </span>
                        </li>
                        <li
                          className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-150"
                          onClick={() => {
                            note === "" ? handleAddNote() : handleViewNote();
                            setShowDropdown(false);
                          }}
                        >
                          <div className="hover:bg-black text-black transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                            <MdNoteAlt size={20} />
                          </div>
                          <span className="text-sm font-medium">
                            {note ? "View Note" : "Add Note"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {note === "" ? (
                  <div className="relative z-50">
                    <dialog
                      open={isModalOpen}
                      className="modal w-[60%] md:w-[30%] fixed mx-auto my-auto inset-0"
                    >
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => {
                          setShowDropdown(false);
                          setIsModalOpen(false);
                        }} // Close modal when clicking the overlay
                      ></div>
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4 flex flex-col gap-y-6 z-50 relative">
                        <div className="flex flex-col gap-y-6 w-full">
                          <h3 className="font-bold text-lg">Add Note</h3>
                          {/* Textarea with onChange event */}
                          <textarea
                            className="textarea textarea-bordered w-full h-28 resize-none rounded-xl px-3 py-3 border-1 border-gray-400"
                            placeholder="Add note"
                            value={notes} // Bind textarea value to the state
                            onChange={handleTextareaChange} // Update state on change
                          ></textarea>
                        </div>

                        <div className="modal-action">
                          <form
                            method="dialog"
                            className="flex flex-row gap-x-3"
                          >
                            {/* Save button triggers handleSave */}
                            <button
                              type="button"
                              onClick={handleSave}
                              className="btn bg-green-500 text-white rounded-xl px-6 py-2.5"
                            >
                              Save
                            </button>
                            <button
                              type="button" // Prevents the default form submission
                              className="btn bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
                              onClick={() => setIsModalOpen(false)} // Close modal on click
                            >
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  <div className="relative z-50">
                    <dialog
                      open={isModalOpen}
                      className="modal w-[60%] md:w-[30%] fixed mx-auto my-auto inset-0 z-50"
                    >
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsModalOpen(false)} // Close modal when clicking the overlay
                      ></div>
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4 z-50 relative">
                        <h3 className="font-bold text-lg">View Note</h3>
                        <p className="py-4">
                          {existingNote ? existingNote : "No note added"}
                        </p>
                        <div className="modal-action">
                          <button
                            type="button" // Prevents the default form submission
                            className="btn bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
                            onClick={() => setIsModalOpen(false)} // Close modal on click
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </dialog>
                  </div>
                )}
              </>
            )}
          </>
        ) : currentUser.userType === "Admin" ? (
          // Admin User Logic for rejected or approved statuses
          <div className="w-full smd:w-max">
            {status === "rejected" && (
              <div className="flex flex-row flex-wrap items-center gap-x-2 w-full smd:w-max">
                <div className="flex flex-row gap-x-3 items-center w-full smd:w-max">
                  <div className="relative">
                    <FaPencil
                      className="text-black cursor-pointer z-10"
                      onClick={handleDropdownToggle}
                    />
                    {isDropdownOpen && (
                      <div
                        className="absolute top-8 z-50 smd:left-0 right-10 bg-white border border-gray-300 shadow-lg rounded-md py-2 w-60"
                        ref={dropdownRef}
                      >
                        <ul className="flex flex-col z-50">
                          <li
                            className="flex flex-row text-gray-300 gap-x-2 items-center px-4 rounded-xl cursor-pointer"
                            onClick={() => {}}
                          >
                            <div className=" text-gray-300 transition-all duration-200 ease-in-out p-3 rounded-full">
                              <FaRegTimesCircle size={20} />
                            </div>
                            Field Rejected
                          </li>
                          <li
                            className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer"
                            onClick={handleApproveApplication}
                          >
                            <div className="hover:bg-green-500 text-green-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                              <FaRegCheckCircle size={20} />
                            </div>
                            Approve Field
                          </li>

                          <li
                            className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer"
                            onClick={
                              note === "" ? handleAddNote : handleViewNote
                            }
                          >
                            <div className="hover:bg-black text-black transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                              <MdNoteAlt size={20} />
                            </div>
                            {note ? "View note" : "Add note"}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {note ? (
                  <div className="relative z-50">
                    <dialog
                      open={isModalOpen}
                      className="modal w-[60%] md:w-[30%] fixed mx-auto my-auto inset-0 z-50"
                    >
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsModalOpen(false)} // Close modal when clicking the overlay
                      ></div>
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4 z-50 relative">
                        <h3 className="font-bold text-lg">View Note</h3>
                        <p className="py-4">
                          {existingNote ? existingNote : "No note added"}
                        </p>
                        <div className="modal-action">
                          <button
                            type="button" // Prevents the default form submission
                            className="btn bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
                            onClick={() => setIsModalOpen(false)} // Close modal on click
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  <div className="relative z-50">
                    <dialog
                      open={isModalOpen}
                      className="modal w-[60%] md:w-[30%] fixed mx-auto my-auto inset-0 "
                    >
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsModalOpen(false)} // Close modal when clicking the overlay
                      ></div>
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4 flex flex-col gap-y-6 z-50 relative">
                        <div className="flex flex-col gap-y-6 w-full">
                          <h3 className="font-bold text-lg">Add Note</h3>
                          {/* Textarea with onChange event */}
                          <textarea
                            className="textarea textarea-bordered w-full h-28 resize-none rounded-xl px-3 py-3 border-1 border-gray-400"
                            placeholder="Add note"
                            value={notes} // Bind textarea value to the state
                            onChange={handleTextareaChange} // Update state on change
                          ></textarea>
                        </div>

                        <div className="modal-action">
                          <form
                            method="dialog"
                            className="flex flex-row gap-x-3"
                          >
                            {/* Save button triggers handleSave */}
                            <button
                              type="button"
                              onClick={handleSave}
                              className="btn bg-green-500 text-white rounded-xl px-6 py-2.5"
                            >
                              Save
                            </button>
                            <button
                              type="button" // Prevents the default form submission
                              className="btn bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
                              onClick={() => setIsModalOpen(false)} // Close modal on click
                            >
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                )}
              </div>
            )}
            {status === "approved" && (
              <div className="w-full flex items-center justify-end gap-x-3 smd:w-max">
                <div className="relative ">
                  <FaPencil
                    className="text-black cursor-pointer z-10"
                    onClick={handleDropdownToggle} // Toggle dropdown on click
                  />
                  {isDropdownOpen && (
                    <div
                      className="absolute top-8 bg-white smd:left-0 right-10 border border-gray-300 z-50 shadow-lg rounded-md py-2 w-60"
                      ref={dropdownRef}
                    >
                      <ul className="flex flex-col z-50">
                        <li className="flex flex-row text-gray-300 gap-x-2 z-20 items-center px-4 rounded-xl ">
                          <div className=" text-gray-300 transition-all duration-200 ease-in-out p-3 rounded-full">
                            <FaRegCheckCircle size={20} />
                          </div>
                          Field Approved
                        </li>
                        <li
                          className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer"
                          onClick={handleRejectApplication}
                        >
                          <div className="hover:bg-red-500 text-red-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                            <FaRegTimesCircle size={20} />
                          </div>
                          Reject Field
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Non-Admin User Logic
          <>
            {status === "rejected" && (
              <div className="flex flex-row flex-wrap items-center gap-x-2 w-full smd:w-max">
                <div className="flex flex-row gap-x-3 w-full items-center smd:w-max">
                  <div className="flex  justify-end">
                    <FaRegTimesCircle className="text-red-500 cursor-pointer" />
                  </div>
                  {note ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={handleViewNote}
                    >
                      <MdNoteAlt size={10} />

                      <p className="text-xs font-radios">View note</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {note ? (
                    <div className="relative z-50">
                      <dialog
                        open={isModalOpen}
                        className="modal w-[60%] md:w-[30%] fixed mx-auto my-auto inset-0 z-50"
                      >
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 z-10"
                          onClick={() => setIsModalOpen(false)} // Close modal when clicking the overlay
                        ></div>
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4 z-50 relative">
                          <h3 className="font-bold text-lg">View Note</h3>
                          <p className="py-4">
                            {existingNote ? existingNote : "No note added"}
                          </p>
                          <div className="modal-action">
                            <button
                              type="button" // Prevents the default form submission
                              className="btn bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
                              onClick={() => setIsModalOpen(false)} // Close modal on click
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {status === "approved" && (
              <div className="flex justify-end">
                <FaRegCheckCircle className="text-green-500 cursor-pointer" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default FormLabelWithStatus;
