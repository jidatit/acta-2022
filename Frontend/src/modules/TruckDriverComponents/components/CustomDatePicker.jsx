import * as React from "react";
import dayjs from "dayjs"; // Import dayjs to handle date conversions
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const CustomDatePicker = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  error,
  errorMessage,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="mb-6">
        <DatePicker
          label={label}
          value={value ? dayjs(value) : null} // Ensure the value is a Dayjs object
          onChange={(newValue) => {
            onChange(newValue ? newValue.toISOString() : ""); // Convert Dayjs to ISO string
          }}
          minDate={minDate ? dayjs(minDate) : undefined} // Convert minDate if provided
          maxDate={maxDate ? dayjs(maxDate) : undefined} // Convert maxDate if provided
          disabled={disabled}
          renderInput={(params) => (
            <div className="w-full">
              <input
                {...params.inputProps}
                className={`w-full p-2 mt-1 border rounded-md ${
                  error ? "border-red-500 border-2" : "border-gray-300"
                } ${disabled ? "text-gray-400" : "bg-white"}`}
              />
              {error && (
                <p className="mt-1 text-[15px] font-radios text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </LocalizationProvider>
  );
};
