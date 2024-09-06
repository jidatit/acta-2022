import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../index.css";
import image from "../../images/pngwing.com.png";
import { useAuth } from "../../AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const SideBar = ({ isSidebarExpanded }) => {
  const { currentUser, handleLogout, isSaveClicked } = useAuth();
  const [activeItem, setActiveItem] = useState("JobApplication");
  const navigate = useNavigate();
  const location = useLocation();
  const [completedSections, setCompletedSections] = useState(["Section 1"]);
  const [currentSection, setCurrentSection] = useState("Section 1");
  const [completedForms, setCompletedForms] = useState(null);
  const sections = [
    "Section 1",
    "Section 2",
    "Section 3",
    "Section 4",
    "Section 5",
    "Section 6",
    "Section 7",
    "Section 8",
    "Section 9",
    "Section 10",
    "Section 11",
  ];

  const routeToSectionMap = {
    "/TruckDriverLayout/ApplicationForm1": "Section 1",
    "/TruckDriverLayout/ApplicationForm2": "Section 2",
    "/TruckDriverLayout/ApplicationForm3": "Section 3",
    "/TruckDriverLayout/ApplicationForm4": "Section 4",
    "/TruckDriverLayout/ApplicationForm5": "Section 5",
    "/TruckDriverLayout/ApplicationForm6": "Section 6",
    "/TruckDriverLayout/ApplicationForm7": "Section 7",
    "/TruckDriverLayout/ApplicationForm8": "Section 8",
    "/TruckDriverLayout/ApplicationForm9": "Section 9",
    "/TruckDriverLayout/ApplicationForm10": "Section 10",
    "/TruckDriverLayout/ApplicationForm11": "Section 11",
  };

  useEffect(() => {
    // Load completed sections from local storage
    const savedSections =
      JSON.parse(localStorage.getItem("completedSections")) || [];
    setCompletedSections(savedSections);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const correspondingSection = routeToSectionMap[currentPath];
    if (correspondingSection) {
      setCurrentSection(correspondingSection);
      if (!completedSections.includes(correspondingSection)) {
        setCompletedSections((prevSections) => {
          const newSections = [...prevSections, correspondingSection];
          localStorage.setItem(
            "completedSections",
            JSON.stringify(newSections)
          );
          return newSections;
        });
      }
    }

    const fetchCompletedForms = async () => {
      if (!currentUser) return;
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const completedFormsData = data.completedForms || null;
          setCompletedForms(completedFormsData);
          localStorage.setItem("completedForms", completedFormsData);
        }
      });
    };

    fetchCompletedForms();
  }, [currentUser, completedSections]);

  useEffect(() => {
    if (completedForms) {
      for (let i = 0; i <= 11; i++) {
        if (completedForms >= i) {
          const section = `Section ${i + 1}`;
          if (!completedSections.includes(section)) {
            setCompletedSections((prevSections) => {
              const newSections = [...prevSections, section];
              localStorage.setItem(
                "completedSections",
                JSON.stringify(newSections)
              );
              return newSections;
            });
          }
        }
      }
    }
  }, [completedForms]);
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleSectionClick = (section, index) => {
    if (section === "Section 1") {
      // Navigate to ApplicationForm1 without resetting completed sections
      navigate("/TruckDriverLayout/ApplicationForm1");
      // Ensure Section 1 is in the list of completed sections
      if (!completedSections.includes(section)) {
        setCompletedSections((prevSections) => {
          const newSections = [...prevSections, section];
          localStorage.setItem(
            "completedSections",
            JSON.stringify(newSections)
          );
          return newSections;
        });
      }
      return;
    }
    if (!isSaveClicked) {
      toast(
        "Please save the current form before navigating to another section."
      );
      return;
    }
    const previousSectionsCompleted = sections
      .slice(0, index)
      .every((sec) => completedSections.includes(sec));
    if (!previousSectionsCompleted) {
      toast.error(
        "Please complete the previous sections before moving forward."
      );
      return;
    }

    if (completedSections.includes(section) || index === 0) {
      setCurrentSection(section);
      navigate(`/TruckDriverLayout/ApplicationForm${index + 1}`);
    } else {
      toast.error("Please complete the previous sections first.");
    }
  };

  const handleEdit = () => {
    console.log("edit item");
  };

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.removeItem("completedSections");
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
        <div className="flex flex-row justify-between w-full md:items-center">
          <div className="flex flex-col items-center justify-center w-full md:justify-start md:items-start md:flex-row gap-x-2 gap-y-2 ">
            <img
              src={image}
              alt="..."
              className="object-cover w-10 h-10 rounded-full"
            />
            <div className="flex flex-col items-center justify-center w-full md:justify-start md:items-start ">
              <p className="text-[14px] text-white font-radios">
                {currentUser ? currentUser.firstName : "Guest"}
              </p>
              <p className="text-[12px] text-white font-radios">
                {"Welcome Back"}
              </p>
            </div>
          </div>
          <div className="flex md:items-center md:justify-center gap-x-3">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full md:items-center md:justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white hover:text-black font-semibold hover:bg-gray-50">
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
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </a>
                  </MenuItem>
                </div>
                <div className="">
                  <MenuItem>
                    <Link
                      to={"/TruckDriverLayout/ChangePassword"}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-blue-800 font-radios "
                    >
                      Change Password
                    </Link>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <div className="flex flex-col w-full gap-y-4">
          <Link
            to="/TruckDriverLayout/ApplicationForm1"
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
          <div className="w-full h-full overflow-hidden">
            <div
              className="absolute border-l-2 border-white left-[1.9rem]"
              style={{
                height: `calc(${sections.length} * 3.38rem - 0.75rem)`, // Adjust the multiplier and subtractor based on spacing needs
              }}
            ></div>
            <ul className="relative space-y-7 md:space-y-8">
              {sections.map((section, index) => (
                <li
                  key={index}
                  className="flex items-center text-white cursor-pointer"
                  onClick={() => handleSectionClick(section, index)}
                >
                  <div
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full ${
                      completedSections.includes(section)
                        ? "bg-white border-2 border-blue-500"
                        : "bg-blue-500 border-2 border-white"
                    }`}
                  >
                    {completedSections.includes(section) && index === 0 && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`ml-4 ${
                      completedSections.includes(section)
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {section}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
