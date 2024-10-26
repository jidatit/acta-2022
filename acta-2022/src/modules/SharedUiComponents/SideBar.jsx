import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../index.css";
import image from "../../images/pngwing.com.png";
import { useAuth } from "../../AuthContext";
import {
  BsChevronDown,
  BsChevronUp,
  BsThreeDotsVertical,
} from "react-icons/bs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Camera } from "lucide-react";
import { Button } from "@mui/material";
const SideBar = ({ isSidebarExpanded }) => {
  const { currentUser, handleLogout, isSaveClicked } = useAuth();
  const [activeItem, setActiveItem] = useState("JobApplication");
  const navigate = useNavigate();
  const location = useLocation();
  const [completedSections, setCompletedSections] = useState(["Section 1"]);
  const [currentSection, setCurrentSection] = useState("Section 1");
  const [completedForms, setCompletedForms] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSectionsVisible, setIsSectionsVisible] = useState(false); // State to manage section visibility

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutDialog(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    localStorage.removeItem("completedSections");
    setShowLogoutDialog(false);
  };
  const handleClose = () => {
    setShowLogoutDialog(false);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
  };
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
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

      // Add this to ensure "Section 1" is always marked correctly
      if (
        correspondingSection === "Section 1" &&
        !completedSections.includes("Section 1")
      ) {
        setCompletedSections((prevSections) => {
          const newSections = [...prevSections, "Section 1"];
          localStorage.setItem(
            "completedSections",
            JSON.stringify(newSections)
          );
          return newSections;
        });
      }

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
  }, [location.pathname, currentUser, completedSections]);

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
    if (item === "JobApplication") {
      setIsSectionsVisible(!isSectionsVisible); // Toggle section visibility
    }
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
      // Set the current section
      setCurrentSection("Section 1");
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
    //console.log("edit item");
  };

  return (
    <div
      className={`z-50 h-full w-full overflow-y-hidden bg-blue-[#0086D9] ${
        !isSidebarExpanded ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex flex-col items-center justify-start w-full h-full px-5 py-3 gap-y-4 smd:gap-y-4">
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
        <div className="flex flex-row justify-between w-full md:items-center">
          <div className="flex items-center -ml-3 xxl:ml-0 justify-center w-full md:justify-start md:items-start flex-row gap-x-2 gap-y-2 ">
            {/* <img
              src={image}
              alt="..."
              className="object-cover w-10 h-10 rounded-full"
            /> */}
            <div className="flex flex-col w-full md:justify-start md:items-start ">
              <p className="text-[14px] text-white font-radios">
                {currentUser
                  ? currentUser.firstName + currentUser.lastName
                  : "Guest"}
              </p>
              <p className="text-[12px] md:block hidden text-start text-white w-full font-radios">
                {"Welcome Back"}
              </p>
            </div>
          </div>
          <>
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

            <Dialog
              open={showLogoutDialog}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                style: {
                  borderRadius: "0.75rem",
                  padding: "1rem",
                },
              }}
            >
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  padding: "1rem 1.5rem",
                }}
              >
                Confirm Logout
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Are you sure you want to logout? You'll need to login again to
                  access your account.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ padding: "1rem 1.5rem" }}>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "rgb(243 244 246)",
                    color: "rgb(55 65 81)",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgb(229 231 235)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogoutConfirm}
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(37 99 235)",
                    color: "white",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgb(29 78 216)",
                    },
                  }}
                >
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </div>
        <div className="flex flex-col justify-between w-full h-full gap-y-4">
          <Link
            className={`w-full transition-all duration-300 ease-in-out rounded-md ${
              activeItem === "JobApplication"
                ? "bg-white rounded-md "
                : "hover:bg-white rounded-md hover:text-blue-900"
            }`}
            onClick={() => handleItemClick("JobApplication")}
          >
            <p
              className={`flex justify-between items-center w-full px-2 py-2 smd:px-3 rounded-md text-[14px] smd:text-[17px] font-radios hover:bg-white hover:text-blue-900 ${
                activeItem === "JobApplication" ? "text-blue-800" : "text-white"
              }`}
            >
              Job Application
              <span className="ml-2">
                {isSectionsVisible ? (
                  <BsChevronUp className="inline" />
                ) : (
                  <BsChevronDown className="inline" />
                )}
              </span>
            </p>
          </Link>
          {isSectionsVisible && ( // Conditional rendering of sections
            <div className="flex flex-col w-full gap-y-2">
              <div className="w-full h-full overflow-hidden">
                <div
                  className={`block smd:hidden absolute border-l-2 border-white left-[1.9rem] `}
                  style={{
                    height: `calc(${sections.length} * 2rem - 2.9rem)`, // Adjust the multiplier and subtractor based on spacing needs
                  }}
                ></div>
                <div
                  className=" block md:hidden absolute border-l-2 border-white left-[1.9rem]"
                  style={{
                    height: `calc(${sections.length} * 2.42rem - 0.75rem)`, // Height for small screens and above
                  }}
                ></div>
                <div
                  className="hidden md:block absolute border-l-2 border-white left-[1.9rem]"
                  style={{
                    height: `calc(${sections.length} * 6.12rem - 32.1rem)`, // Height for medium screens and above
                  }}
                ></div>
                <ul className="relative space-y-4 md:space-y-5">
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
                        {currentSection === section && (
                          <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
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
          )}
          {companyInfo && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
