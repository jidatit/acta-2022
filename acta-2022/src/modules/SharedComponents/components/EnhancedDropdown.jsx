import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const EnhancedStatusDropdown = ({
  initialStatus,
  options,
  onStatusChange,
  getStatusColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update local state when initialStatus changes
  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status); // Update local state
    onStatusChange(status); // Call parent handler
    setIsOpen(false);
  };

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  return (
    <>
      <div
        className="inline-flex w-full md:w-[80%] items-center space-x-2"
        ref={triggerRef}
      >
        <h3
          className={`px-3 py-2 text-white w-full rounded-md text-sm font-medium ${getStatusColor(
            selectedStatus
          )}`}
        >
          {selectedStatus}
        </h3>
        <button
          type="button"
          className="inline-flex justify-center items-center p-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
      {isOpen &&
        createPortal(
          <div
            className="fixed z-50 mt-2 w-56 -ml-14 smd:-ml-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
            ref={dropdownRef}
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option}
                  className={`${
                    selectedStatus === option
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-900"
                  } group flex items-center w-full px-4 py-2 text-sm hover:bg-blue-400 transition-colors duration-150`}
                  onClick={() => handleStatusChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EnhancedStatusDropdown;
