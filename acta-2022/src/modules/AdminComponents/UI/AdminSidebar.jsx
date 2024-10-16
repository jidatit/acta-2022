import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../../index.css";
import { useAuth } from "../../../AuthContext";
// import image from "../../../images/pngwing.com.png";
// import { useAuth } from "../../../AuthContext";
// import { BsThreeDotsVertical } from "react-icons/bs";
const AdminSidebar = ({ isSidebarExpanded }) => {
  const [activeItem, setActiveItem] = useState("RegisteredDrivers");
  const { handleLogout } = useAuth();
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);
  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  // const handleEdit = () => {
  //   //console.log("edit item");
  // };
  const handleLogoutClick = () => {
    handleLogout();
  };
  return (
    <div
      className={`z-50 h-full w-full overflow-y-hidden bg-blue-[#0086D9] ${
        !isSidebarExpanded ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex flex-col items-start justify-start w-full h-full px-5 py-3 gap-y-4 smd:gap-y-4">
        <div className="flex w-full">
          <h1 className="w-full p-2 smd:px-3 smd:py-2 text-lg smd:text-2xl font-bold text-black bg-white rounded-lg">
            Logo
          </h1>
        </div>
        {/* <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row justify-between w-full">
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="inline-flex w-full md:items-center md:justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white hover:text-black font-semibold hover:bg-gray-50"
              >
                <BsThreeDotsVertical className="w-5 h-5" />
              </button>

  
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a
                      href="#"
                      onClick={handleEdit}
                      className="block px-4 py-2 text-sm text-gray-700 font-radios hover:bg-gray-100"
                    >
                      Edit
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      onClick={handleLogoutClick}
                      className="block px-4 py-2 text-sm text-gray-700 font-radios hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </div>
                  <div>
                    <Link
                      to="/TruckDriverLayout/ChangePassword"
                      className="block px-4 py-2 text-sm text-gray-700 font-radios hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}
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
              to=""
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
          {/* second portion of sidebar */}
          <div className="flex flex-col w-full gap-y-1">
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "CompanyName"
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("CompanyName")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "CompanyName" ? "text-blue-800" : "text-white"
                }`}
              >
                Company Name
              </p>
            </Link>
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "PhoneNumber "
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("PhoneNumber ")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "PhoneNumber " ? "text-blue-800" : "text-white"
                }`}
              >
                Phone Number
              </p>
            </Link>
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "Address "
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("Address ")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "Address " ? "text-blue-800" : "text-white"
                }`}
              >
                Address
              </p>
            </Link>
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "Fax "
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("Fax ")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "Fax " ? "text-blue-800" : "text-white"
                }`}
              >
                Fax
              </p>
            </Link>
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "www.website.com "
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("www.website.com ")}
            >
              <p
                className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "www.website.com "
                    ? "text-blue-800"
                    : "text-white"
                }`}
              >
                www.website.com
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
