import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { db } from "../../../config/firebaseConfig";
import FormShowingModal from "./FormShowingModal";
import EnhancedStatusDropdown from "../../SharedComponents/components/EnhancedDropdown";

const RegisteredUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [tableData, setTableData] = useState([
    {
      id: 1,
      name: "Hassan Ali Iqbal",
      status: "Pending",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 2,
      name: "Hassan Ali Iqbal",
      status: "Approved",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 3,
      name: "Hassan Ali Iqbal",
      status: "Declined",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 4,
      name: "Hassan Ali Iqbal",
      status: "Future Lead",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    {
      id: 5,
      name: "Hassan Ali Iqbal",
      status: "Need Review",
      date: "1st July 2020",
      time: "12:30 AM",
    },
    // More rows can be added here...
  ]);

  const [truckDrivers, setTruckDrivers] = useState([]); // State for truck driver data
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store the selected user for deletion
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle dropdown visibility

  useEffect(() => {
    const fetchTruckDrivers = async () => {
      // Set up Firestore real-time listener using onSnapshot
      const unsubscribe = onSnapshot(
        collection(db, "TruckDrivers"),
        (snapshot) => {
          const drivers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTruckDrivers(drivers); // Update the state with real-time data
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchTruckDrivers();
  }, []); // Empty dependency array means this runs once on mount
  // Function to determine status background color

  // Function to select a row via checkbox

  // Function to handle delete click
  const deleteUserByUid = async (uid) => {
    try {
      await deleteDoc(doc(db, "TruckDrivers", uid));
      console.log(`User with UID ${uid} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  // Function to confirm delete
  const handleSelectRow = (uid, name) => {
    setSelectedUserIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
    setSelectedUser(name);
  };

  const handleDeleteClick = () => {
    if (selectedUserIds.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const truckDriversRef = collection(db, "TruckDrivers");
      const querySnapshot = await getDocs(truckDriversRef);

      const deletePromises = selectedUserIds.map(async (selectedUid) => {
        const docToDelete = querySnapshot.docs.find(
          (doc) => doc.data().uid === selectedUid
        );
        if (docToDelete) {
          await deleteDoc(doc(db, "TruckDrivers", docToDelete.id));
        }
      });

      await Promise.all(deletePromises);

      setTruckDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => !selectedUserIds.includes(driver.uid))
      );

      setSelectedUserIds([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };
  const formatDate = (timestamp) => {
    // Check if the timestamp is an object with seconds and nanoseconds
    if (
      typeof timestamp !== "object" ||
      !timestamp.seconds ||
      !timestamp.nanoseconds
    ) {
      console.error("Invalid timestamp format:", timestamp);
      return "Invalid date"; // Return a default value in case of error
    }

    // Convert Firestore timestamp to milliseconds
    const milliseconds =
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    const date = new Date(milliseconds);

    // Check for valid date
    if (isNaN(date.getTime())) {
      console.error("Failed to parse date:", milliseconds);
      return "Invalid date"; // Return a default value in case of error
    }

    // Get the day with its ordinal suffix
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return "th"; // For 4-20
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };
  const handleStatusChange = async (uid, newStatus) => {
    setTruckDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.uid === uid ? { ...driver, driverStatus: newStatus } : driver
      )
    );
    const truckDriversQuery = query(
      collection(db, "TruckDrivers"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(truckDriversQuery);

    if (!querySnapshot.empty) {
      // Get the first matching document
      const truckDriverDoc = querySnapshot.docs[0];

      // Update the status in the found document
      await updateDoc(doc(db, "TruckDrivers", truckDriverDoc.id), {
        driverStatus: newStatus,
        statusUpdateDate: new Date().toISOString(),
      });
    }
  };
  const statusOptions = [
    "Pending",
    "approved",
    "rejected",
    "Future Lead",
    "Need Review",
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400";
      case "approved":
        return "bg-green-400";
      case "rejected":
        return "bg-red-400";
      case "Future Lead":
        return "bg-blue-400";
      case "Need Review":
        return "bg-orange-400";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Registered Users</h1>
        <MdOutlineDeleteOutline
          size={30}
          className="cursor-pointer"
          onClick={() => handleDeleteClick(selectedUser)}
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-1 rounded-t-md font-radios overflow-x-auto">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="border p-2 text-left"></th>
              <th className="border p-2 text-left">Driver Name</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Time</th>
              <th className="border p-2 text-left">Application</th>
            </tr>
          </thead>
          <tbody>
            {truckDrivers.map((driver) => (
              <tr key={driver.uid} className="hover:bg-gray-100 ">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() =>
                      handleSelectRow(driver.uid, driver.firstName)
                    }
                  />
                </td>
                <td className=" px-2 py-3">{`${driver.firstName} ${driver.lastName}`}</td>
                <td className="px-2 py-3 whitespace-nowrap ">
                  <EnhancedStatusDropdown
                    initialStatus={driver.driverStatus}
                    ref={dropdownRef}
                    options={statusOptions}
                    onStatusChange={(value) =>
                      handleStatusChange(driver.uid, value)
                    }
                    getStatusColor={getStatusColor}
                  />
                </td>
                {/* Default status or you can modify this */}
                <td className="px-2 py-3">{formatDate(driver.dateCreated)}</td>
                <td className=" px-2 py-3">--</td>{" "}
                {/* Placeholder for time or remove this column */}
                <td className=" px-2 py-3">
                  {/* <button className="bg-blue-500 text-white py-1 px-3 rounded mr-2">
                  View
                </button> */}
                  <button
                    className="bg-blue-500 text-white py-1 px-10 rounded"
                    onClick={() => {
                      console.log("driver.uid", driver.uid);
                      setCurrentUserId(driver.uid);
                      setOpenModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <>
                    <FormShowingModal
                      uid={currentUserId}
                      openModal={openModal}
                      setOpenModal={setOpenModal}
                    />
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-40 min-h-full w-full overflow-y-auto overflow-x-hidden transition flex items-center">
          {/* overlay */}
          <div
            aria-hidden="true"
            className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
            onClick={() => setShowDeleteModal(false)} // Close the modal when clicking outside
          ></div>
          {/* Modal */}
          <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
            <div className="w-full py-2 bg-white cursor-default pointer-events-auto relative rounded-xl mx-auto max-w-xl">
              <button
                tabIndex={-1}
                type="button"
                className="absolute top-2 right-2"
                onClick={() => setShowDeleteModal(false)} // Close the modal
              >
                <svg
                  title="Close"
                  tabIndex={-1}
                  className="h-4 w-4 cursor-pointer text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="flex flex-col items-center justify-center gap-y-5">
                <p className="text-center text-xl font-radios mt-4">
                  Are you sure you want to delete this driver?{" "}
                </p>
                <p className="text-center text-lg font-radios ">
                  "{selectedUser ? selectedUser : ""}"
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-300 text-black py-2.5 px-6 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-blue-600 text-white py-2.5 px-6 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
