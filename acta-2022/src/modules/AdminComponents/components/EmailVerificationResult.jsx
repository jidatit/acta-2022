import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../AuthContext";
import { applyActionCode, getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Camera } from "lucide-react";

const EmailVerifiedScreen = () => {
  const navigate = useNavigate();
  const { currentUser, isEmailVerified } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [searchParams] = useSearchParams();
  const auth = getAuth();
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyCollection = collection(db, "companyInfo");
      const companySnapshot = await getDocs(companyCollection);
      const companyData = companySnapshot.docs.map((doc) => doc.data());

      if (companyData.length > 0) {
        setCompanyInfo(companyData[0]);
        setLogoPreview(companyData[0].logoUrl);
      }
    };

    fetchCompanyInfo();
  }, []);
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
        }, 3000);
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
    <div className="flex flex-col bg-white items-center justify-center w-[90%] sssm:w-[80%] md:w-[56%] lg:w-[40%] bg-gradient-to-br p-4">
      <div className="w-full mt-4 p-2 smd:px-3 flex items-center justify-center smd:py-2 text-lg smd:text-2xl font-bold text-black rounded-lg">
        {logoPreview ? (
          <img
            src={logoPreview}
            alt="Company logo preview"
            className="w-16 h-16 text-center rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Camera className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Logo</span>
          </div>
        )}
      </div>
      <div className=" shadow-lg rounded-lg p-8 w-full text-center">
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
