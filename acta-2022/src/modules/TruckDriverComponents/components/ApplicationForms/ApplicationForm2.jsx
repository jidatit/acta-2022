import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { FaBell } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
const ApplicationForm2 = () => {
  const navigate = useNavigate();
  const { FormData, setIsSaveClicked, currentUser } = useAuth();

  // Initialize localFormData with the new structure
  const [localFormData, setLocalFormData] = useState(FormData || []);

  const initialFields = [
    {
      street1: { value: "", status: "pending", note: "" },
      street2: { value: "", status: "pending", note: "" },
      city: { value: "", status: "pending", note: "" },
      state: { value: "", status: "pending", note: "" },
      zipCode: { value: "", status: "pending", note: "" },
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update localFormData whenever FormData changes
  useEffect(() => {
    if (FormData) {
      setLocalFormData(FormData);
    }
  }, [FormData]);

  useEffect(() => {
    setIsSaveClicked(true);
  }, [setIsSaveClicked]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = [...localFormData];

    // Update value and reset status and note
    newFormData[index][name].value = value;
    newFormData[index][name].status = "pending"; // Update status as needed
    newFormData[index][name].note = ""; // Clear note on change

    setLocalFormData(newFormData);
    setIsSaveClicked(false);
  };

  const handleBack = () => {
    navigate("/TruckDriverLayout/ApplicationForm1");
  };

  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        previousAddresses: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form2: applicationData,
          completedForms: 2,
        });
      } else {
        await setDoc(docRef, {
          form2: applicationData,
          completedForms: 2,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(true);

    await saveToFirebase();
    navigate("/TruckDriverLayout/ApplicationForm3");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    toast.success("Form is successfully saved");
    setIsSaveClicked(true);

    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        previousAddresses: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form2: applicationData,
        });
      } else {
        await setDoc(docRef, {
          form2: applicationData,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
    }
  };

  const addAddressFields = () => {
    setLocalFormData([
      ...localFormData,
      {
        street1: { value: "", status: "pending", note: "" },
        street2: { value: "", status: "pending", note: "" },
        city: { value: "", status: "pending", note: "" },
        state: { value: "", status: "pending", note: "" },
        zipCode: { value: "", status: "pending", note: "" },
      },
    ]);
  };

  const removeAddressField = (index) => {
    const updatedFormData = localFormData.filter((_, i) => i !== index);
    setLocalFormData(updatedFormData);
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Previous Addresses
          </h1>
          <p className="text-lg text-black font-radios">
            List all addresses in previous three years
          </p>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
      </div>

      <div className="flex flex-col w-full gap-y-8 ">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          {Array.isArray(localFormData) &&
            localFormData.map((address, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 mb-6 ssm:grid-cols-2 md:grid-cols-3"
              >
                <div>
                  <div className="flex flex-row items-center gap-x-3 mb-1">
                    <label
                      htmlFor={`street1-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Street 1*
                    </label>
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex flex-row gap-x-1">
                        {address.street1.status === "rejected" ? (
                          <FaRegTimesCircle className="text-red-500" />
                        ) : address.street1.status === "approved" ? (
                          <FaRegCheckCircle className="text-green-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {address.street1.status === "rejected" && (
                        <div
                          className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal-street1-${index}`)
                              .showModal()
                          }
                        >
                          <FaPencil size={10} />
                          <p className="text-xs font-radios">View note</p>
                          <dialog
                            id={`modal-street1-${index}`}
                            className="modal"
                          >
                            <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                              <h3 className="font-bold text-lg">
                                Street 1 Note
                              </h3>
                              <p className="py-4">
                                {address.street1.note
                                  ? address.street1.note
                                  : "No note added"}
                              </p>
                              <div className="modal-action">
                                <form method="dialog">
                                  <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="street1"
                    id={`street1-${index}`}
                    value={address.street1.value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <div className="flex flex-row items-center gap-x-3 mb-1">
                    <label
                      htmlFor={`street2-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Street 2*
                    </label>
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex flex-row gap-x-1">
                        {address.street2.status === "rejected" ? (
                          <FaRegTimesCircle className="text-red-500" />
                        ) : address.street2.status === "approved" ? (
                          <FaRegCheckCircle className="text-green-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {address.street2.status === "rejected" && (
                        <div
                          className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal-street2-${index}`)
                              .showModal()
                          }
                        >
                          <FaPencil size={10} />
                          <p className="text-xs font-radios">View note</p>
                          <dialog
                            id={`modal-street2-${index}`}
                            className="modal"
                          >
                            <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                              <h3 className="font-bold text-lg">
                                Street 2 Note
                              </h3>
                              <p className="py-4">
                                {address.street2.note
                                  ? address.street2.note
                                  : "No note added"}
                              </p>
                              <div className="modal-action">
                                <form method="dialog">
                                  <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="street2"
                    id={`street2-${index}`}
                    value={address.street2.value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <div className="flex flex-row items-center gap-x-3 mb-1">
                    <label
                      htmlFor={`city-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      City*
                    </label>
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex flex-row gap-x-1">
                        {address.city.status === "rejected" ? (
                          <FaRegTimesCircle className="text-red-500" />
                        ) : address.city.status === "approved" ? (
                          <FaRegCheckCircle className="text-green-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {address.city.status === "rejected" && (
                        <div
                          className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal-city-${index}`)
                              .showModal()
                          }
                        >
                          <FaPencil size={10} />
                          <p className="text-xs font-radios">View note</p>
                          <dialog id={`modal-city-${index}`} className="modal">
                            <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                              <h3 className="font-bold text-lg">City Note</h3>
                              <p className="py-4">
                                {address.city.note
                                  ? address.city.note
                                  : "No note added"}
                              </p>
                              <div className="modal-action">
                                <form method="dialog">
                                  <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="city"
                    id={`city-${index}`}
                    value={address.city.value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <div className="flex flex-row items-center gap-x-3 mb-1">
                    <label
                      htmlFor={`state-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      State*
                    </label>
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex flex-row gap-x-1">
                        {address.state.status === "rejected" ? (
                          <FaRegTimesCircle className="text-red-500" />
                        ) : address.state.status === "approved" ? (
                          <FaRegCheckCircle className="text-green-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {address.state.status === "rejected" && (
                        <div
                          className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal-state-${index}`)
                              .showModal()
                          }
                        >
                          <FaPencil size={10} />
                          <p className="text-xs font-radios">View note</p>
                          <dialog id={`modal-state-${index}`} className="modal">
                            <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                              <h3 className="font-bold text-lg">State Note</h3>
                              <p className="py-4">
                                {address.state.note
                                  ? address.state.note
                                  : "No note added"}
                              </p>
                              <div className="modal-action">
                                <form method="dialog">
                                  <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="state"
                    id={`state-${index}`}
                    value={address.state.value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <div className="flex flex-row items-center gap-x-3 mb-1">
                    <label
                      htmlFor={`zipCode-${index}`}
                      className="block text-sm font-semibold text-gray-900 font-radios"
                    >
                      Zip Code*
                    </label>
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex flex-row gap-x-1">
                        {address.zipCode.status === "rejected" ? (
                          <FaRegTimesCircle className="text-red-500" />
                        ) : address.zipCode.status === "approved" ? (
                          <FaRegCheckCircle className="text-green-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {address.zipCode.status === "rejected" && (
                        <div
                          className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal-zipCode-${index}`)
                              .showModal()
                          }
                        >
                          <FaPencil size={10} />
                          <p className="text-xs font-radios">View note</p>
                          <dialog
                            id={`modal-zipCode-${index}`}
                            className="modal"
                          >
                            <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                              <h3 className="font-bold text-lg">
                                Zip Code Note
                              </h3>
                              <p className="py-4">
                                {address.zipCode.note
                                  ? address.zipCode.note
                                  : "No note added"}
                              </p>
                              <div className="modal-action">
                                <form method="dialog">
                                  <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                    Close
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    id={`zipCode-${index}`}
                    value={address.zipCode.value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex items-center mt-4">
                  {index >= initialFields.length && ( // Only show remove button for dynamically added fields
                    <button
                      type="button"
                      onClick={() => removeAddressField(index)}
                      className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={addAddressFields}
              className="px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
            >
              Add Address
            </button>
          </div>
          <div className="flex items-center justify-between w-full mt-10">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 font-semibold text-white bg-gray-400 rounded-md hover:bg-gray-500"
            >
              Back
            </button>
            <div>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 ml-4 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm2;
