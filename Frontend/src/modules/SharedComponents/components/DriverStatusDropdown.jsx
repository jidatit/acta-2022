const DriverStatusDropdown = ({ email, currentStatus, onStatusChange }) => {
  // Status options and their corresponding colors
  const statusOptions = {
    Pending: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
    Approved: "bg-green-100 hover:bg-green-200 text-green-800",
    Declined: "bg-red-100 hover:bg-red-200 text-red-800",
    "Future Lead": "bg-blue-100 hover:bg-blue-200 text-blue-800",
    "Need Review": "bg-purple-100 hover:bg-purple-200 text-purple-800",
  };

  // Handle the status change
  const handleChange = (e) => {
    onStatusChange(email, e.target.value);
  };

  return (
    <select
      value={currentStatus || "Pending"}
      onChange={handleChange}
      className={`p-2 rounded border transition-colors duration-200 cursor-pointer 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   ${statusOptions[currentStatus || "Pending"]}`}
    >
      {Object.keys(statusOptions).map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default DriverStatusDropdown;
