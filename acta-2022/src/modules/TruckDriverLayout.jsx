import { Outlet, useNavigate } from "react-router";
import SideBar from "./SideBar";
import { useAuth } from "../AuthContext";

const TruckDriverLayout = () => {
  const navigate = useNavigate();

  const { isEmailVerified } = useAuth();

  return (
    <>
      {isEmailVerified ? (
        <div className="flex flex-row w-full h-screen">
          {/* Fixed Sidebar */}
          <div className="w-[15%] h-screen fixed">
            <SideBar />
          </div>

          {/* Scrollable Outlet */}
          <div className="w-[85%] ml-[15%] flex flex-col h-screen overflow-y-auto">
            <div className="flex items-center justify-center flex-grow w-full py-10">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        navigate("/signIn")
      )}
    </>
  );
};

export default TruckDriverLayout;
