import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../AuthContext";

// Assuming `currentUser.userType` is passed as a prop to the component
const SingleLabelLogic = ({ htmlFor, labelName, status, note }) => {
  const { currentUser } = useAuth();
  const handleViewNote = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="flex flex-row items-center gap-x-3 mb-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-900 font-radios"
      >
        {labelName}*
      </label>
      <div className="flex flex-row items-center gap-x-2">
        {/* Logic for showing icons and notes based on status and user type */}
        {status === "pending" ? (
          <>
            {currentUser.userType === "Admin" && (
              <>
                <FaRegCheckCircle className="text-green-500" />
                <FaRegTimesCircle className="text-red-500" />
                <div
                  className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                  onClick={handleViewNote}
                >
                  <FaPencil size={10} />
                  <p className="text-xs font-radios">Add note</p>
                </div>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-bold text-lg">Note</h3>
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
          </>
        ) : currentUser.userType === "Admin" ? (
          // Admin User Logic for rejected or approved statuses
          <>
            {status === "rejected" && (
              <div className="flex flex-row gap-x-1">
                <FaRegTimesCircle className="text-red-500" />
                <div
                  className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                  onClick={handleViewNote}
                >
                  <FaPencil size={10} />
                  <p className="text-xs font-radios">Add note</p>
                </div>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-bold text-lg">Note</h3>
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
            {status === "approved" && (
              <FaRegCheckCircle className="text-green-500" />
            )}
          </>
        ) : (
          // Non-Admin User Logic
          <>
            {status === "rejected" && (
              <div className="flex flex-row gap-x-1">
                <FaRegTimesCircle className="text-red-500" />
                <div
                  className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                  onClick={handleViewNote}
                >
                  <FaPencil size={10} />
                  <p className="text-xs font-radios">View note</p>
                </div>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                    <h3 className="font-bold text-lg">Note</h3>
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
            {status === "approved" && (
              <FaRegCheckCircle className="text-green-500" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleLabelLogic;
