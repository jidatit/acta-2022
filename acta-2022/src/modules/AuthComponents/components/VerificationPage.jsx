import { useNavigate } from "react-router";
import { useAuth } from "../../../AuthContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../SharedUiComponents/Loader";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { verifyEmail, isEmailVerified, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const handleRefresh = async () => {
    window.location.reload();
  };

  useEffect(() => {
    if (currentUser) {
      //console.log(currentUser);
      setLoading(false);
      if (isEmailVerified) {
        //console.log("emailVerified");

        if (currentUser.userType === "TruckDriver") {
          toast.success("redirecting to TruckDriver dashboard");
          setTimeout(() => {
            navigate("/TruckDriverLayout/ApplicationForm1");
          }, 3000);
        }
      } else {
        //console.log("email not Verified");
      }
    }
  }, []);
  if (loading) {
    return <Loader />; // Show loader while loading
  }
  return (
    <div className="flex flex-col justify-center items-center w-screen bg-[#3B82F6] h-screen">
      <div className="relative flex flex-col items-center justify-center h-auto p-12 py-6 bg-white rounded-lg shadow-lg overfslow-hidden sm:py-12">
        <div className="max-w-xl px-5 text-center">
          <h1 className="w-full text-xl text-center text-black">
            Acta Website
          </h1>
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Check your inbox
          </h2>
          <p className="mb-2 text-lg text-zinc-500">
            We are glad, that you’re with us ? We’ve sent you a verification
            link to the email address{" "}
            <span className="font-medium text-indigo-500">
              {currentUser.email}
            </span>
          </p>
          <button
            className="inline-block px-5 py-3 mt-3 font-medium text-white bg-indigo-600 rounded shadow-md w-96 shadow-indigo-500/20 hover:bg-indigo-700"
            onClick={handleRefresh}
          >
            Refresh Page →
          </button>
          <button
            className="inline-block px-5 py-3 mt-3 font-medium text-white bg-green-600 rounded shadow-md w-96 shadow-indigo-500/20 hover:bg-green-700"
            onClick={verifyEmail}
          >
            Resend Verification Email
          </button>
          <button className="inline-block px-5 py-3 mt-3 font-medium text-white bg-red-600 rounded shadow-md w-96 shadow-red-500/20 hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
