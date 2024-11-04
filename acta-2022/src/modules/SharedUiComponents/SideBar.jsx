import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../index.css";
import image from "../../images/pngwing.com.png";
import { useAuth } from "../../AuthContext";
import {
  BsChevronDown,
  BsChevronUp,
  BsThreeDotsVertical,
  BsX,
} from "react-icons/bs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Camera, LogOutIcon } from "lucide-react";
import { Button } from "@mui/material";
import { useEdit } from "../../../EditContext";
import { DataArrayTwoTone } from "@mui/icons-material";

const SideBar = ({ isSidebarExpanded }) => {
  const { currentUser, handleLogout, isSaveClicked } = useAuth();
  const [activeItem, setActiveItem] = useState("JobApplication");
  const navigate = useNavigate();
  const location = useLocation();
  const [completedSections, setCompletedSections] = useState([]);
  const [currentSection, setCurrentSection] = useState("Section 1");
  const [completedForms, setCompletedForms] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSectionsVisible, setIsSectionsVisible] = useState(false); // State to manage section visibility
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { handleEditStatus } = useEdit();
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
  const updateCompletedSections = useCallback(() => {
    if (completedForms) {
      for (let i = 0; i <= 11; i++) {
        const section = `Section ${i + 1}`;
        if (completedForms >= i && !completedSections.includes(section)) {
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
  }, [completedForms, completedSections]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyCollection = collection(db, "companyInfo");
      const companySnapshot = await getDocs(companyCollection);
      const companyData = companySnapshot.docs.map((doc) => doc.data());

      if (companyData.length > 0) {
        setCompanyInfo(companyData[0]);
        setLogoPreview(companyData[0].logoUrl);
      }
    };

    fetchCompanyInfo();
  }, []);
  useEffect(() => {
    const savedSections =
      JSON.parse(localStorage.getItem("completedSections")) || [];
    setCompletedSections(savedSections);
  }, []);

  useEffect(() => {
    const fetchCompletedForms = async () => {
      if (!currentUser) return;
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const completedFormsData = data.completedForms || null;
          setCompletedForms(completedFormsData);
        }
      });
    };

    fetchCompletedForms();
  }, [currentUser]);
  useEffect(() => {
    const checkAccessAndRedirect = () => {
      const currentPath = location.pathname;
      const requestedSection = routeToSectionMap[currentPath];
      const requestedFormIndex = sections.indexOf(requestedSection) + 1;
      console.log(
        "Request",
        requestedSection,
        requestedFormIndex,
        completedForms
      );
      // Allow access to the next form after the last completed one
      if (requestedFormIndex >= completedForms + 1) {
        navigate(`/TruckDriverLayout/ApplicationForm${completedForms + 1}`);
      } else if (requestedSection) {
        setCurrentSection(requestedSection);
      }
    };

    checkAccessAndRedirect();
  }, [location.pathname, completedForms]);
  useEffect(() => {
    const currentPath = location.pathname;
    const correspondingSection = routeToSectionMap[currentPath];

    if (correspondingSection) {
      setCurrentSection(correspondingSection);

      // Remove the special handling for Section 1
      if (
        !completedSections.includes(correspondingSection) &&
        correspondingSection !== "Section 1"
      ) {
        setCompletedSections((prevSections) => {
          const newSections = [...prevSections, correspondingSection];
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
    const sectionFormIndex = index + 1;

    // Allow access only up to the next form after completed forms
    if (sectionFormIndex > completedForms + 1) {
      toast.error("Please complete all required fields to continue");
      return;
    }

    if (!isSaveClicked) {
      toast(
        "Please save the current form before navigating to another section."
      );
      return;
    }

    setCurrentSection(section);
    navigate(`/TruckDriverLayout/ApplicationForm${sectionFormIndex}`);
  };

  const handleEdit = () => {
    handleEditStatus(true);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleDialogClose();
  };

  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setApplicationData(docSnap.data());
      }
    };

    fetchData();
  }, [currentUser]);
  const checkSectionRejection = (formNumber) => {
    const formKey = `form${formNumber}`;
    if (!applicationData || !applicationData[formKey]) return false;

    const arrayKeys = [
      "previousAddresses",
      "EmploymentHistory",
      "accidentRecords",
      "trafficConvictions",
      "driverExperience",
      "driverLicensePermit",
      "educationHistory",
      "extraSkills",
      "violationRecords",
      "AlcoholDrugTest",
      "onDutyHours",
      "compensatedWork",
    ];

    const checkStatusInObject = (obj) => {
      if (!obj || typeof obj !== "object") return false;

      // Check direct status field
      if (obj.status === "rejected") return true;

      // Check array fields
      for (const key of arrayKeys) {
        if (obj[key] && Array.isArray(obj[key])) {
          for (const item of obj[key]) {
            // Check each field in array item
            for (const fieldKey in item) {
              if (item[fieldKey]?.status === "rejected") {
                return true;
              }
            }
          }
        }
      }

      // Check all other fields in the object
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === "object") {
          // Skip array fields as they're already checked
          if (!arrayKeys.includes(key)) {
            if (checkStatusInObject(obj[key])) {
              return true;
            }
          }
        }
      }

      return false;
    };

    return checkStatusInObject(applicationData[formKey]);
  };
  const isSectionCompleted = (section, index) => {
    // Section 1 is always accessible
    if (section === "Section 1") return true;

    // A section is completed only if its index is less than or equal to completedForms
    return completedForms !== null && index <= completedForms;
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
              <p className="text-[14px] text-white font-radios pl-4">
                {currentUser
                  ? currentUser.firstName + currentUser.lastName
                  : "Guest"}
              </p>
              <p className="text-[12px] pl-4 text-start text-white w-full font-radios">
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
        <div className="flex flex-col justify-between w-full h-full">
          <div className="flex flex-col w-full gap-y-4">
            <Link
              to="/TruckDriverLayout/ApplicationForm1"
              className={`w-full flex justify-between items-center transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "JobApplication"
                  ? "bg-white text-blue-800 rounded-md"
                  : "hover:bg-white hover:text-blue-900 rounded-md text-white"
              }`}
              onClick={() => handleItemClick("JobApplication")}
            >
              <p
                className={`w-full px-2 py-2 smd:px-3 rounded-md text-[14px] smd:text-[17px] font-radios ${
                  activeItem === "JobApplication" ? "text-blue-800" : ""
                }`}
              >
                Job Application
              </p>
              <span className="relative right-5">
                {isSectionsVisible ? (
                  <BsChevronUp className="inline" />
                ) : (
                  <BsChevronDown className="inline" />
                )}
              </span>
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
                    {sections.map((section, index) => {
                      const hasRejectedFields = checkSectionRejection(
                        index + 1
                      );
                      const isCompleted = isSectionCompleted(section, index);

                      return (
                        <li
                          key={index}
                          className="flex items-center text-white cursor-pointer"
                          onClick={() => handleSectionClick(section, index)}
                        >
                          <div
                            className={`relative flex items-center justify-center w-6 h-6 rounded-full ${
                              isCompleted
                                ? "bg-white border-1 border-blue-500"
                                : "bg-blue-500 border-2 border-white"
                            }`}
                          >
                            {currentSection === section && (
                              <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center ml-4">
                            <span
                              className={`${
                                isCompleted ? "text-white" : "text-gray-300"
                              }`}
                            >
                              {section}
                            </span>
                            {hasRejectedFields && (
                              <div className="flex items-center ml-2">
                                <BsX className="text-red-500 text-xl bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            <Link
              to={"/TruckDriverLayout/CompanyInformation"}
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "CompanyInformation"
                  ? "bg-white rounded-md "
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={() => handleItemClick("CompanyInformation")}
            >
              <p
                className={`flex justify-between items-center w-full px-2 py-2 smd:px-3 rounded-md text-[14px] smd:text-[17px] font-radios hover:bg-white hover:text-blue-900 ${
                  activeItem === "CompanyInformation"
                    ? "text-blue-800"
                    : "text-white"
                }`}
              >
                Company Information
              </p>
            </Link>
          </div>
          <div className="w-full ">
            <Link
              to=""
              className={`w-full transition-all duration-300 ease-in-out rounded-md ${
                activeItem === "Logout"
                  ? "bg-white rounded-md shadow-lg"
                  : "hover:bg-white rounded-md hover:text-blue-900"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick("Logout");
                handleDialogOpen();
              }}
            >
              <div
                className={`w-full md:-mt-0 -mt-24 p-3 rounded-md font-radios flex items-center gap-2 hover:bg-white hover:text-blue-900 ${
                  activeItem === "Logout" ? "text-blue-800" : "text-white"
                }`}
              >
                <LogOutIcon className="w-5 h-5" />
                <span>Logout</span>
              </div>
            </Link>

            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              PaperProps={{
                style: {
                  borderRadius: "12px",
                  padding: "8px",
                  maxWidth: "600px",
                  width: "90%",
                },
              }}
            >
              <DialogTitle
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1e3a8a",
                  paddingBottom: "8px",
                }}
              >
                Confirm Logout
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  style={{
                    color: "#4b5563",
                    fontSize: "1rem",
                    marginBottom: "8px",
                  }}
                >
                  Are you sure you want to logout? This will end your current
                  session.
                </DialogContentText>
              </DialogContent>
              <DialogActions
                style={{
                  padding: "16px",
                  gap: "8px",
                }}
              >
                <button
                  onClick={handleDialogClose}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
