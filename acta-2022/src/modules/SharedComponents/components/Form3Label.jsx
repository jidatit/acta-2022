import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext";
const FormLabelWithStatus = ({ label, id, status, note, index }) => {
  const { currentUser } = useAuth();
  return (
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
            // Non-admin logic
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
  );
};
export default FormLabelWithStatus;
