import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import FormLabelWithStatus from "../../SharedComponents/components/Form3Label";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { styled } from "@mui/material";

const StyledStaticDatePicker = styled(StaticDatePicker)({
  ".MuiPickersToolbar-root": {
    color: "#f8bbd0",
    borderRadius: "2px",
    borderWidth: "1px",
    borderColor: "#e91e63",
    border: "1px solid",
    backgroundColor: "#880e4f",
  },
  ".MuiPaper-root": {
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    width: "100%",
  },
});
export const DatePickerField = ({
  isDisabled,
  value,
  onChange,
  maxDate,
  minDate,
  errors,
  index,
  fieldName,
  label,
  status,
  note,
  uid,
}) => {
  return (
    <div className="w-full">
      <FormLabelWithStatus
        label={label}
        id={fieldName}
        status={status}
        note={note}
        index={index}
        fieldName={fieldName}
        uid={uid}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className={`mt-1 ${
            errors?.[index]?.[fieldName]
              ? "border-2 border-red-500 rounded-sm"
              : ""
          }`}
        >
          <StyledStaticDatePicker
            disabled={isDisabled}
            value={value ? dayjs(value) : null}
            onChange={(newValue) =>
              onChange(index, fieldName, newValue?.toISOString())
            }
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            minDate={minDate ? dayjs(minDate) : undefined}
            slotProps={{
              actionBar: {
                actions: ["today", "cancel", "accept"],
              },
            }}
          />
        </div>
      </LocalizationProvider>

      {errors?.[index]?.[fieldName] && (
        <p className="mt-1 text-sm text-red-500">{errors[index][fieldName]}</p>
      )}
    </div>
  );
};
