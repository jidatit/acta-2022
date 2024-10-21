import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../index.css";
import { useAuth } from "../../../AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Camera } from "lucide-react";

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
          <div className="flex flex-col gap-y-1">
            {/* Display Company Information */}
            {companyInfo && (
              <div className="flex flex-col gap-y-1">
                <p
                  className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Name: {companyInfo.companyName || "N/A"}
                </p>
                <p
                  className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Phone: {companyInfo.phoneNumber || "N/A"}
                </p>
                <p
                  className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Address: {companyInfo.address || "N/A"}
                </p>
                <p
                  className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 text-white`}
                >
                  Fax: {companyInfo.fax || "www.Acta.com"}
                </p>
              </div>
            )}
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "Logout"
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => {
                handleItemClick("Logout");
                handleLogoutClick();
              }}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "Logout" ? "text-blue-800" : "text-white"
                }`}
              >
                Logout
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
