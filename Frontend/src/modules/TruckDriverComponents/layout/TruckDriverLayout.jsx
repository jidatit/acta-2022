import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import SideBar from "../../SharedUiComponents/SideBar";
import { useAuth } from "../../../AuthContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TruckDriverLayout = () => {
  const navigate = useNavigate();
  const { isEmailVerified, currentUser } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  // useEffect(() => {
  //   // Check both current auth state and user type
  //   if (!currentUser || !isEmailVerified) {
  //     navigate("/signIn", { replace: true });
  //     return;
  //   }

  //   if (currentUser.userType !== "TruckDriver") {
  //     navigate("/signIn", { replace: true });
  //   }
  // }, [currentUser, isEmailVerified, navigate]);

  // Rest of your component remains the same...

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
      {isEmailVerified ? (
        <div className="flex flex-row w-screen bg-white overflow-x-hidden">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarExpanded
                ? "ssm:w-[47%] smd:w-[35%] w-[58%]"
                : "w-[14%] ssm:w-[10%] flex items-start justify-center"
            } md:w-[25%] xxl:w-[19%] bg-black h-[100vh] z-30 transition-all overflow-hidden duration-300 ease-in-out fixed `}
          >
            <div className="flex items-center justify-between p-4 md:hidden">
              <button
                onClick={toggleSidebar}
                className="text-white smd:text-xl"
              >
                <GiHamburgerMenu />
              </button>
            </div>
            {/* Only show the sidebar content when expanded or on md and larger screens */}
            {(isSidebarExpanded || !isSmallScreen) && (
              <SideBar isSidebarExpanded={isSidebarExpanded} />
            )}
          </div>

          {/* Main Content Area */}
          <div
            className={`flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden ${
              isSidebarExpanded
                ? ""
                : "xxl:ml-[20%] lg:ml-[25%] md:ml-[30%] ssm:ml-[10%] ml-[12%]"
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
      ) : (
        navigate("/signIn")
      )}
      <ToastContainer />
    </>
  );
};

export default TruckDriverLayout;
