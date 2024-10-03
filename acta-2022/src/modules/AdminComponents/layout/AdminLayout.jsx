import "../../../index.css"
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../UI/AdminSidebar";
import { Outlet } from "react-router";

const AdminLayout = () => {
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

  return (
    <>
      <div className="flex flex-row w-full bg-white">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarExpanded
              ? "ssm:w-[37%] smd:w-[25%] w-[58%]"
              : "w-[14%] ssm:w-[8%]"
          } md:w-[25%] xxl:w-[19%] bg-[#2257e7] h-screen fixed overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between p-4 md:hidden">
            <button onClick={toggleSidebar} className="text-white">
              <GiHamburgerMenu size={24} />
            </button>
          </div>
          {/* Only show the sidebar content when expanded or on md and larger screens */}
          {(isSidebarExpanded || !isSmallScreen) && (
            <AdminSidebar isSidebarExpanded={isSidebarExpanded} />
          )}
        </div>

        {/* Scrollable Outlet */}
        <div
          className={`w-[95%] ${
            isSidebarExpanded ? "md:ml-[25%] ml-[25%]" : "ml-[12%]"
          } md:w-[99%] md:ml-[22%] xxl:w-[85%] xxl:ml-[15%] flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-center flex-grow w-full py-10">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminLayout;
