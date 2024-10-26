import { useState, useRef, useEffect } from "react";
import { FaRegCheckCircle, FaRegTimesCircle, FaPencil } from "react-icons/fa";

const NoteModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        style={{ zIndex: 40 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-xl shadow-lg p-4 w-[30%] mx-auto"
        style={{ zIndex: 50 }}
      >
        {children}
      </div>
    </div>
  );
};

const FormField = ({
  labelName,
  htmlFor,
  status,
  currentUser,
  note: existingNote,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [note, setNote] = useState(existingNote || "");
  const dropdownRef = useRef(null);

  const handleAddNote = () => setIsModalOpen(true);
  const handleViewNote = () => setIsModalOpen(true);
  const handleTextareaChange = (e) => setNotes(e.target.value);
  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSave = () => {
    setNote(notes);
    setIsModalOpen(false);
  };

  const AddNoteContent = (
    <div className="flex flex-col gap-y-6 w-full">
      <h3 className="font-bold text-lg">Add Note</h3>
      <textarea
        className="textarea textarea-bordered w-full h-28 resize-none rounded-xl px-3 py-3 border border-gray-400"
        placeholder="Add note"
        value={notes}
        onChange={handleTextareaChange}
      />
      <div className="flex flex-row gap-x-3 justify-end">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white rounded-xl px-6 py-2.5"
        >
          Save
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
        >
          Close
        </button>
      </div>
    </div>
  );

  const ViewNoteContent = (
    <div className="flex flex-col gap-y-4">
      <h3 className="font-bold text-lg">View Note</h3>
      <p className="py-4">{note || "No note added"}</p>
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-gray-700 rounded-xl px-6 py-2.5"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-row flex-wrap justify-between smd:justify-start items-center gap-x-2 gap-y-2 mb-1 w-full">
      <label
        htmlFor={htmlFor}
        className="text-[16px] font-inter smd:w-max font-semibold text-gray-900"
      >
        {labelName}*
      </label>

      <div className="flex flex-row gap-x-2 smd:w-auto flex-shrink-0 justify-end relative">
        {status === "pending" && currentUser.userType === "Admin" && (
          <div className="flex items-center gap-x-3">
            <FaRegCheckCircle className="text-green-500 cursor-pointer" />
            <FaRegTimesCircle className="text-red-500 cursor-pointer" />
            <div
              className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border border-gray-400 cursor-pointer"
              onClick={note ? handleViewNote : handleAddNote}
            >
              <FaPencil size={10} />
              <p className="text-xs">{note ? "View note" : "Add note"}</p>
            </div>
          </div>
        )}

        {/* Status-specific content */}
        {status !== "pending" && currentUser.userType === "Admin" && (
          <div className="flex items-center gap-x-3">
            {status === "rejected" ? (
              <FaRegTimesCircle className="text-red-500" />
            ) : (
              <FaRegCheckCircle className="text-green-500" />
            )}

            <div className="relative">
              <FaPencil
                className="text-blue-500 cursor-pointer"
                onClick={handleDropdownToggle}
              />
              {isDropdownOpen && (
                <div className="absolute top-8 right-0 bg-white border border-gray-300 shadow-lg rounded-md py-2 w-60">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {status === "rejected" ? "Approve Field" : "Reject Field"}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {note ? ViewNoteContent : AddNoteContent}
        </NoteModal>
      </div>
    </div>
  );
};

export default FormField;
