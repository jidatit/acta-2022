import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useAuth } from "../../../AuthContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../UI/AdminSidebar";

const AdminLayout = () => {
  const { isEmailVerified } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Use useEffect for navigate()
  // useEffect(() => {
  //   if (!isEmailVerified) {
  //     navigate("/signIn");
  //   }
  // }, [isEmailVerified, navigate]);

  return (
    <>
      <div className="flex flex-row w-screen bg-white overflow-x-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarExpanded
              ? "ssm:w-[45%] smd:w-[28%] w-[58%]"
              : "w-[8%] ssm:w-[6%] flex items-start justify-center"
          } md:w-[25%] xxl:w-[19%] bg-blue-500 h-[100vh] z-30 transition-all overflow-hidden duration-300 ease-in-out fixed `}
        >
          <div className="flex items-center justify-between p-4 md:hidden">
            <button onClick={toggleSidebar} className="text-white smd:text-xl">
              <GiHamburgerMenu />
            </button>
          </div>
          {/* Only show the sidebar content when expanded or on md and larger screens */}
          {(isSidebarExpanded || !isSmallScreen) && (
            <AdminSidebar isSidebarExpanded={isSidebarExpanded} />
          )}
        </div>

        {/* Main Content Area */}
        <div
          className={`flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden ${
            isSidebarExpanded
              ? ""
              : "xxl:ml-[20%] lg:ml-[25%] md:ml-[26%] ml-[5%]"
          } w-full transition-all h-auto duration-300 ease-in-out`}
        >
          <div className="flex-grow w-full p-6">
            {/* Forms/Content */}
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default AdminLayout;
