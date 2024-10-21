import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { toast } from "react-toastify";

// Assuming `currentUser.userType` is passed as a prop to the component
const SingleLabelLogic = ({
  htmlFor,
  labelName,
  status,
  note,
  fieldName,
  uid,
}) => {
  const { currentUser } = useAuth();
  const [existingNote, setExistingNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
  const dropdownRef = useRef(null); // Ref for the dropdown
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
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleRejectApplication = () => {
    handleReject();
    setIsDropdownOpen(false); // Close dropdown after action
  };
  const handleApproveApplication = () => {
    handleApprove();
    setIsDropdownOpen(false); // Close dropdown after action
  };
  const handleViewNote = async () => {
    const existingNotes = await getNoteForField(uid, fieldName);
    console.log("Existing Notes:", existingNotes);
    setExistingNote(existingNotes);
    setIsModalOpen(true); // Show modal through state
  };
  console.log("existingNote", existingNote);
  const handleAddNote = () => {
    setIsModalOpen(true); // Show modal through state
  };
  const [notes, setNote] = useState("");

  // Step 2: Update state on textarea change
  const handleTextareaChange = (e) => {
    setNote(e.target.value);
  };
  const getNoteForField = async () => {
    try {
      let docRef;
      if (currentUser.userType === "Admin") {
        docRef = doc(db, "truck_driver_applications", uid);
      } else {
        docRef = doc(db, "truck_driver_applications", currentUser.uid);
      }

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Iterate through forms to find the field
        for (let i = 1; i <= data.completedForms; i++) {
          const formKey = `form${i}`;

          if (data[formKey]) {
            const formData = data[formKey];

            // Check if fieldName exists directly in this form
            if (formData[fieldName]) {
              return formData[fieldName].note;
            }

            // Check nested fields
            for (const key of Object.keys(formData)) {
              if (
                typeof formData[key] === "object" &&
                formData[key] !== null &&
                formData[key][fieldName]
              ) {
                return formData[key][fieldName].note;
              }
            }
          }
        }
      }
      return ""; // Return empty string if no note found
    } catch (error) {
      console.error("Error retrieving note:", error);
      toast.error("Failed to retrieve note");
      return "";
    }
  };

  // Step 3: Save the note value on Save button click
  const handleSave = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Create an object to store the updated forms
        const updatedData = { ...data };

        // Iterate through forms (form1, form2, etc.)
        for (let i = 1; i <= data.completedForms; i++) {
          const formKey = `form${i}`;

          if (data[formKey]) {
            const formData = data[formKey];

            // Handle `form1` structure (non-nested fields)
            if (i === 1) {
              if (formData[fieldName]) {
                updatedData[formKey] = {
                  ...formData,
                  [fieldName]: {
                    ...formData[fieldName],
                    note: notes, // or "rejected"
                  },
                };
                break; // Exit loop once we've found and updated the field
              }
            } else {
              // Handle `form2` and other forms (nested fields)
              Object.keys(formData).forEach((key) => {
                const nestedField = formData[key];

                // Check if the field is nested inside objects or arrays
                if (Array.isArray(nestedField)) {
                  nestedField.forEach((nestedItem, index) => {
                    if (nestedItem[fieldName]) {
                      updatedData[formKey][key][index] = {
                        ...nestedItem,
                        [fieldName]: {
                          ...nestedItem[fieldName],
                          note: notes, // or "rejected"
                        },
                      };
                    }
                  });
                } else if (
                  typeof nestedField === "object" &&
                  nestedField[fieldName]
                ) {
                  updatedData[formKey] = {
                    ...formData,
                    [key]: {
                      ...nestedField,
                      [fieldName]: {
                        ...nestedField[fieldName],
                        note: notes, // or "rejected"
                      },
                    },
                  };
                }
              });
            }
          }
        }

        // Update the document in Firebase
        await updateDoc(docRef, updatedData);
        setIsModalOpen(false);
        toast.success(`Successfully updated status for ${fieldName}`);
      } else {
        toast.error("Document does not exist!");
      }
    } catch (error) {
      toast.error("Error updating status:", error);
    }
  };

  const handleApprove = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Create an object to store the updated forms
        const updatedData = { ...data };

        // Iterate through forms (form1, form2, etc.)
        for (let i = 1; i <= data.completedForms; i++) {
          const formKey = `form${i}`;

          if (data[formKey]) {
            const formData = data[formKey];

            // Handle `form1` structure (non-nested fields)
            if (i === 1) {
              if (formData[fieldName]) {
                updatedData[formKey] = {
                  ...formData,
                  [fieldName]: {
                    ...formData[fieldName],
                    status: "approved", // or "rejected"
                  },
                };
                break; // Exit loop once we've found and updated the field
              }
            } else {
              // Handle `form2` and other forms (nested fields)
              Object.keys(formData).forEach((key) => {
                const nestedField = formData[key];

                // Check if the field is nested inside objects or arrays
                if (Array.isArray(nestedField)) {
                  nestedField.forEach((nestedItem, index) => {
                    if (nestedItem[fieldName]) {
                      updatedData[formKey][key][index] = {
                        ...nestedItem,
                        [fieldName]: {
                          ...nestedItem[fieldName],
                          status: "approved", // or "rejected"
                        },
                      };
                    }
                  });
                } else if (
                  typeof nestedField === "object" &&
                  nestedField[fieldName]
                ) {
                  updatedData[formKey] = {
                    ...formData,
                    [key]: {
                      ...nestedField,
                      [fieldName]: {
                        ...nestedField[fieldName],
                        status: "approved", // or "rejected"
                      },
                    },
                  };
                }
              });
            }
          }
        }

        // Update the document in Firebase
        await updateDoc(docRef, updatedData);

        toast.success(`Successfully updated status for ${fieldName}`);
      } else {
        toast.error("Document does not exist!");
      }
    } catch (error) {
      toast.error("Error updating status:", error);
    }
  };
  const handleReject = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Create an object to store the updated forms
        const updatedData = { ...data };

        // Iterate through forms (form1, form2, etc.)
        for (let i = 1; i <= data.completedForms; i++) {
          const formKey = `form${i}`;

          if (data[formKey]) {
            const formData = data[formKey];

            // Handle `form1` structure (non-nested fields)
            if (i === 1) {
              if (formData[fieldName]) {
                updatedData[formKey] = {
                  ...formData,
                  [fieldName]: {
                    ...formData[fieldName],
                    status: "rejected", // or "rejected"
                  },
                };
                break; // Exit loop once we've found and updated the field
              }
            } else {
              // Handle `form2` and other forms (nested fields)
              Object.keys(formData).forEach((key) => {
                const nestedField = formData[key];

                // Check if the field is nested inside objects or arrays
                if (Array.isArray(nestedField)) {
                  nestedField.forEach((nestedItem, index) => {
                    if (nestedItem[fieldName]) {
                      updatedData[formKey][key][index] = {
                        ...nestedItem,
                        [fieldName]: {
                          ...nestedItem[fieldName],
                          status: "rejected", // or "rejected"
                        },
                      };
                    }
                  });
                } else if (
                  typeof nestedField === "object" &&
                  nestedField[fieldName]
                ) {
                  updatedData[formKey] = {
                    ...formData,
                    [key]: {
                      ...nestedField,
                      [fieldName]: {
                        ...nestedField[fieldName],
                        status: "rejected", // or "rejected"
                      },
                    },
                  };
                }
              });
            }
          }
        }

        // Update the document in Firebase
        await updateDoc(docRef, updatedData);

        toast.success(`Successfully updated status for ${fieldName}`);
      } else {
        toast.error("Document does not exist!");
      }
    } catch (error) {
      toast.error("Error updating status:", error);
    }
  };
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-2 mb-1 w-full ">
      <label
        htmlFor={htmlFor}
        className={` text-sm w-max font-semibold text-gray-900 font-radios `}
      >
        {labelName}*
      </label>
      <div className={`flex flex-row gap-x-2 `}>
        {/* Logic for showing icons and notes based on status and user type */}
        {status === "pending" ? (
          <>
            {currentUser.userType === "Admin" && (
              <>
                <div className="w-max flex items-center flex-row gap-x-3">
                  <FaRegCheckCircle
                    className="text-green-500 cursor-pointer"
                    onClick={handleApprove}
                  />
                  <FaRegTimesCircle
                    className="text-red-500 cursor-pointer"
                    onClick={handleReject}
                  />
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={note === "" ? handleAddNote : handleViewNote}
                  >
                    <FaPencil size={10} />
                    {note ? (
                      <p className="text-xs font-radios">View note</p>
                    ) : (
                      <p className="text-xs font-radios">Add note</p>
                    )}
                  </div>
                </div>
                {note === "" ? (
                  <dialog
                    open={isModalOpen}
                    className="modal w-[30%] fixed mx-auto my-auto inset-0"
                  >
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                        <form method="dialog" className="flex flex-row gap-x-3">
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
                ) : (
                  <dialog
                    open={isModalOpen}
                    className="modal w-[30%] fixed mx-auto my-auto inset-0"
                  >
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                )}
              </>
            )}
          </>
        ) : currentUser.userType === "Admin" ? (
          // Admin User Logic for rejected or approved statuses
          <>
            {status === "rejected" && (
              <div className="flex flex-row items-center gap-x-2 w-max ">
                <div className="flex flex-row gap-x-3 items-center">
                  <FaRegTimesCircle className="text-red-500 cursor-pointer" />

                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={note === "" ? handleAddNote : handleViewNote}
                  >
                    <FaPencil size={10} />
                    {note ? (
                      <p className="text-xs font-radios">View note</p>
                    ) : (
                      <p className="text-xs font-radios">Add note</p>
                    )}
                  </div>
                  <div className="relative">
                    <FaPencil
                      className="text-blue-500 cursor-pointer"
                      onClick={handleDropdownToggle} // Toggle dropdown on click
                    />
                    {isDropdownOpen && (
                      <div
                        className="absolute top-8 bg-white border border-gray-300 shadow-lg rounded-md py-2 w-60 z-50 "
                        ref={dropdownRef}
                      >
                        <ul className="flex flex-col">
                          <li
                            className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer "
                            onClick={handleApproveApplication}
                          >
                            <div className="hover:bg-green-500 text-green-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                              <FaRegCheckCircle size={20} className="" />
                            </div>
                            Approve Application
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {note ? (
                  <dialog
                    open={isModalOpen}
                    className="modal w-[30%] fixed mx-auto my-auto inset-0"
                  >
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                ) : (
                  <dialog
                    open={isModalOpen}
                    className="modal w-[30%] fixed mx-auto my-auto inset-0"
                  >
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                        <form method="dialog" className="flex flex-row gap-x-3">
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
                )}
              </div>
            )}
            {status === "approved" && (
              <div className="flex flex-row gap-x-3 w-max">
                <FaRegCheckCircle className="text-green-500 cursor-pointer" />
                <div className="relative">
                  <FaPencil
                    className="text-blue-500 cursor-pointer"
                    onClick={handleDropdownToggle} // Toggle dropdown on click
                  />
                  {isDropdownOpen && (
                    <div
                      className="absolute top-8 bg-white border border-gray-300 shadow-lg rounded-md py-2 w-60 z-50"
                      ref={dropdownRef}
                    >
                      <ul className="flex flex-col">
                        <li
                          className="flex flex-row gap-x-2 items-center px-4 rounded-xl cursor-pointer "
                          onClick={handleRejectApplication}
                        >
                          <div className="hover:bg-red-500 text-red-500 transition-all duration-200 ease-in-out hover:text-white p-3 rounded-full">
                            <FaRegTimesCircle size={20} className="" />
                          </div>
                          Reject Application
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Non-Admin User Logic
          <>
            {status === "rejected" && (
              <div className="flex flex-row flex-wrap items-center gap-x-2 w-max">
                <div className="flex flex-row gap-x-3 w-max">
                  <FaRegTimesCircle className="text-red-500 cursor-pointer" />
                  {note ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={handleViewNote}
                    >
                      <FaPencil size={10} />

                      <p className="text-xs font-radios">View note</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {note ? (
                  <dialog
                    open={isModalOpen}
                    className="modal w-[30%] fixed mx-auto my-auto inset-0"
                  >
                    {/* Background overlay */}
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
                      onClick={() => setIsModalOpen(false)} // Close modal when clicking the overlay
                    ></div>

                    <div className="modal-box bg-white rounded-xl shadow-lg p-4 flex flex-col justify-center items-center z-50 relative">
                      <h3 className="font-bold text-lg">Note</h3>
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
                ) : (
                  ""
                )}
              </div>
            )}
            {status === "approved" && (
              <FaRegCheckCircle className="text-green-500 cursor-pointer" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleLabelLogic;
