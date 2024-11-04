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
        await auth.currentUser.reload(); // Reload the user to get updated email verification status
        localStorage.setItem("isEmailVerified", "true");
        toast.success("Email verified successfully!");

        // Wait for Firebase to update and then redirect
        setTimeout(() => {
          navigate("/TruckDriverLayout/ApplicationForm1", { replace: true });
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error verifying email:", error);
        toast.error("Failed to verify email. Please try again.");
        navigate("/signIn", { replace: true });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, auth, navigate, currentUser, isEmailVerified]);

  return (
    <div className="flex items-center justify-center min-h-screen w-[90%] sssm:w-[80%] md:w-[56%] lg:w-[40%] bg-gradient-to-br p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        {isVerifying ? (
          <>
            <h1 className="text-2xl font-bold bg-red-500 py-3 px-4 rounded-xl shadow-md text-white mb-4">
              Email Verifying.....
            </h1>
            <p className="text-black text-[17px] mb-6 font-radios">
              We are verifying Your Email Please wait for a while until it got
              verified.....
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold bg-green-500 py-3 px-4 rounded-xl shadow-md text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-black text-[17px] mb-6 font-radios">
              Your email has been successfully verified. Now We are Proceeding
              you to the Your Dashboard in a Second ......
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default EmailVerifiedScreen;
