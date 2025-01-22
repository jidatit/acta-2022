import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FormLabelWithStatus from "../../SharedComponents/components/Form3Label";

const DatePickerForm = ({
  field,
  index,
  isDisabled,
  errors,
  handleInputChange,
  currentUser,
  uid,
}) => {
  const handleDateChange = (fieldName, newValue) => {
    const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : "";
    handleInputChange(index, {
      target: {
        name: fieldName,
        value: formattedDate,
      },
    });
  };

  const renderDatePicker = (fieldName, label) => {
    return (
      <>
        <FormLabelWithStatus
          label={label}
          id={fieldName}
          status={field[fieldName]?.status}
          note={field[fieldName]?.note}
          index={index}
          fieldName={fieldName}
          uid={uid}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={
              field[fieldName]?.value ? dayjs(field[fieldName].value) : null
            }
            onChange={(newValue) => handleDateChange(fieldName, newValue)}
            disabled={isDisabled}
            className={`w-full ${
              errors[index]?.[fieldName] ? "border-red-500 border-2" : ""
            }`}
            slotProps={{
              textField: {
                size: "small",
                error: !!errors[index]?.[fieldName],
                className: `w-full ${
                  isDisabled ? "text-gray-400" : "bg-white border-gray-300"
                }`,
              },
            }}
          />
        </LocalizationProvider>
      </>
    );
  };

  return (
    <div className="flex smd:flex-row flex-col gap-y-4 gap-x-10 w-full">
      {renderDatePicker("day1", "Day 1 (yesterday)")}
      {renderDatePicker("day2", "Day 2")}
      {renderDatePicker("day3", "Day 3")}
      {renderDatePicker("day4", "Day 4")}
      {renderDatePicker("day5", "Day 5")}
      {renderDatePicker("day6", "Day 6")}
      {renderDatePicker("day7", "Day 7")}
    </div>
  );
};

export default DatePickerForm;
