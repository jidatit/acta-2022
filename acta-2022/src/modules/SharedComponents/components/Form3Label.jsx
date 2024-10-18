import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useState } from "react";
const FormLabelWithStatus = ({
  label,
  id,
  status,
  note,
  index,
  fieldName,
  uid,
}) => {
  const { currentUser } = useAuth();
  const [existingNote, setExistingNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const getNoteForField = async (uid, fieldName) => {
    try {
      let docRef;
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

      // Recursive function to search for the field and get its note
      const findFieldNote = (obj) => {
        // Base case: if we find the field we're looking for
        if (obj && obj[fieldName] && obj[fieldName].note !== undefined) {
          return obj[fieldName].note;
        }

        // If it's an array, search through it
        if (Array.isArray(obj)) {
          for (const item of obj) {
            if (typeof item === "object" && item !== null) {
              const found = findFieldNote(item);
              if (found !== null) return found;
            }
          }
        }

        // If it's an object, recursively search each value
        if (obj && typeof obj === "object") {
          for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
              const found = findFieldNote(obj[key]);
              if (found !== null) return found;
            }
          }
        }

        return null;
      };

      // Process each form until we find the note
      for (let i = 1; i <= data.completedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          const note = findFieldNote(data[formKey]);
          if (note !== null) {
            return note;
          }
        }
      }

      // If no note was found
      return "";
    } catch (error) {
      console.error("Error retrieving note:", error);
      toast.error(`Error retrieving note: ${error.message}`);
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

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Recursive function to search and update nested fields
      const updateNestedField = (obj) => {
        // Base case: if we find the field we're looking for
        if (obj && obj[fieldName]) {
          return {
            ...obj,
            [fieldName]: {
              ...obj[fieldName],
              note: notes,
            },
          };
        }

        // If it's an array, map through it
        if (Array.isArray(obj)) {
          return obj.map((item) =>
            typeof item === "object" ? updateNestedField(item) : item
          );
        }

        // If it's an object, recursively search each value
        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            newObj[key] =
              typeof obj[key] === "object"
                ? updateNestedField(obj[key])
                : obj[key];
          }
          return newObj;
        }

        return obj;
      };

      // Process each form
      for (let i = 1; i <= data.completedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(data[formKey]);
        }
      }
      // Update the document in Firebase
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
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Recursive function to search and update nested fields
      const updateNestedField = (obj) => {
        // Base case: if we find the field we're looking for
        if (obj && obj[fieldName]) {
          return {
            ...obj,
            [fieldName]: {
              ...obj[fieldName],
              status: "approved",
            },
          };
        }

        // If it's an array, map through it
        if (Array.isArray(obj)) {
          return obj.map((item) =>
            typeof item === "object" ? updateNestedField(item) : item
          );
        }

        // If it's an object, recursively search each value
        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            newObj[key] =
              typeof obj[key] === "object"
                ? updateNestedField(obj[key])
                : obj[key];
          }
          return newObj;
        }

        return obj;
      };

      // Process each form
      for (let i = 1; i <= data.completedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(data[formKey]);
        }
      }

      // Update the document in Firebase
      await updateDoc(docRef, updatedData);
      toast.success(`Successfully updated status for ${fieldName}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Error updating status: ${error.message}`);
    }
  };
  const handleReject = async () => {
    try {
      // Get the document reference for the specific user
      const docRef = doc(db, "truck_driver_applications", uid);

      // Get the current document data
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Document does not exist!");
        return;
      }

      const data = docSnap.data();
      const updatedData = { ...data };

      // Recursive function to search and update nested fields
      const updateNestedField = (obj) => {
        // Base case: if we find the field we're looking for
        if (obj && obj[fieldName]) {
          return {
            ...obj,
            [fieldName]: {
              ...obj[fieldName],
              status: "rejected",
            },
          };
        }

        // If it's an array, map through it
        if (Array.isArray(obj)) {
          return obj.map((item) =>
            typeof item === "object" ? updateNestedField(item) : item
          );
        }

        // If it's an object, recursively search each value
        if (obj && typeof obj === "object") {
          const newObj = {};
          for (const key in obj) {
            newObj[key] =
              typeof obj[key] === "object"
                ? updateNestedField(obj[key])
                : obj[key];
          }
          return newObj;
        }

        return obj;
      };

      // Process each form
      for (let i = 1; i <= data.completedForms; i++) {
        const formKey = `form${i}`;
        if (data[formKey]) {
          updatedData[formKey] = updateNestedField(data[formKey]);
        }
      }

      // Update the document in Firebase
      await updateDoc(docRef, updatedData);
      toast.success(`Successfully updated status for ${fieldName}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Error updating status: ${error.message}`);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-2 mb-1 w-full">
      <label
        htmlFor={`${id}-${index}`}
        className="block text-sm font-semibold text-gray-900 font-radios"
      >
        {label}*
      </label>
      <div className="flex flex-row items-center gap-x-2">
        {/* Logic for showing icons and notes based on status and user type */}
        {status === "pending" ? (
          <>
            {currentUser.userType === "Admin" && (
              <>
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
              <div className="flex flex-row gap-x-1">
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
              <FaRegCheckCircle className="text-green-500 cursor-pointer" />
            )}
          </>
        ) : (
          // Non-Admin User Logic
          <>
            {status === "rejected" && (
              <div className="flex flex-row gap-x-1">
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
export default FormLabelWithStatus;
