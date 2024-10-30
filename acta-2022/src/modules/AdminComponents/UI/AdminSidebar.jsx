import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../index.css";
import { useAuth } from "../../../AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Camera, LogOutIcon } from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AdminSidebar = ({ isSidebarExpanded }) => {
  const [activeItem, setActiveItem] = useState("RegisteredDrivers");
  const { handleLogout } = useAuth();
  const [companyInfo, setCompanyInfo] = useState(null); // State for company info
  const [logoPreview, setLogoPreview] = useState(null);
  // Fetch company info from Firestore
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyCollection = collection(db, "companyInfo");
      const companySnapshot = await getDocs(companyCollection);
      const companyData = companySnapshot.docs.map((doc) => doc.data());

      if (companyData.length > 0) {
        setCompanyInfo(companyData[0]); // Assuming you want the first document
        setLogoPreview(companyData[0].logoUrl);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleLogoutClick = () => {
    handleLogout();
  };
  const [openDialog, setOpenDialog] = useState(false);

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
    <div
      className={`z-50 h-full w-full overflow-y-hidden bg-blue-[#0086D9] ${
        !isSidebarExpanded ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex flex-col items-start justify-between w-full h-full px-5 py-3 gap-y-4 smd:gap-y-4">
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
                <span className="mt-2 text-sm text-gray-500">Upload Logo</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between w-full h-full mt-4">
          <div className="flex flex-col w-full gap-y-4">
            <Link
              to={"/AdminLayout/users"}
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "RegisteredDrivers"
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("RegisteredDrivers")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "RegisteredDrivers"
                    ? "text-blue-800"
                    : "text-white"
                }`}
              >
                Registered Drivers
              </p>
            </Link>
            <Link
              to={"/AdminLayout/companyInfo"}
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "CompanyInformation"
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("CompanyInformation")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "CompanyInformation"
                    ? "text-blue-800"
                    : "text-white"
                }`}
              >
                Company Information
              </p>
            </Link>
          </div>
          <div className="flex flex-col gap-y-1  mb-16 lg:mb-0">
            {/* Display Company Information */}
            {/* {companyInfo && (
              <div className="flex flex-col gap-y-1">
                <p
                  className={`w-full px-3 py-2 lg:p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Name: {companyInfo.companyName || "N/A"}
                </p>
                <p
                  className={`w-full px-3 py-2 lg:p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Phone: {companyInfo.phoneNumber || "N/A"}
                </p>
                <p
                  className={`w-full px-3 py-2 lg:p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Address: {companyInfo.address || "N/A"}
                </p>
                <p
                  className={`w-full px-3 py-2 lg:p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Fax: {companyInfo.fax || "www.Acta.com"}
                </p>
              </div>
            )} */}
            <>
              <Link
                to=""
                className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                  activeItem === "Logout"
                    ? "bg-white rounded-md shadow-lg"
                    : "hover:bg-white rounded-md hover:text-blue-900"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick("Logout");
                  handleDialogOpen();
                }}
              >
                <div
                  className={`w-full p-3 rounded-md font-radios flex items-center gap-2 hover:bg-white hover:text-blue-900 ${
                    activeItem === "Logout" ? "text-blue-800" : "text-white"
                  }`}
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </Link>

              <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                PaperProps={{
                  style: {
                    borderRadius: "12px",
                    padding: "8px",
                    maxWidth: "600px",
                    width: "90%",
                  },
                }}
              >
                <DialogTitle
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1e3a8a",
                    paddingBottom: "8px",
                  }}
                >
                  Confirm Logout
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    style={{
                      color: "#4b5563",
                      fontSize: "1rem",
                      marginBottom: "8px",
                    }}
                  >
                    Are you sure you want to logout? This will end your current
                    session.
                  </DialogContentText>
                </DialogContent>
                <DialogActions
                  style={{
                    padding: "16px",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={handleDialogClose}
                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </DialogActions>
              </Dialog>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
