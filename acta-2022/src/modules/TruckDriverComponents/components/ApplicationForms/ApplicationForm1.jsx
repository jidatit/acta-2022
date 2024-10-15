import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
const ApplicationForm = () => {
  const navigate = useNavigate();
  const { setIsSaveClicked, currentUser, FormData1 } = useAuth();
  const [formData, setFormData] = useState(FormData1);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs once, on mount
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);

  useEffect(() => {
    if (FormData1) {
      setFormData(FormData1);
    }
  }, [FormData1]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value: value }, // Update only the value property
    }));

    // Clear the error if input is not empty
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key].value; // Access the value property here

      // Check if the value is a string before trimming
      if (typeof value === "string" && !value.trim()) {
        if (key !== "street2" && key !== "referredBy" && key !== "Email") {
          newErrors[key] = "This field is required";
        }
      }
    });

    // Specifically check for the email field

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const applicationData = { ...formData, submittedAt: new Date() };

        // Reference to the specific document in the collection
        const docRef = doc(db, "truck_driver_applications", currentUser.uid);

        // Check if the document exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Document exists, update it
          await updateDoc(docRef, {
            form1: applicationData, // Use a descriptive key for each form
          });
        } else {
          // Document does not exist, create it
          await setDoc(docRef, {
            form1: applicationData,
          });
        }

        setIsSaveClicked(true);
        navigate("/TruckDriverLayout/ApplicationForm2");
      } catch (error) {
        console.error("Error saving application: ", error);
      }
    } else {
      toast.error("Please complete all required fields to continue");
    }
  };

  const saveFormInfo = async (e) => {
    e.preventDefault();

    // Check if at least one field is filled
    const isAnyFieldFilled = Object.values(formData).some(
      (field) => field.value.trim() !== "" // Access the value property here
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    try {
      const applicationData = { ...formData, submittedAt: new Date() };

      // Reference to the specific document in the collection
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);

      // Check if the document exists
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(docRef, {
          form1: applicationData,
          // Use a descriptive key for each form
        });
      } else {
        // Document does not exist, create it
        await setDoc(docRef, {
          form1: applicationData,
        });
      }

      toast.success("Form is successfully saved");
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the form, please try again");
    }
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex flex-row items-center justify-center w-full ">
        <h1 className="w-full text-xl font-bold text-center text-black">
          Application Form
        </h1>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
      </div>
      <div className=" flex flex-col w-full gap-y-8">
        <form className="w-full rounded-md shadow-md border-b-1 border-b-gray-400">
          {/* Line 1: Applicant Name */}
          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="applicantName"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Applicant Name*
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.applicantName.status === "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.applicantName.status === "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.applicantName.status === "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.applicantName.note
                            ? formData.applicantName.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <input
              type="text"
              name="applicantName"
              id="applicantName"
              value={formData.applicantName.value}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border rounded-md ${
                errors.applicantName
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
            />
            {errors.applicantName && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.applicantName}
              </p>
            )}
          </div>

          {/* Line 2: Applied Date, Position Applied For, SSN */}
          <div className="grid grid-cols-1 gap-4 mb-6 md md:grid-cols-3">
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="appliedDate"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Applied Date*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.appliedDate.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.appliedDate.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.appliedDate.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.appliedDate.note
                              ? formData.appliedDate.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="date"
                name="appliedDate"
                id="appliedDate"
                value={formData.appliedDate.value}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.appliedDate
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.appliedDate && (
                <p className="mt-1 text-[15px] font-radios text-red-500">
                  {errors.appliedDate}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="positionApplied"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Position Applied*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.positionApplied.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.positionApplied.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.positionApplied.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.positionApplied.note
                              ? formData.positionApplied.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <select
                name="positionApplied"
                id="positionApplied"
                value={formData.positionApplied.value}
                onChange={handleChange}
                className={`w-full p-[12px] mt-1 border rounded-md ${
                  errors.positionApplied
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Position</option>
                <option value="position1">Position 1</option>
                <option value="position2">Position 2</option>
              </select>
              {errors.positionApplied && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  This Field is required
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="ssn"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  SSN*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.ssn.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.ssn.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.ssn.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.ssn.note
                              ? formData.ssn.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="ssn"
                id="ssn"
                value={formData.ssn.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.ssn ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.ssn && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.ssn}
                </p>
              )}
            </div>
          </div>

          {/* Line 3: Date of Birth, Gender, Who Referred You */}
          <div className="grid justify-center grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="DOB"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Date Of Birth*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.DOB.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.DOB.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.DOB.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.DOB.note
                              ? formData.DOB.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="date"
                name="DOB"
                id="DOB"
                value={formData.DOB.value}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Setting max to today's date
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.DOB ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.DOB && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.DOB}
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Gender*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.gender.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.gender.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.gender.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.gender.note
                              ? formData.gender.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender?.value === "male"}
                    onChange={handleChange}
                    className={`text-blue-500 form-radio ${
                      errors.gender ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender?.value === "female"}
                    onChange={handleChange}
                    className={`text-blue-500 form-radio ${
                      errors.gender ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.gender}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="referredBy"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Referred By*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.referredBy.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.referredBy.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.referredBy.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.referredBy.note
                              ? formData.referredBy.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="referredBy"
                id="referredBy"
                value={formData.referredBy.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.referredBy ? "border-gray-300" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Line 4: Legal Right to Work, Pay Expected */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="legalRightToWork"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Do you have the legal right to work in the United States?*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.legalRightToWork.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.legalRightToWork.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.legalRightToWork.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.legalRightToWork.note
                              ? formData.legalRightToWork.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="flex items-center p-2 mt-1">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="legalRightToWork"
                    value="yes"
                    checked={formData.legalRightToWork?.value === "yes"}
                    onChange={handleChange}
                    className={`text-blue-500 form-radio ${
                      errors.legalRightToWork ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="legalRightToWork"
                    value="no"
                    checked={formData.legalRightToWork?.value === "no"}
                    onChange={handleChange}
                    className={`text-blue-500 form-radio ${
                      errors.legalRightToWork ? "border-red-500 border-2" : ""
                    }`}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.legalRightToWork && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.legalRightToWork}
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="payExpected"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Rate of pay expected*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.payExpected.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.payExpected.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.payExpected.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.payExpected.note
                              ? formData.payExpected.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="payExpected"
                id="payExpected"
                value={formData.payExpected.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.payExpected
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.payExpected && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.payExpected}
                </p>
              )}
            </div>
          </div>

          {/* Line 5-8: Address Details */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="street1"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Street 1*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.street1.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.street1.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.street1.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.street1.note
                              ? formData.street1.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="street1"
                id="street1"
                value={formData.street1.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.street1 ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.street1 && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.street1}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="street2"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Street 2*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.street2.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.street2.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.street2.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.street2.note
                              ? formData.street2.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="street2"
                id="street2"
                value={formData.street2.value}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md border-gray-300"
              />
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  city*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.city.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.city.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.city.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.city.note
                              ? formData.city.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="city"
                id="city"
                value={formData.city.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.city ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  State*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.state.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.state.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.state.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.state.note
                              ? formData.state.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="state"
                id="state"
                value={formData.state.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.state ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.state}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Zip Code*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.zipCode.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.zipCode.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.zipCode.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.zipCode.note
                              ? formData.zipCode.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="number"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.zipCode ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.zipCode}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="cellPhone"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Cell Phone*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.cellPhone.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.cellPhone.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.cellPhone.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.cellPhone.note
                              ? formData.cellPhone.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="cellPhone"
                id="cellPhone"
                value={formData.cellPhone.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.cellPhone
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.cellPhone && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.cellPhone}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="Email"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Email*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.Email.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.Email.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.Email.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.Email.note
                              ? formData.Email.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="email"
                required
                name="Email"
                id="Email"
                disabled={true}
                value={currentUser.email}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md text-gray-400 ${
                  errors.Email ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.Email && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.Email}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="EmergencyContact"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  EmergencyContact*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.EmergencyContact.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.EmergencyContact.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.EmergencyContact.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.EmergencyContact.note
                              ? formData.EmergencyContact.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="EmergencyContact"
                id="EmergencyContact"
                value={formData.EmergencyContact.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.EmergencyContact
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.EmergencyContact && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.EmergencyContact}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="Relationship"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  Relationship*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.Relationship.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.Relationship.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.Relationship.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.Relationship.note
                              ? formData.Relationship.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="Relationship"
                id="Relationship"
                value={formData.Relationship.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.Relationship
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.Relationship && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.Relationship}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="CDL"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  CDL*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.CDL.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.CDL.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.CDL.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.CDL.note
                              ? formData.CDL.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="CDL"
                id="CDL"
                value={formData.CDL.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDL ? "border-red-500 border-2" : "border-gray-300"
                }`}
              />
              {errors.CDL && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDL}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="CDLState"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  CDL State*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.CDLState.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.CDLState.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.CDLState.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.CDLState.note
                              ? formData.CDLState.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="CDLState"
                id="CDLState"
                value={formData.CDLState.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDLState
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.CDLState && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDLState}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex flex-row items-center gap-x-3 mb-1">
                <label
                  htmlFor="CDLClass"
                  className="block text-sm font-semibold text-gray-900 font-radios"
                >
                  CDL Class*
                </label>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex flex-row gap-x-1">
                    {formData.CDLClass.status === "rejected" ? (
                      <FaRegTimesCircle className="text-red-500" />
                    ) : formData.CDLClass.status === "approved" ? (
                      <FaRegCheckCircle className="text-green-500" />
                    ) : (
                      ""
                    )}
                  </div>
                  {formData.CDLClass.status === "rejected" ? (
                    <div
                      className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <FaPencil size={10} />
                      <p className="text-xs font-radios">View note</p>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">
                            {formData.CDLClass.note
                              ? formData.CDLClass.note
                              : "No note added"}
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <input
                type="text"
                name="CDLClass"
                id="CDLClass"
                value={formData.CDLClass.value}
                onChange={handleChange}
                className={`w-full p-2 mt-1 border rounded-md ${
                  errors.CDLClass
                    ? "border-red-500 border-2"
                    : "border-gray-300"
                }`}
              />
              {errors.CDLClass && (
                <p className="mt-1 text-[15px] font-radios text-red-500 ">
                  {errors.CDLClass}
                </p>
              )}
            </div>
          </div>

          {/* Line 9: Additional Questions */}
          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="CDLExpirationDate"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                CDL Expiration Date*
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.CDLExpirationDate.status === "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.CDLExpirationDate.status === "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.CDLExpirationDate.status === "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.CDLExpirationDate.note
                            ? formData.CDLExpirationDate.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <input
              type="date"
              name="CDLExpirationDate"
              id="CDLExpirationDate"
              value={formData.CDLExpirationDate.value}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full p-2 mt-1 border rounded-md ${
                errors.CDLExpirationDate
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
            />
            {errors.CDLExpirationDate && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.CDLExpirationDate}
              </p>
            )}
          </div>
          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="EverBeenDeniedALicense"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Have you ever been denied a license, permit or privilege to
                operate a motor vehicle?*
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.EverBeenDeniedALicense.status === "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.EverBeenDeniedALicense.status === "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.EverBeenDeniedALicense.status === "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.EverBeenDeniedALicense.note
                            ? formData.EverBeenDeniedALicense.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverBeenDeniedALicense"
                  value="yes"
                  checked={formData.EverBeenDeniedALicense?.value === "yes"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.EverBeenDeniedALicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="EverBeenDeniedALicense"
                  value="no"
                  checked={formData.EverBeenDeniedALicense?.value === "no"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.EverBeenDeniedALicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.EverBeenDeniedALicense && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.EverBeenDeniedALicense}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="PermitPrivilegeOfLicense"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Have any license, permit or privilege ever been suspended or
                revoked?
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.PermitPrivilegeOfLicense.status === "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.PermitPrivilegeOfLicense.status ===
                    "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.PermitPrivilegeOfLicense.status === "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.PermitPrivilegeOfLicense.note
                            ? formData.PermitPrivilegeOfLicense.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="PermitPrivilegeOfLicense"
                  value="yes"
                  checked={formData.PermitPrivilegeOfLicense?.value === "yes"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.PermitPrivilegeOfLicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="PermitPrivilegeOfLicense"
                  value="no"
                  checked={formData.PermitPrivilegeOfLicense?.value === "no"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.PermitPrivilegeOfLicense
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.PermitPrivilegeOfLicense && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.PermitPrivilegeOfLicense}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="TestedPositiveOrRefusedDotDrug"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Have you ever tested positive or refused a DOT drug or alcohol
                pre employment test within the past 3 years from an employer who
                did not hire you?
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.TestedPositiveOrRefusedDotDrug.status ===
                  "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.TestedPositiveOrRefusedDotDrug.status ===
                    "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.TestedPositiveOrRefusedDotDrug.status ===
                "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.TestedPositiveOrRefusedDotDrug.note
                            ? formData.TestedPositiveOrRefusedDotDrug.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="TestedPositiveOrRefusedDotDrug"
                  value="yes"
                  checked={
                    formData.TestedPositiveOrRefusedDotDrug?.value === "yes"
                  }
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.TestedPositiveOrRefusedDotDrug
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="TestedPositiveOrRefusedDotDrug"
                  value="no"
                  checked={
                    formData.TestedPositiveOrRefusedDotDrug?.value ===
                    "no".value
                  }
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.TestedPositiveOrRefusedDotDrug
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.TestedPositiveOrRefusedDotDrug && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.TestedPositiveOrRefusedDotDrug}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex flex-row items-center gap-x-3 mb-1">
              <label
                htmlFor="EverConvictedOfFelony"
                className="block text-sm font-semibold text-gray-900 font-radios"
              >
                Have you ever been convicted of a felony?*
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <div className="flex flex-row gap-x-1">
                  {formData.EverConvictedOfFelony.status === "rejected" ? (
                    <FaRegTimesCircle className="text-red-500" />
                  ) : formData.EverConvictedOfFelony.status === "approved" ? (
                    <FaRegCheckCircle className="text-green-500" />
                  ) : (
                    ""
                  )}
                </div>
                {formData.EverConvictedOfFelony.status === "rejected" ? (
                  <div
                    className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPencil size={10} />
                    <p className="text-xs font-radios">View note</p>

                    <dialog id="my_modal_1" className="modal">
                      <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">
                          {formData.EverConvictedOfFelony.note
                            ? formData.EverConvictedOfFelony.note
                            : "No note added"}
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-gray-300 text-gray-700 rounded-xl p-2.5">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="EverConvictedOfFelony"
                  value="yes"
                  checked={formData.EverConvictedOfFelony?.value === "yes"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.EverConvictedOfFelony
                      ? "border-red-500 border-2 "
                      : ""
                  }`}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="EverConvictedOfFelony"
                  value="no"
                  checked={formData.EverConvictedOfFelony?.value === "no"}
                  onChange={handleChange}
                  className={`text-blue-500 form-radio ${
                    errors.EverConvictedOfFelony
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.EverConvictedOfFelony && (
              <p className="mt-1 text-[15px] font-radios text-red-500 ">
                {errors.EverConvictedOfFelony}
              </p>
            )}
          </div>

          {/* Submit Button */}
        </form>
        <div className="flex justify-end w-full gap-x-2">
          <button
            type="submit"
            onClick={saveFormInfo}
            className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
