import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import { X } from "lucide-react";
import { saveAs } from "file-saver";
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
import Page8 from "./pdf/Page8";
import Page9 from "./pdf/Page9";
import { Page10, Page11, Page12, Page13 } from "./pdf/Page10to13";
import { Page14, Page15 } from "./pdf/Page14to15";
import { Page16, Page17, Page18, Page19, Page20 } from "./pdf/Page16to20";

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

const MyDocument = ({ formData }) => (
  <Document>
    <Page1 formData={formData} />

    <Page2 formData={formData} />

    <Page3 formData={formData} />

    <Page4 formData={formData} />

    <Page5 formData={formData} />

    <Page6 formData={formData} />

    <Page7 formData={formData} />

    <Page8 formData={formData} />

    <Page9 formData={formData} />

    <Page10 formData={formData} />

    <Page11 formData={formData} />

    <Page12 formData={formData} />

    <Page13 formData={formData} />

    <Page14 formData={formData} />

    <Page15 formData={formData} />
    <Page16 />

    <Page17 />
    <Page18 />
    <Page19 />
    <Page20 formData={formData} />
  </Document>
);

const PdfModal = ({ openModal, setOpenModal, uid }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!uid) return;

      setIsLoading(true);
      try {
        const docRef = doc(db, "truck_driver_applications", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          console.log("data", data);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Error loading form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
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
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              loading...
            </div>
          ) : (
            <PDFViewer width="100%" height="100%">
              <MyDocument formData={formData} />
            </PDFViewer>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
