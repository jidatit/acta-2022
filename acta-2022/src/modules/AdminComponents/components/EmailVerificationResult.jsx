// ./src/components/EmailVerifiedScreen.js
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../AuthContext";
import { applyActionCode, getAuth } from "firebase/auth";

const EmailVerifiedScreen = () => {
  const navigate = useNavigate();
  const { currentUser, isEmailVerified } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  const [searchParams] = useSearchParams();
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = searchParams.get("oobCode");

      if (!actionCode) {
        toast.error("Invalid verification link.");
        setIsVerifying(false);
        return;
      }

      try {
        await applyActionCode(auth, actionCode);
        toast.success("Email verified successfully!");
        // setTimeout(() => {
        //   navigate("/user_portal", { replace: true });
        //   window.location.reload(); // This forces a refresh after navigation
        // }, 2000);
      } catch (error) {
        console.error("Error verifying email:", error);
        toast.error("Failed to verify email. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, auth, navigate]);

  const handleLoginRedirect = () => {
    if (currentUser) {
      //console.log(currentUser);

      if (isEmailVerified) {
        //console.log("emailVerified");

        if (currentUser.userType === "TruckDriver") {
          toast.success("redirecting to TruckDriver dashboard");
          setTimeout(() => {
            navigate("/TruckDriverLayout/ApplicationForm1");
          }, 3000);
        }
      } else {
        toast.error("email not Verified");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-[90%] sssm:w-[80%] md:w-[56%] lg:w-[40%] bg-gradient-to-br p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Email Verified!
        </h1>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now proceed to log
          in by clicking on below button and access your account.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-green-500 text-white font-semibold px-6 py-2 rounded-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmailVerifiedScreen;
