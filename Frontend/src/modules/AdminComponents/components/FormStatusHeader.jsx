import React from "react";
import { X } from "lucide-react";

const FormStatusHeader = ({ formData, applicationStatus, driverStatus }) => {
  // Count filled forms by checking for form data presence
  const getFilledFormsCount = () => {
    let count = 0;
    for (let i = 1; i <= 9; i++) {
      if (
        formData[`form${i}`] &&
        Object.keys(formData[`form${i}`]).length > 0
      ) {
        count++;
      }
    }
    return count;
  };

  // Get status color based on application status

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400";
      case "approved":
        return "bg-green-400";
      case "rejected":
        return "bg-red-400";
      case "filled":
        return "bg-blue-400";
      case "registered":
        return "bg-orange-400";
      default:
        return "bg-gray-200";
    }
  };

  const filledCount = getFilledFormsCount();

  return (
    <div className="smd:ml-4 flex flex-wrap items-center gap-2">
      <span className="bg-black text-white text-xs font-medium px-3.5 py-2.5 rounded-full">
        {filledCount}/9 Forms Filled
      </span>

      {driverStatus && (
        <span
          className={`${getStatusColor(
            driverStatus
          )} text-white text-xs font-medium px-3.5 py-2.5 rounded-full`}
        >
          Status: {driverStatus}
        </span>
      )}
    </div>
  );
};

export default FormStatusHeader;
