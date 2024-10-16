import React from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext"; // Adjust the path as needed

const IndexLabelLogic = ({
  label,
  id,
  name,
  value,
  status,
  note,
  handleChange,
  index,
}) => {
  const { currentUser } = useAuth(); // Get current user from context
  const initialFields = [
    {
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
    },
  ];

  return (
    <div>
      <div className="flex flex-row items-center gap-x-3 mb-1">
        <label
          htmlFor={`${id}-${index}`}
          className="block text-sm font-semibold text-gray-900 font-radios"
        >
          {label}*
        </label>
        <div className="flex flex-row items-center gap-x-2">
          <div className="flex flex-row gap-x-1">
            {status === "pending" && currentUser.userType === "Admin" && (
              <>
                <FaRegCheckCircle className="text-green-500" />
                <FaRegTimesCircle className="text-red-500" />
                <div
                  className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                  onClick={() =>
                    document.getElementById(`modal-${id}-${index}`).showModal()
                  }
                >
                  <FaPencil size={10} />
                  <p className="text-xs font-radios">Add note</p>
                </div>
                <dialog id={`modal-${id}-${index}`} className="modal">
                  <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-bold text-lg">{label} Note</h3>
                    <p className="py-4">{note ? note : "No note added"}</p>
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                          Close
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </>
            )}
            {currentUser.userType === "Admin" ? (
              status === "rejected" ? (
                <FaRegTimesCircle className="text-red-500" />
              ) : status === "approved" ? (
                <FaRegCheckCircle className="text-green-500" />
              ) : null
            ) : (
              // Non-Admin logic
              <>
                {status === "rejected" && (
                  <FaRegTimesCircle className="text-red-500" />
                )}
                {status === "approved" && (
                  <FaRegCheckCircle className="text-green-500" />
                )}
              </>
            )}
          </div>
          {status === "rejected" && currentUser.userType === "Admin" && (
            <div
              className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
              onClick={() =>
                document.getElementById(`modal-${id}-${index}`).showModal()
              }
            >
              <FaPencil size={10} />
              <p className="text-xs font-radios">Add note</p>
              <dialog id={`modal-${id}-${index}`} className="modal">
                <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                  <h3 className="font-bold text-lg">{label} Note</h3>
                  <p className="py-4">{note ? note : "No note added"}</p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          )}
        </div>
      </div>
      <input
        type="text"
        name={name}
        id={`${id}-${index}`}
        value={value}
        onChange={(e) => handleChange(e, index)}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default IndexLabelLogic;
