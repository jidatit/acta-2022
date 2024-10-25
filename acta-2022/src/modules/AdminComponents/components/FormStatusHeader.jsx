import React from "react";
import { X } from "lucide-react";

const FormStatusHeader = ({ formData, applicationStatus }) => {
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
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filledCount = getFilledFormsCount();

  return (
    <div className="smd:ml-4 flex flex-wrap items-center gap-2">
      <span className="bg-blue-500 text-white text-xs font-medium px-3.5 py-2.5 rounded-full">
        {filledCount}/9 Forms Filled
      </span>

      {applicationStatus && (
        <span
          className={`${getStatusColor(
            applicationStatus
          )} text-white text-xs font-medium px-3.5 py-2.5 rounded-full`}
        >
          Status: {applicationStatus}
        </span>
      )}
    </div>
  );
};

export default FormStatusHeader;
