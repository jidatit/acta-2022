import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { db } from "../../../../config/firebaseConfig";
import { toast } from "react-toastify";
const ApplicationForm3 = () => {
  const navigate = useNavigate();
  const { FormData3, setIsSaveClicked, currentUser, isSaveClicked } = useAuth();

  const [localFormData, setLocalFormData] = useState(FormData3);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsSaveClicked(true);
  }, []);

  useEffect(() => {
    if (FormData3) {
      setLocalFormData(FormData3);
    }
  }, [FormData3]);

  const handleBack = () => {
    if (!isSaveClicked) {
      alert("Please save the current form before going back.");
      return;
    }
    navigate("/TruckDriverLayout/ApplicationForm2");
  };

  const saveToFirebase = async () => {
    try {
      const docRef = doc(db, "truck_driver_applications", currentUser.uid);
      const docSnap = await getDoc(docRef);

      const applicationData = {
        EmploymentHistory: localFormData,
        submittedAt: new Date(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          form3: applicationData,
          completedForms: 3,
        });
      } else {
        await setDoc(docRef, {
          form3: applicationData,
          completedForms: 3,
        });
      }
    } catch (error) {
      console.error("Error saving application: ", error);
      toast.error("Error saving the application, please try again.");
    }
  };

  const validateForm = () => {
    const newErrors = localFormData.map((field) => {
      const fieldErrors = {};
      const requiredFields = [
        "companyName",
        "city",
        "zipCode",
        "contactPerson",
        "phone",
        "from",
        "to",
        "position",
        "leavingReason",
        "subjectToFMCSRs",
        "jobDesignatedAsSafetySensitive",
      ];

      requiredFields.forEach((key) => {
        if (field[key].value.trim() === "") {
          fieldErrors[key] = "This field is required";
        }
      });

      return fieldErrors;
    });

    setErrors(newErrors);
    return newErrors.every(
      (fieldErrors) => Object.keys(fieldErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaveClicked(false);

    if (validateForm()) {
      setIsSaveClicked(true);
      await saveToFirebase();
      navigate("/TruckDriverLayout/ApplicationForm4");
    } else {
      toast.error("Please complete all required fields to continue.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const isAnyFieldFilled = localFormData.some((field) =>
      Object.values(field).some((value) => value.value.trim() !== "")
    );

    if (!isAnyFieldFilled) {
      toast.error("At least one field must be filled before saving");
      return;
    }

    toast.success("Form is successfully saved");
    setIsSaveClicked(true);
    await saveToFirebase();
  };

  const handleAddCompany = () => {
    setLocalFormData([
      ...localFormData,
      {
        companyName: { value: "", status: "pending", note: "" },
        street: { value: "", status: "pending", note: "" },
        city: { value: "", status: "pending", note: "" },
        zipCode: { value: "", status: "pending", note: "" },
        contactPerson: { value: "", status: "pending", note: "" },
        phone: { value: "", status: "pending", note: "" },
        fax1: { value: "", status: "pending", note: "" },
        from: { value: "", status: "pending", note: "" },
        to: { value: "", status: "pending", note: "" },
        position: { value: "", status: "pending", note: "" },
        salary: { value: "", status: "pending", note: "" },
        leavingReason: { value: "", status: "pending", note: "" },
        subjectToFMCSRs: { value: "", status: "pending", note: "" },
        jobDesignatedAsSafetySensitive: {
          value: "",
          status: "pending",
          note: "",
        },
      },
    ]);
    setErrors([...errors, {}]); // Add an empty error object for the new company
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = localFormData.map((field, i) =>
      i === index
        ? {
            ...field,
            [name.replace(`company-${index}-`, "")]: {
              ...field[name.replace(`company-${index}-`, "")],
              value,
            },
          }
        : field
    );

    setLocalFormData(updatedFields);

    const updatedErrors = errors.map((error, i) =>
      i === index
        ? {
            ...error,
            [name.replace(`company-${index}-`, "")]:
              (name.includes("subjectToFMCSRs") ||
                name.includes("jobDesignatedAsSafetySensitive")) &&
              value.trim() === ""
                ? "This field is required"
                : "",
          }
        : error
    );

    setErrors(updatedErrors);

    const allFieldsEmpty = updatedFields.every((address) =>
      Object.values(address).every(
        (fieldValue) => fieldValue.value.trim() === ""
      )
    );
    setIsSaveClicked(allFieldsEmpty);
  };

  const removeCompany = (index) => {
    setLocalFormData(localFormData.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className=" flex flex-col items-start justify-start w-full ">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Employment History*
          </h1>
          <FaBell className="p-2 text-white bg-blue-700 rounded-md cursor-pointer text-4xl" />
        </div>
        <p className="mt-3 text-[16px] md:text-lg px-1 smd:p-0 text-justify text-black font-radios">
          *The Federal Motor Carrier Safety Regulations (49 CFR 391.21) require
          that all applicants wishing to drive a commercial vehicle list all
          employment for the last three (3) years. In addition, if you have
          driven a commercial vehicle previously, you must provide employment
          history for an additional seven (7) years (for a total of ten (10)
          years). Any gaps in employment in excess of one (1) month must be
          explained. Start with the last or current position, including any
          military experience, and work backwards(attach separate sheets if
          necessary). You are required to list the complete mailing address,
          including street number, city, state, zip; and complete all other
          information.
        </p>
      </div>

      <div className=" flex flex-col gap-y-4 flex-wrap">
        <form className="w-full bg-white shadow-md border-b-1 border-b-gray-400 pb-7">
          {Array.isArray(localFormData) &&
            localFormData.map((field, index) => (
              <div key={index} className="mb-6">
                <div className="grid w-full grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`companyName-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Company Name*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.companyName.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.companyName.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.companyName.status === "rejected" ? (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-company-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-company-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.companyName.note
                                    ? field.companyName.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      id={`companyName-${index}`}
                      value={field.companyName.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.companyName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`street-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Street*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.street.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.street.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.street.status === "rejected" ? (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-street-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-street-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.street.note
                                    ? field.street.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="street"
                      id={`street-${index}`}
                      value={field.street.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.street
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.street && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].street}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`city-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        City/State*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.city.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.city.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.city.status === "rejected" ? (
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

                            <dialog
                              id={`modal-city-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.city.note
                                    ? field.city.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="city"
                      id={`city-${index}`}
                      value={field.city.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].city}
                      </p>
                    )}
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
                          {field.zipCode.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.zipCode.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.zipCode.status === "rejected" ? (
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
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.zipCode.note
                                    ? field.zipCode.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <input
                      type="number"
                      name="zipCode"
                      id={`zipCode-${index}`}
                      value={field.zipCode.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.zipCode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.zipCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`contactPerson-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Contact Person*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.contactPerson.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.contactPerson.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.contactPerson.status === "rejected" ? (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-contactPerson-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-contactPerson-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.contactPerson.note
                                    ? field.contactPerson.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      name="contactPerson"
                      id={`contactPerson-${index}`}
                      value={field.contactPerson.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.contactPerson
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.contactPerson && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`phone-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Phone #*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.phone.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.phone.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.phone.status === "rejected" ? (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-phone-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-phone-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.phone.note
                                    ? field.phone.note
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      name="phone"
                      id={`phone-${index}`}
                      value={field.phone.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`fax1-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Fax #
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.fax1.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.fax1.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.fax1.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-fax-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog id={`modal-fax-${index}`} className="modal">
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.fax1.note
                                    ? field.fax1.note
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
                      name="fax1"
                      id={`fax1-${index}`}
                      value={field.fax1.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.fax1
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.fax1 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].fax1}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`from-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        From*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.from.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.from.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.from.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-from-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-from-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.from.note
                                    ? field.from.note
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
                      type="date"
                      name="from"
                      id={`from-${index}`}
                      min={new Date().toISOString().split("T")[0]}
                      value={field.from.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.from
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.from && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].from}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`to-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        To*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.to.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.to.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.to.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-to-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog id={`modal-to-${index}`} className="modal">
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.to.note
                                    ? field.to.note
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
                      type="date"
                      name="to"
                      id={`to-${index}`}
                      value={field.to.value}
                      onChange={(e) => handleInputChange(index, e)}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.to ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.to && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].to}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`position-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Position*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.position.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.position.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.position.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-position-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-position-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.position.note
                                    ? field.position.note
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
                      name="position"
                      id={`position-${index}`}
                      value={field.position.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.position
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.position && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].position}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`salary-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Salary*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.salary.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.salary.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.salary.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-salary-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-salary-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.salary.note
                                    ? field.salary.note
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
                      name="salary"
                      id={`salary-${index}`}
                      value={field.salary.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.salary
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.salary && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].salary}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-row items-center gap-x-3 mb-1">
                      <label
                        htmlFor={`leavingReason-${index}`}
                        className="block text-sm font-semibold text-gray-900 font-radios"
                      >
                        Reason for leaving*
                      </label>
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-row gap-x-1">
                          {field.leavingReason.status === "rejected" ? (
                            <FaRegTimesCircle className="text-red-500" />
                          ) : field.leavingReason.status === "approved" ? (
                            <FaRegCheckCircle className="text-green-500" />
                          ) : (
                            ""
                          )}
                        </div>
                        {field.leavingReason.status === "rejected" && (
                          <div
                            className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById(`modal-leavingReason-${index}`)
                                .showModal()
                            }
                          >
                            <FaPencil size={10} />
                            <p className="text-xs font-radios">View note</p>

                            <dialog
                              id={`modal-leavingReason-${index}`}
                              className="modal"
                            >
                              <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                <h3 className="font-bold text-lg">Note</h3>
                                <p className="py-4">
                                  {field.leavingReason.note
                                    ? field.leavingReason.note
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
                      name="leavingReason"
                      id={`leavingReason-${index}`}
                      value={field.leavingReason.value}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        errors[index]?.leavingReason
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[index]?.leavingReason && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[index].leavingReason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col smd:w-screen w-[90%] mb-6">
                    <div className="w-full mb-6">
                      <div className="flex flex-row items-center gap-x-3 mb-1">
                        <label
                          htmlFor={`company-${index}-subjectToFMCSRs`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Were you subject to the FMCSRs* while employed?*
                        </label>
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-row gap-x-1">
                            {field.subjectToFMCSRs.status === "rejected" ? (
                              <FaRegTimesCircle className="text-red-500" />
                            ) : field.subjectToFMCSRs.status === "approved" ? (
                              <FaRegCheckCircle className="text-green-500" />
                            ) : (
                              ""
                            )}
                          </div>
                          {field.subjectToFMCSRs.status === "rejected" && (
                            <div
                              className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                              onClick={() =>
                                document
                                  .getElementById(
                                    `modal-company-${index}-subjectToFMCSRs`
                                  )
                                  .showModal()
                              }
                            >
                              <FaPencil size={10} />
                              <p className="text-xs font-radios">View note</p>

                              <dialog
                                id={`modal-company-${index}-subjectToFMCSRs`}
                                className="modal"
                              >
                                <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                  <h3 className="font-bold text-lg">Note</h3>
                                  <p className="py-4">
                                    {field.subjectToFMCSRs.note
                                      ? field.subjectToFMCSRs.note
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
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`company-${index}-subjectToFMCSRs`}
                            value="yes"
                            checked={field.subjectToFMCSRs.value === "yes"}
                            onChange={(e) => handleInputChange(index, e)}
                            className="text-blue-500 form-radio"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            name={`company-${index}-subjectToFMCSRs`}
                            value="no"
                            checked={field.subjectToFMCSRs.value === "no"}
                            onChange={(e) => handleInputChange(index, e)}
                            className="text-blue-500 form-radio"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {errors[index]?.subjectToFMCSRs && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].subjectToFMCSRs}
                        </p>
                      )}
                    </div>

                    <div className="w-full mb-6">
                      <div className="flex flex-row items-center gap-x-3 mb-1">
                        <label
                          htmlFor={`company-${index}-jobDesignatedAsSafetySensitive`}
                          className="block text-sm font-semibold text-gray-900 font-radios"
                        >
                          Was your job designated as a safety-sensitive function
                          in any DOT-regulated mode subject to the drug and
                          alcohol testing requirements.*
                        </label>
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-row gap-x-1">
                            {field.jobDesignatedAsSafetySensitive.status ===
                            "rejected" ? (
                              <FaRegTimesCircle className="text-red-500" />
                            ) : field.jobDesignatedAsSafetySensitive.status ===
                              "approved" ? (
                              <FaRegCheckCircle className="text-green-500" />
                            ) : (
                              ""
                            )}
                          </div>
                          {field.jobDesignatedAsSafetySensitive.status ===
                            "rejected" && (
                            <div
                              className="flex flex-row gap-x-1 p-1 rounded-xl items-center bg-gray-200 border-1 border-gray-400 cursor-pointer"
                              onClick={() =>
                                document
                                  .getElementById(
                                    `modal-company-${index}-jobDesignatedAsSafetySensitive`
                                  )
                                  .showModal()
                              }
                            >
                              <FaPencil size={10} />
                              <p className="text-xs font-radios">View note</p>

                              <dialog
                                id={`modal-company-${index}-jobDesignatedAsSafetySensitive`}
                                className="modal"
                              >
                                <div className="modal-box bg-white rounded-xl shadow-lg p-4">
                                  <h3 className="font-bold text-lg">Note</h3>
                                  <p className="py-4">
                                    {field.jobDesignatedAsSafetySensitive.note
                                      ? field.jobDesignatedAsSafetySensitive
                                          .note
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
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`company-${index}-jobDesignatedAsSafetySensitive`}
                            value="yes"
                            checked={
                              field.jobDesignatedAsSafetySensitive.value ===
                              "yes"
                            }
                            onChange={(e) => handleInputChange(index, e)}
                            className="text-blue-500 form-radio"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            name={`company-${index}-jobDesignatedAsSafetySensitive`}
                            value="no"
                            checked={
                              field.jobDesignatedAsSafetySensitive.value ===
                              "no"
                            }
                            onChange={(e) => handleInputChange(index, e)}
                            className="text-blue-500 form-radio"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {errors[index]?.jobDesignatedAsSafetySensitive && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].jobDesignatedAsSafetySensitive}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center mt-4">
                      {index !== 0 && ( // Only show remove button for dynamically added fields
                        <button
                          type="button"
                          onClick={() => removeCompany(index)}
                          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="flex items-end justify-end w-full">
            <button
              type="button"
              onClick={handleAddCompany}
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add More
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
          >
            back
          </button>
          <div className="flex justify-end w-full gap-x-2">
            <button
              type="submit"
              onClick={handleSave}
              className={`px-6 py-2 font-semibold text-white bg-green-500 hover:bg-green-800 rounded-lg`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm3;
