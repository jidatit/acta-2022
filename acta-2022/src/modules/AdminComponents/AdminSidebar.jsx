import { useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import image from "../../images/pngwing.com.png";
import { useAuth } from "../../AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
const AdminSidebar = ({ isSidebarExpanded }) => {
  const [activeItem, setActiveItem] = useState("JobApplication");
  const { currentUser, handleLogout } = useAuth();
  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const handleEdit = () => {
    console.log("edit item");
  };

  return (
    <div
      className={`bg-[#2257e7] h-full w-full ${
        !isSidebarExpanded ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex flex-col items-center justify-start w-full h-full px-5 py-3 gap-y-10">
        <div className="flex w-full">
          <h1 className="w-full p-3 text-2xl font-bold text-black bg-white rounded-lg">
            Logo
          </h1>
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex w-full gap-x-2 ">
            <img
              src={image}
              alt="..."
              className="object-cover w-10 h-10 rounded-full"
            />
            <div className="flex flex-col items-start justify-center ">
              <p className="text-[14px] text-white font-radios">
                {currentUser ? currentUser.firstName : "Guest"}
              </p>
              <p className="text-[12px] text-white font-radios">
                {"Welcome Back"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white hover:text-black font-semibold hover:bg-gray-50">
                  <BsThreeDotsVertical
                    aria-hidden="true"
                    className="w-5 h-5 "
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-blue-800 font-radios "
                      onClick={handleEdit}
                    >
                      Edit
                    </a>
                  </MenuItem>
                </div>
                <div className="">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-blue-800 font-radios "
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>

            {/* <FaBell size={20} className="text-gray-500 cursor-pointer" /> */}
          </div>
        </div>
        <div className="flex flex-col w-full gap-y-4">
          <Link
            to=""
            className={`w-full transition-all duration-300 ease-in-out rounded-md ${
              activeItem === "JobApplication"
                ? "bg-white rounded-md shadow-lg"
                : "hover:bg-white rounded-md hover:text-blue-900"
            }`}
            onClick={() => handleItemClick("JobApplication")}
          >
            <p
              className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                activeItem === "JobApplication" ? "text-blue-800" : "text-white"
              }`}
            >
              Job Application
            </p>
          </Link>
          {/* <Link
            to="users"
            className={`w-full transition-all duration-300 ease-in-out rounded-md ${
              activeItem === "Users"
                ? "bg-white rounded-md shadow-lg"
                : "hover:bg-white rounded-md hover:text-blue-900"
            }`}
            onClick={() => handleItemClick("Users")}
          >
            <p
              className={`w-full p-3 rounded-md font-radios hover:bg-white hover:text-blue-900 ${
                activeItem === "Users" ? "text-blue-800" : "text-white"
              }`}
            >
              Users
            </p>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
