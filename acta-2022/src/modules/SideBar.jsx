import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import image from "../images/pngwing.com.png";
import { useAuth } from "../AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const SideBar = () => {
  const { currentUser, handleLogout } = useAuth();
  const [activeItem, setActiveItem] = useState("JobApplication");
  const navigate = useNavigate();
  const location = useLocation();
  const { isSaveClicked } = useAuth();
  const [completedSections, setCompletedSections] = useState([]);
  const [currentSection, setCurrentSection] = useState("Section 1");
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
    const currentPath = location.pathname;
    const correspondingSection = routeToSectionMap[currentPath];
    if (correspondingSection) {
      setCurrentSection(correspondingSection);
      if (!completedSections.includes(correspondingSection)) {
        setCompletedSections((prevSections) => [
          ...prevSections,
          correspondingSection,
        ]);
      }
    }
    console.log(completedSections);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleSectionClick = (section, index) => {
    // Check if the current section is saved
    if (!isSaveClicked) {
      alert(
        "Please save the current form before navigating to another section."
      );
      return;
    }

    // Ensure that all previous sections are completed before navigating to the next section
    const previousSectionsCompleted = sections
      .slice(0, index)
      .every((sec) => completedSections.includes(sec));

    if (!previousSectionsCompleted) {
      alert("Please complete the previous sections before moving forward.");
      return;
    }

    // Check if the current section is completed or it's the first section
    if (completedSections.includes(sections[index]) || index === 0) {
      setCurrentSection(section);
      navigate(`/TruckDriverLayout/ApplicationForm${index + 1}`);
    } else {
      alert("Please complete the previous sections first.");
    }
  };

  const handleEdit = () => {
    console.log("edit item");
  };

  return (
    <div className="bg-[#2257e7] h-full w-full">
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
                height: `calc(99% - ${(sections.length - 1) * 2}rem)`,
              }}
            ></div>
            <ul className="relative space-y-8">
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
