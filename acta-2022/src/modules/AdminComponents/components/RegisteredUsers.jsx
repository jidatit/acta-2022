import { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";

const RegisteredUsers = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      name: "Hassan Ali Iqbal",
      status: "Pending",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 2,
      name: "Hassan Ali Iqbal",
      status: "Approved",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 3,
      name: "Hassan Ali Iqbal",
      status: "Declined",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 4,
      name: "Hassan Ali Iqbal",
      status: "Future Lead",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 5,
      name: "Hassan Ali Iqbal",
      status: "Need Review",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    // More rows can be added here...
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store the selected user for deletion

  // Function to handle status change
  const handleStatusChange = (id, newStatus) => {
    const updatedData = tableData.map((row) =>
      row.id === id ? { ...row, status: newStatus } : row
    );
    setTableData(updatedData);
  };

  // Function to determine status background color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400";
      case "Approved":
        return "bg-green-400";
      case "Declined":
        return "bg-red-400";
      case "Future Lead":
        return "bg-blue-400";
      case "Need Review":
        return "bg-orange-400";
      default:
        return "bg-gray-200";
    }
  };

  // Function to select a row via checkbox
  const handleSelectRow = (id) => {
    console.log(`Row ${id} selected`);
  };

  // Function to handle delete click
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true); // Show the modal
  };

  // Function to confirm delete
  const handleConfirmDelete = () => {
    setTableData((prevData) =>
      prevData.filter((user) => user.id !== selectedUser.id)
    );
    setShowDeleteModal(false); // Close the modal
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Registered Users</h1>
        <MdOutlineDeleteOutline
          size={30}
          className="cursor-pointer"
          onClick={() => handleDeleteClick(selectedUser)}
        />
      </div>

      <table className="min-w-full border-1 rounded-t-md font-radios">
        <thead className="bg-gray-200 ">
          <tr>
            <th className="border p-2 text-left"></th>
            <th className="border p-2 text-left">Driver Name</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Time</th>
            <th className="border p-2 text-left">Application</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100 ">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={() => handleSelectRow(row.id)}
                />
              </td>
              <td className=" px-2 py-3">{row.name}</td>
              <td className=" px-2 py-3">
                <select
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  className={`p-2 rounded ${getStatusColor(row.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                  <option value="Future Lead">Future Lead</option>
                  <option value="Need Review">Need Review</option>
                </select>
              </td>
              <td className=" px-2 py-3">{row.date}</td>
              <td className=" px-2 py-3">{row.time}</td>
              <td className=" px-2 py-3">
                <button className="bg-blue-500 text-white py-1 px-3 rounded mr-2">
                  View
                </button>
                <button className="bg-blue-500 text-white py-1 px-3 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-40 min-h-full w-full overflow-y-auto overflow-x-hidden transition flex items-center">
          {/* overlay */}
          <div
            aria-hidden="true"
            className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
            onClick={() => setShowDeleteModal(false)} // Close the modal when clicking outside
          ></div>
          {/* Modal */}
          <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
            <div className="w-full py-2 bg-white cursor-default pointer-events-auto relative rounded-xl mx-auto max-w-xl">
              <button
                tabIndex={-1}
                type="button"
                className="absolute top-2 right-2"
                onClick={() => setShowDeleteModal(false)} // Close the modal
              >
                <svg
                  title="Close"
                  tabIndex={-1}
                  className="h-4 w-4 cursor-pointer text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="space-y-2 p-2">
                <div className="p-4 space-y-6 text-center ">
                  <p className="text-black text-xl font-radios">
                    Are you sure you want to delete this driver?
                  </p>
                  <h2
                    className="text-lg text-gray-500 tracking-tight"
                    id="page-action.heading"
                  >
                    "Delete Hassan Iqbal"
                  </h2>
                </div>
              </div>
              <div className="space-y-2">
                <div aria-hidden="true" className=" px-2" />
                <div className="px-6 py-2">
                  <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center py-3 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50"
                      onClick={() => setShowDeleteModal(false)} // Close on cancel
                    >
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center py-3 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset min-h-[2.25rem] px-4 text-sm text-white bg-[#0086D9] border-transparent hover:bg-[#1c5f88]"
                      onClick={handleConfirmDelete} // Confirm delete action
                    >
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
