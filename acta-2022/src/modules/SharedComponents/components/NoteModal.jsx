import { useState } from "react";

const NoteModal = ({ existingNote }) => {
  return (
    <>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-lg">View Note </h3>
          <p className="py-4">
            {existingNote ? existingNote : "No note addedsss"}
          </p>
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
  );
};

export default NoteModal;
