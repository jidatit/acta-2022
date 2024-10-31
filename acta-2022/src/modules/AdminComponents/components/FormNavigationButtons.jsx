const FormNavigationButtons = ({
  currentFormIndex,
  handleBack,
  handleClick,
  handleNext,
  handleApplicationStatus,
  isLastForm,
  isSubmitting,
  isNextEnabled,
}) => {
  // Special layout for Form 9
  if (currentFormIndex === 8) {
    // Index 8 corresponds to Form 9
    return (
      <div className="flex flex-col w-full gap-y-4">
        {/* Top buttons */}
        <div className="flex flex-col gap-y-2 w-full">
          <button
            onClick={handleBack}
            disabled={currentFormIndex === 0}
            className={`w-full px-4 py-2 rounded ${
              currentFormIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Back
          </button>

          <button
            type="submit"
            onClick={handleClick}
            className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
          >
            Save
          </button>
        </div>

        {/* Bottom buttons */}
        {isLastForm ? (
          <div className="flex flex-col gap-y-2 w-full">
            <button
              type="button"
              onClick={() => handleApplicationStatus("rejected")}
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Reject Application
            </button>
            <button
              type="button"
              onClick={() => handleApplicationStatus("approved")}
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Approve Application
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isNextEnabled()}
            className={`w-full px-4 py-2 rounded ${
              !isNextEnabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        )}
      </div>
    );
  }

  // Default layout for all other forms
  return (
    <div className="flex flex-row justify-between items-center w-full gap-x-2 md:-mt-4">
      {/* Left - Back Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleBack}
          disabled={currentFormIndex === 0}
          className={`px-4 py-2 rounded ${
            currentFormIndex === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Back
        </button>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex gap-x-2">
        <button
          type="submit"
          onClick={handleClick}
          className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
        >
          Save
        </button>

        {isLastForm ? (
          <>
            <button
              type="button"
              onClick={() => handleApplicationStatus("rejected")}
              disabled={isSubmitting}
              className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Reject Application
            </button>
            <button
              type="button"
              onClick={() => handleApplicationStatus("approved")}
              disabled={isSubmitting}
              className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Approve Application
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isNextEnabled()}
            className={`px-4 py-2 rounded ${
              !isNextEnabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormNavigationButtons;
