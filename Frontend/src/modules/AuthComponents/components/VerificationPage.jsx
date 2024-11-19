import { useNavigate } from "react-router";
import { useAuth } from "../../../AuthContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../SharedUiComponents/Loader";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { sendEmailVerification } from "firebase/auth";
import EmailVerification from "../../SharedComponents/components/EmailVerification";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { db } from "../../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { isEmailVerified, currentUser, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const handleRefresh = async () => {
    window.location.reload();
  };

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
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleDialogClose();
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen bg-[#3B82F6] h-screen">
      <div className="relative flex flex-col items-center justify-center h-auto p-12 py-6 bg-white rounded-lg shadow-lg overflow-hidden sm:py-12">
        <div className="max-w-xl px-5 text-center">
          <div className="flex w-full">
            <div className="w-full p-2 smd:px-3 flex items-center justify-center smd:py-2 text-lg smd:text-2xl font-bold text-black bg-white rounded-lg">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-16 h-16 text-center rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Upload Logo
                  </span>
                </div>
              )}
            </div>
          </div>
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
          <EmailVerification currentUser={currentUser} />
          <Link to={"/signUp"}>
            <button className="inline-block px-5 py-3 mt-3 font-medium text-white bg-red-600 rounded shadow-md w-96 shadow-red-500/20 hover:bg-red-700">
              Back to SignUp →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
