// import { X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { db } from "../../../config/firebaseConfig";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   setDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";

// const PdfModal = ({ openModal, setOpenModal, uid }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 21;

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   useEffect(() => {
//     const fetchFormData = async () => {
//       if (!uid) return;

//       setIsLoading(true);
//       try {
//         console.log("entered");
//         const docRef = doc(db, "truck_driver_applications", uid);
//         const docSnap = await getDoc(docRef);
//         console.log("enteredn 1");

//         if (docSnap.exists()) {
//           console.log("enteredn 3");

//           const data = docSnap.data();
//           setFormData(data);
//         }
//       } catch (error) {
//         console.error("Error fetching form data:", error);
//         toast.error("Error loading form data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFormData();
//     console.log("formData", formData);
//   }, [uid]);
//   if (!openModal) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
//   };

//   // Format phone number to (XXX) XXX-XXXX
//   const formatPhone = (phone) => {
//     if (!phone || phone.length !== 10) return phone;
//     return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
//   };

//   return (
//     <div className="fixed inset-0 w-screen bg-[#00000015] bg-opacity-50 h-screen z-50 flex justify-center items-center overflow-hidden">
//       <div className="bg-white rounded-lg shadow-xl w-[96%] md:w-[97%] xl:w-[90%] h-[90%] mx-4 flex flex-col">
//         <div className="p-6 relative">
//           <button
//             onClick={() => setOpenModal(false)}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             aria-label="Close modal"
//           >
//             <X size={24} />
//           </button>
//           <h3 className="text-xl font-semibold">PDF Viewer</h3>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           {/* page 1 */}
//           <div className="max-w-4xl mx-auto p-4 bg-white">
//             <div className="">
//               <div className="flex items-center justify-between p-4 border-b border-gray-800 header">
//                 <div>
//                   <h1 className="font-bold">FFA Inc</h1>
//                   <p>3506 Bristol Ln, Elk Grove</p>
//                   <p>Village, IL 60007</p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
//                     <span className="text-yellow-500 font-bold">FFA</span>
//                   </div>
//                   <h2 className="text-2xl font-bold">Driver Application</h2>
//                 </div>
//               </div>

//               <div className="p-4">
//                 <p className="mb-6 text-sm">
//                   Freight For All is in compliance with Federal and State equal
//                   employment opportunity laws, qualified applicants are
//                   considered for all positions without regard to race, color,
//                   religion, sex, national origin, age, marital status and
//                   non-job related disabilities.
//                 </p>

//                 <form className="space-y-4">
//                   <div className="flex flex-col">
//                     <div className="flex mb-2">
//                       <label className="w-40">Applicant Full Name:</label>
//                       <div className="flex-1 border-b border-gray-400 px-2">
//                         {formData?.form1?.applicantName?.value}
//                       </div>
//                     </div>

//                     <div className="flex justify-between gap-8">
//                       <div className="flex w-full">
//                         <label className="w-40">Application Date:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.appliedDate?.value
//                             ? formatDate(formData?.form1?.appliedDate?.value)
//                             : ""}
//                         </div>
//                       </div>
//                       <div className="flex w-full">
//                         <label className="w-40">Position Applied For:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.positionApplied?.value}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-8">
//                     <div className="space-y-2">
//                       <div className="flex">
//                         <label className="w-40">SSN:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.ssn?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Date Of Birth:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.DOB?.value
//                             ? formatDate(formData?.form1?.DOB?.value)
//                             : ""}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Street 1:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.street1?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Street 2:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.street2?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">City:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.city11?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">State:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.state11?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Zip Code:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.zipCode11?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Cell Phone #:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.cellPhone?.value
//                             ? formatPhone(formData?.form1?.cellPhone?.value)
//                             : ""}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Emergency Contact:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.EmergencyContact?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Relationship:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.Relationship?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-40">Emergency Phone #:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2"></div>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center mb-2">
//                         <label className="w-36">Currently Employed:</label>
//                         <div className="flex gap-4 items-center">
//                           <div className="flex items-center gap-1">
//                             <span>Yes</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.currentlyEmployed?.value ===
//                                 "yes"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span>No</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.currentlyEmployed?.value ===
//                                 "no"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">
//                           If not, how long since leaving last employment?
//                         </label>
//                         <div className="flex-1 border-b border-gray-400 px-2"></div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">Who referred you?</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.referredBy?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">Rate of pay expected:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.payExpected?.value}
//                         </div>
//                       </div>

//                       <div className="my-4">
//                         <div className="flex mb-2">
//                           <label className="w-36">
//                             Do you have the legal right to work in the United
//                             States?
//                           </label>
//                           <div className="flex gap-4 items-center">
//                             <div className="flex items-center gap-1">
//                               <span>Yes</span>
//                               <div
//                                 className={`w-4 h-4 border border-black ${
//                                   formData?.form1?.legalRightToWork?.value ===
//                                   "yes"
//                                     ? "bg-black"
//                                     : ""
//                                 }`}
//                               ></div>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <span>No</span>
//                               <div
//                                 className={`w-4 h-4 border border-black ${
//                                   formData?.form1?.legalRightToWork?.value ===
//                                   "no"
//                                     ? "bg-black"
//                                     : ""
//                                 }`}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex">
//                         <label className="w-36">CDL #:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.CDL?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">CDL State:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.CDLState?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">CDL Class:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.CDLClass?.value}
//                         </div>
//                       </div>
//                       <div className="flex">
//                         <label className="w-36">CDL Expiration Date:</label>
//                         <div className="flex-1 border-b border-gray-400 px-2">
//                           {formData?.form1?.CDLExpirationDate?.value
//                             ? formatDate(
//                                 formData?.form1?.CDLExpirationDate?.value
//                               )
//                             : ""}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-8 mt-4">
//                     <div>
//                       <div className="mb-2">
//                         <p>
//                           Have you ever been denied a license, permit or
//                           privilege to operate a motor vehicle?
//                         </p>
//                         <div className="flex gap-4 items-center mt-2">
//                           <div className="flex items-center gap-1">
//                             <span>Yes</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.EverBeenDeniedALicense
//                                   ?.value === "yes"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span>No</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.EverBeenDeniedALicense
//                                   ?.value === "no"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb-2">
//                         <p>
//                           Have any license, permit or privilege ever been
//                           suspended or revoked?
//                         </p>
//                         <div className="flex gap-4 items-center mt-2">
//                           <div className="flex items-center gap-1">
//                             <span>Yes</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.PermitPrivilegeOfLicense
//                                   ?.value === "yes"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span>No</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.PermitPrivilegeOfLicense
//                                   ?.value === "no"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="mb-2">
//                         <p>
//                           Have you ever tested positive or refused a DOT drug or
//                           alcohol pre employment test within the past 3 years
//                           from an employer who did not hire you?
//                         </p>
//                         <div className="flex gap-4 items-center mt-2">
//                           <div className="flex items-center gap-1">
//                             <span>Yes</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.TestedPositiveOrRefusedDotDrug
//                                   ?.value === "yes"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span>No</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.TestedPositiveOrRefusedDotDrug
//                                   ?.value === "no"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb-2">
//                         <p>Have you ever been convicted of a felony?</p>
//                         <div className="flex gap-4 items-center mt-2">
//                           <div className="flex items-center gap-1">
//                             <span>Yes</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.EverConvictedOfFelony
//                                   ?.value === "yes"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span>No</span>
//                             <div
//                               className={`w-4 h-4 border border-black ${
//                                 formData?.form1?.EverConvictedOfFelony
//                                   ?.value === "no"
//                                   ? "bg-black"
//                                   : ""
//                               }`}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//           {/* page 2 */}
//           <div className="max-w-4xl mx-auto p-4 bg-white ">
//             <div className="">
//               <div className="flex items-center justify-between p-4 border-b border-gray-800 header">
//                 <div>
//                   <h1 className="font-bold">FFA Inc</h1>
//                   <p>3506 Bristol Ln, Elk Grove</p>
//                   <p>Village, IL 60007</p>
//                 </div>
//                 <div>
//                   <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
//                     <span className="text-yellow-500 font-bold">FFA</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4">
//                 {/* Previous Addresses Section */}
//                 <div className="mb-8">
//                   <h2 className="text-xl font-bold text-center mb-4">
//                     Previous Addresses
//                   </h2>

//                   <p className="mb-4">List all address in previous 3 years</p>

//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="border-b border-gray-800">
//                         <th className="text-left py-2">Street</th>
//                         <th className="text-left py-2">City</th>
//                         <th className="text-left py-2">State</th>
//                         <th className="text-left py-2">ZIP</th>
//                         <th className="text-left py-2">How Long</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formData?.form2?.previousAddresses?.map(
//                         (address, index) => (
//                           <tr key={index} className="border-b border-gray-400">
//                             <td className="py-2">
//                               {address?.street12?.value || ""}{" "}
//                               {address?.street22?.value
//                                 ? ", " + address.street22.value
//                                 : ""}
//                             </td>
//                             <td className="py-2">
//                               {address?.city22?.value || ""}
//                             </td>
//                             <td className="py-2">
//                               {address?.state22?.value || ""}
//                             </td>
//                             <td className="py-2">
//                               {address?.zipCode22?.value || ""}
//                             </td>
//                             <td className="py-2"></td>
//                           </tr>
//                         )
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Employment History Section */}

//                 {/* Employment History Section */}
//                 <div>
//                   <h2 className="text-xl font-bold text-center mb-4">
//                     Employment History
//                   </h2>

//                   {formData?.form3?.EmploymentHistory?.map((job, index) => (
//                     <div
//                       key={index}
//                       className="mb-8 border-b border-gray-400 pb-4"
//                     >
//                       <div className="mb-2">
//                         <p className="font-bold">Employer/Lessor</p>
//                       </div>

//                       <div className="grid grid-cols-2 gap-8">
//                         <div className="space-y-2">
//                           <div className="flex">
//                             <label className="w-32">Company Name:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.companyName31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">Street:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.street31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">City, State:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.city31?.value || ""},{" "}
//                               {job?.zipCode31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">ZIP Code:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.zipCode31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">Contact Person:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.contactPerson?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">Phone #:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.phone31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-32">FAX #:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.fax1?.value || ""}
//                             </div>
//                           </div>

//                           <div className="mt-4">
//                             <p>
//                               Were you subject to the FMCSRs* while employed?
//                             </p>
//                             <div className="flex gap-4 items-center mt-2">
//                               <div className="flex items-center gap-1">
//                                 <span>Yes</span>
//                                 <div
//                                   className={`w-4 h-4 border border-black ${
//                                     job?.subjectToFMCSRs?.value === "yes"
//                                       ? "bg-black"
//                                       : ""
//                                   }`}
//                                 ></div>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <span>No</span>
//                                 <div
//                                   className={`w-4 h-4 border border-black ${
//                                     job?.subjectToFMCSRs?.value === "no"
//                                       ? "bg-black"
//                                       : ""
//                                   }`}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex">
//                             <label className="w-24">From:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.from31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-24">To:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.to31?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-24">Position:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.position?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-24">Salary:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.salary?.value || ""}
//                             </div>
//                           </div>
//                           <div className="flex">
//                             <label className="w-24">Reason for leaving:</label>
//                             <div className="flex-1 border-b border-gray-400">
//                               {job?.leavingReason?.value || ""}
//                             </div>
//                           </div>

//                           <div className="mt-4">
//                             <p>
//                               Was your job designated as a safety-sensitive
//                               function in any DOT-regulated mode subject to the
//                               drug and alcohol testing requirements?
//                             </p>
//                             <div className="flex gap-4 items-center mt-2">
//                               <div className="flex items-center gap-1">
//                                 <span>Yes</span>
//                                 <div
//                                   className={`w-4 h-4 border border-black ${
//                                     job?.jobDesignatedAsSafetySensitive
//                                       ?.value === "yes"
//                                       ? "bg-black"
//                                       : ""
//                                   }`}
//                                 ></div>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <span>No</span>
//                                 <div
//                                   className={`w-4 h-4 border border-black ${
//                                     job?.jobDesignatedAsSafetySensitive
//                                       ?.value === "no"
//                                       ? "bg-black"
//                                       : ""
//                                   }`}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfModal;

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { X } from "lucide-react";

import { useEffect, useState } from "react";
import { db } from "../../../config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import Page1 from "./pdf/Page1";
import Page2 from "./pdf/Page2";
import Page3 from "./pdf/Page3";
import Page4 from "./pdf/Page4";
import Page5 from "./pdf/Page5";
import Page6 from "./pdf/Page6";
import Page7 from "./pdf/Page7";

// Define styles for the PDF (mimicking Tailwind CSS)
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF", // bg-white
    padding: 20, // p-5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // justify-between
    alignItems: "center", // items-center
    paddingBottom: 10, // pb-2
    borderBottom: "1px solid #1F2937", // border-b border-gray-800
    marginBottom: 20, // mb-5
  },
  headerText: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
  },
  headerSubtext: {
    fontSize: 12, // text-sm
    color: "#374151", // text-gray-700
  },
  section: {
    marginBottom: 20, // mb-5
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#D1D5DB", // border-gray-300
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB", // border-gray-300
  },
  tableCol: {
    width: "20%",
    padding: 8, // p-2
    fontSize: 12, // text-sm
  },
  tableCell: {
    margin: "auto",
    fontSize: 12, // text-sm
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // mb-2
  },
  formLabel: {
    width: 120, // w-40
    fontSize: 12, // text-sm
  },
  formValue: {
    flex: 1,
    borderBottom: "1px solid #9CA3AF", // border-b border-gray-400
    paddingLeft: 8, // pl-2
    fontSize: 12, // text-sm
  },
});

// PDF Document Component
const MyDocument = ({ formData }) => (
  <Document>
    {/* Page 1 */}

    <Page1 formData={formData} />

    {/* Page 2 */}

    <Page2 formData={formData} />

    {/* page 3 */}
    <Page3 formData={formData} />

    {/* page 4 */}
    <Page4 formData={formData} />

    {/* page 5 */}
    <Page5 formData={formData} />

    {/* page 6 */}
    <Page6 formData={formData} />

    {/* page 7 */}
    <Page7 formData={formData} />
  </Document>
);

// PDF Modal Component
const PdfModal = ({ openModal, setOpenModal, uid }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!uid) return;

      setIsLoading(true);
      try {
        console.log("entered");
        const docRef = doc(db, "truck_driver_applications", uid);
        const docSnap = await getDoc(docRef);
        console.log("enteredn 1");

        if (docSnap.exists()) {
          console.log("enteredn 3");

          const data = docSnap.data();
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Error loading form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
    console.log("formData", formData);
  }, [uid]);

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 w-screen bg-[#00000015] bg-opacity-50 h-screen z-50 flex justify-center items-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-[96%] md:w-[97%] xl:w-[90%] h-[90%] mx-4 flex flex-col">
        <div className="p-6 relative">
          <button
            onClick={() => setOpenModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <h3 className="text-xl font-semibold">PDF Viewer</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* <PDFViewer width="100%" height="100%">
            <MyDocument formData={formData} />
          </PDFViewer> */}
          <PDFViewer width="100%" height="100%">
            {isLoading ? (
              <Text>Loading PDF...</Text>
            ) : (
              <MyDocument formData={formData} />
            )}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
