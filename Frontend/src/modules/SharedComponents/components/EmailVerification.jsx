import React, { useState } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get the current Firebase Auth user

  const verifyEmail = async () => {
    // Check if user exists
    if (!currentUser) {
      toast.error("No user is currently signed in");
      return;
    }

    // Check if email is already verified
    if (currentUser.emailVerified) {
      toast.info("Your email is already verified");
      return;
    }

    // Implement cooldown to prevent spam (2 minutes)
    const now = Date.now();
    const cooldownPeriod = 2 * 60 * 1000; // 2 minutes in milliseconds

    if (now - lastSentTime < cooldownPeriod) {
      const remainingTime = Math.ceil(
        (cooldownPeriod - (now - lastSentTime)) / 1000
      );
      toast.warning(
        `Please wait ${remainingTime} seconds before requesting another verification email`
      );
      return;
    }

    setIsLoading(true);

    try {
      const actionCodeSettings = {
        url: window.location.origin + "/login", // Replace with your desired redirect URL
        handleCodeInApp: true,
      };

      await sendEmailVerification(currentUser, actionCodeSettings);
      setLastSentTime(Date.now());
      toast.success(
        "Verification email sent successfully! Please check your inbox and spam folder."
      );
    } catch (error) {
      console.error("Verification error:", error);

      // Handle specific error codes
      switch (error.code) {
        case "auth/too-many-requests":
          toast.error("Too many requests. Please try again later.");
          break;
        case "auth/internal-error":
          toast.error("An internal error occurred. Please try again later.");
          break;
        case "auth/invalid-email":
          toast.error("The email address is invalid.");
          break;
        case "auth/user-not-found":
          toast.error("User not found. Please sign in again.");
          break;
        default:
          toast.error(`Failed to send verification email: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If no user is signed in, don't render the button
  if (!currentUser) {
    return null;
  }

  return (
    <button
      className={`inline-block px-5 py-3 mt-3 font-medium text-white rounded shadow-md w-96 shadow-indigo-500/20 
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      onClick={verifyEmail}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-3 -ml-1 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Sending...
        </span>
      ) : (
        "Resend Verification Email"
      )}
    </button>
  );
};

export default EmailVerification;
