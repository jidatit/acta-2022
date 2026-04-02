import React from "react";
import {
  Document,
  StyleSheet,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import { Loader2, X } from "lucide-react";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { db, storage } from "../../../config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getBlob, ref as storageRef } from "firebase/storage";
import { resolvePdfCompany } from "./pdf/resolvePdfCompany";
import Loader from "../../SharedUiComponents/Loader";

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
import { Page21 } from "./pdf/Page21";

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

const MyDocument = ({ formData, truckDriverData, pdfCompany }) => (
  <Document>
    <Page1
      formData={formData}
      truckDriverData={truckDriverData}
      pdfCompany={pdfCompany}
    />

    <Page2 formData={formData} pdfCompany={pdfCompany} />

    <Page3 formData={formData} pdfCompany={pdfCompany} />

    <Page4 formData={formData} pdfCompany={pdfCompany} />

    <Page5 formData={formData} pdfCompany={pdfCompany} />

    <Page6 formData={formData} pdfCompany={pdfCompany} />

    <Page7 formData={formData} pdfCompany={pdfCompany} />

    <Page8 formData={formData} pdfCompany={pdfCompany} />

    <Page9 formData={formData} pdfCompany={pdfCompany} />

    <Page10 formData={formData} pdfCompany={pdfCompany} />

    <Page11 formData={formData} pdfCompany={pdfCompany} />

    <Page12 formData={formData} pdfCompany={pdfCompany} />

    <Page13 formData={formData} pdfCompany={pdfCompany} />

    <Page14 formData={formData} pdfCompany={pdfCompany} />

    <Page15 formData={formData} pdfCompany={pdfCompany} />
    <Page16 truckDriverData={truckDriverData} pdfCompany={pdfCompany} />

    <Page17 pdfCompany={pdfCompany} />
    <Page18 pdfCompany={pdfCompany} />
    <Page19 pdfCompany={pdfCompany} />
    <Page20 formData={formData} truckDriverData={truckDriverData} pdfCompany={pdfCompany} />
    <Page21 formData={formData} pdfCompany={pdfCompany} />
  </Document>
);

const PdfModal = ({ openModal, setOpenModal, uid }) => {
  const [formData, setFormData] = useState({});
  const [truckDriverData, setTruckDriverData] = useState(null); // <-- new state
  const [pdfCompany, setPdfCompany] = useState({
    name: "DriverApp",
    logoUrl: null,
    logoDataUrl: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormAndDriverData = async () => {
      // Only fetch when the modal is actually opened
      if (!openModal || !uid) return;

      setIsLoading(true);

      try {
        // companyInfo is assumed to have ONE document.
        const companySnap = await getDocs(collection(db, "companyInfo"));
        const companyDoc = companySnap.docs[0];
        const companyInfoData = companyDoc
          ? { id: companyDoc.id, ...companyDoc.data() }
          : null;

        // Step 1: Search TruckDrivers collection for matching uid
        const driversSnap = await getDocs(collection(db, "TruckDrivers"));
        const matchedDriver =
          driversSnap.docs.map((d) => d.data()).find((d) => d?.uid === uid) ||
          null;

        setTruckDriverData(matchedDriver);

        const resolved = resolvePdfCompany(companyInfoData, matchedDriver);

        // react-pdf can be strict about remote image loading.
        // So we convert the Firebase Storage object to a base64 data URL (authenticated).
        let logoDataUrl = null;
        if (resolved?.logoUrl) {
          try {
            // Extract storage object path from a download URL like:
            // https://.../o/<encodedPath>?alt=media&token=...
            const match = String(resolved.logoUrl).match(/\/o\/([^?]+)\?/);
            const encodedPath = match?.[1];
            const objectPath = encodedPath ? decodeURIComponent(encodedPath) : null;

            if (objectPath) {
              const blob = await getBlob(storageRef(storage, objectPath));
              logoDataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            } else {
              // Fallback: try remote fetch (may fail if Storage rules require auth).
              const resp = await fetch(resolved.logoUrl);
              if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
              const blob = await resp.blob();
              logoDataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            }
          } catch (e) {
            console.warn("Failed to inline logo for PDF:", e);
          }
        }

        setPdfCompany({
          ...resolved,
          logoDataUrl,
        });

        // Step 2: Fetch application form data (optional; if missing, still render with empty form)
        const appDocRef = doc(db, "truck_driver_applications", uid);
        const appSnap = await getDoc(appDocRef);
        if (appSnap.exists()) {
          setFormData(appSnap.data());
        } else {
          setFormData({});
          console.warn("Application not found for uid:", uid);
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormAndDriverData();
  }, [uid, openModal]);
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
              <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <PDFViewer width="100%" height="100%">
              <MyDocument
                formData={formData}
                truckDriverData={truckDriverData}
                pdfCompany={pdfCompany}
              />
            </PDFViewer>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
