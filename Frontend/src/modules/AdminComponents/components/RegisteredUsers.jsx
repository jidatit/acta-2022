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
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import { useAuth } from "../../../AuthContext";
import PdfModal from "./PdfModal";

const RegisteredUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);

  const { currentUser } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [truckDrivers, setTruckDrivers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [adminData, setAdminData] = useState(null);

  // Fetch companies from companyInfo collection
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesSnapshot = await getDocs(collection(db, "companyInfo"));
        const companiesData = [];

        companiesSnapshot.forEach((doc) => {
          const data = doc.data();
          // Add main company
          if (data.companyName && data.id && data.logoUrl) {
            companiesData.push({
              id: data.id,
              name: data.companyName,
              logoUrl: data.logoUrl,
            });
          }

          // Add additional companies if they exist
          if (
            data.additionalCompanies &&
            Array.isArray(data.additionalCompanies)
          ) {
            data.additionalCompanies.forEach((company) => {
              if (company.companyName && company.id && company.logoUrl) {
                companiesData.push({
                  id: company.id,
                  name: company.companyName,
                  logoUrl: company.logoUrl,
                });
              }
            });
          }
        });

        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (currentUser?.uid) {
        try {
          const adminQuery = query(
            collection(db, "admin"),
            where("uid", "==", currentUser.uid)
          );
          const adminSnapshot = await getDocs(adminQuery);

          if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            setAdminData({
              docId: adminDoc.id,
              ...adminDoc.data(),
            });
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
    };

    fetchAdminData();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "TruckDrivers"),
      (snapshot) => {
        const drivers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by dateCreated: latest first
        drivers.sort((a, b) => {
          const dateA = a.dateCreated?.seconds || 0;
          const dateB = b.dateCreated?.seconds || 0;
          return dateB - dateA; // Descending order
        });
        setTruckDrivers(drivers);
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to handle company selection

  const handleCompanyChange = async (companyId, driverId) => {
    if (!companyId || !driverId) {
      toast.error("Missing companyId or driverId");
      return;
    }

    try {
      const selectedCompany = companies.find(
        (company) => company.id === companyId
      );
      if (!selectedCompany) {
        toast.error("Company not found");
        return;
      }

      // Step 1: Query TruckDrivers by matching uid with driverId
      const driversRef = collection(db, "TruckDrivers");
      const q = query(driversRef, where("uid", "==", driverId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("TruckDriver not found");
        return;
      }

      const driverDoc = querySnapshot.docs[0];
      const driverDocRef = driverDoc.ref;

      // Step 2: Update that driver's selectedCompany
      await updateDoc(driverDocRef, {
        selectedCompany: {
          id: selectedCompany.id,
          name: selectedCompany.name,
          logoUrl: selectedCompany.logoUrl,
        },
        companyUpdatedAt: new Date().toISOString(),
      });

      toast.success("Company updated for driver successfully!");
    } catch (error) {
      console.error("Error updating TruckDriver document:", error);
      toast.error("Failed to update company for driver");
    }
  };
  // Function to confirm delete
  const handleSelectRow = (uid, name) => {
    setSelectedUserIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
    setSelectedUser((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleDeleteClick = () => {
    if (selectedUserIds.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const userRef = "TruckDrivers";

      // Define a reusable function to delete a user
      const deleteUserById = async (selectedUid) => {
        // Delete from TruckDrivers collection via API
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/Admin/deleteUser`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: selectedUid, userRef: userRef }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setLoading(false);
          setShowDeleteModal(false);
          throw new Error(data.message || "Failed to delete user via API");
        }

        // Delete from truck_driver_applications Firestore collection

        return data.message; // Return success message
      };

      // Map over selectedUserIds and delete users concurrently
      const deleteResults = await Promise.allSettled(
        selectedUserIds.map((uid) => deleteUserById(uid))
      );

      // Process the results
      const successfulDeletions = [];
      deleteResults.forEach((result, index) => {
        const uid = selectedUserIds[index];
        if (result.status === "fulfilled") {
          successfulDeletions.push(uid);
        } else {
          setShowDeleteModal(false);
          setLoading(false);
          console.error(`Error deleting user `);
          toast.error(`Error deleting user `, {
            autoClose: 2000,
          });
        }
      });

      // Update local state
      setTruckDrivers((prevDrivers) =>
        prevDrivers.filter(
          (driver) => !successfulDeletions.includes(driver.uid)
        )
      );
      setLoading(false);
      setSelectedUserIds([]);
      setShowDeleteModal(false);

      if (successfulDeletions.length) {
        toast.success("Selected drivers deleted successfully");
        setShowDeleteModal(false);
      }
    } catch (error) {
      setLoading(false);
      setShowDeleteModal(false);
      console.error("Error deleting users:", error);
      toast.error("Error deleting selected drivers");
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

  const handleStatusChange = async (documentId, newStatus, appId) => {
    try {
      // Update the driver status in the "TruckDrivers" collection
      await updateDoc(doc(db, "TruckDrivers", documentId), {
        driverStatus: newStatus,
        statusUpdateDate: new Date().toISOString(),
      });

      // Update the application status in the "truck_driver_applications" collection
      const userApplicationDoc = doc(db, "truck_driver_applications", appId);
      await updateDoc(userApplicationDoc, {
        applicationStatus: newStatus,
      });

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const statusOptions = [
    "pending",
    "filled",
    "registered",
    "approved",
    "rejected",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400";
      case "approved":
        return "bg-green-400";
      case "rejected":
        return "bg-red-400";
      case "filled":
        return "bg-blue-400";
      case "registered":
        return "bg-orange-400";
      default:
        return "bg-gray-200";
    }
  };

  const openModalWithUser = (uid) => {
    setCurrentUserId(uid);
    setOpenModal(true); // Ensure `currentUserId` is set before opening modal
  };

  const openPDfModalWithUser = (uid) => {
    setCurrentUserId(uid);
    setOpenPdfModal(true); // Ensure `currentUserId` is set before opening modal
  };

  // Company Dropdown Component - removed since we're using inline dropdown

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Registered Drivers</h1>
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
              <th className="border p-2 text-left">Companies</th>
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
                    onChange={() => handleSelectRow(driver.uid, driver.name)}
                  />
                </td>
                <td className=" px-2 py-3">{`${driver.name}`}</td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <EnhancedStatusDropdown
                    initialStatus={driver.driverStatus}
                    options={statusOptions}
                    onStatusChange={(value) =>
                      handleStatusChange(driver.id, value, driver.uid)
                    } // Use driver.id here
                    getStatusColor={getStatusColor}
                  />
                </td>
                {/* Default status or you can modify this */}
                <td className="px-2 py-3">{formatDate(driver.dateCreated)}</td>
                <td className=" px-2 py-3">--</td>{" "}
                {/* Placeholder for time or remove this column */}
                <td className="px-2 py-3">
                  <div className="relative w-[180px]">
                    <select
                      value={driver?.selectedCompany?.id || ""}
                      onChange={(e) =>
                        handleCompanyChange(e.target.value, driver.uid)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {/* {driver?.selectedCompany && (
                      <div className=" flex items-center space-x-2">
                       <img
                          src={driver.selectedCompany.logoUrl}
                          alt={driver.selectedCompany.name}
                          className="w-5 h-5 object-cover rounded"
                        />
                        <span className="text-xs text-gray-600">
                          {driver.selectedCompany.name}
                        </span>
                      </div>
                    )} */}
                  </div>
                </td>
                <td className=" px-2 py-3">
                  <button
                    className={`py-1 px-10 rounded ${
                      driver.driverStatus === "registered"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-black text-white hover:bg-[#353535]"
                    }`}
                    onClick={() => {
                      if (driver.driverStatus !== "registered") {
                        openModalWithUser(driver.uid);
                      }
                    }}
                    disabled={driver.driverStatus === "registered"}
                  >
                    Edit
                  </button>
                  {driver.driverStatus === "approved" && (
                    <button
                      className={`py-1 ml-4 px-10 rounded ${
                        driver.driverStatus === "registered"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-black text-white hover:bg-[#353535]"
                      }`}
                      onClick={() => {
                        if (driver.driverStatus !== "registered") {
                          openPDfModalWithUser(driver.uid);
                        }
                      }}
                      disabled={driver.driverStatus === "registered"}
                    >
                      View PDF
                    </button>
                  )}

                  {openModal && currentUserId === driver.uid && (
                    <FormShowingModal
                      uid={currentUserId}
                      openModal={openModal}
                      setOpenModal={setOpenModal}
                      driverStatus={driver.driverStatus}
                    />
                  )}
                  {openPdfModal && (
                    <PdfModal
                      openModal={openPdfModal}
                      setOpenModal={setOpenPdfModal}
                      uid={currentUserId}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-xl mx-auto rounded-xl z-60 p-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">
                Are you sure you want to delete this driver?
              </h2>
              <p className="text-gray-600 mt-2">
                {selectedUser?.length > 0 && `"${selectedUser.join(", ")}"`}
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-black py-2.5 px-6 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className={`bg-black text-white py-2.5 px-6 rounded-xl ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
