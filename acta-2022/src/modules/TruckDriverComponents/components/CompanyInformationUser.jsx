import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../../../config/firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

export default function CompanyInformationUser() {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    phoneNumber: "",
    fax: "",
    website: "",
  });
  const [companyId, setCompanyId] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const companyCollection = collection(db, "companyInfo");
    const unsubscribe = onSnapshot(companyCollection, (snapshot) => {
      if (!snapshot.empty) {
        const companyData = snapshot.docs[0].data();
        const companyId = snapshot.docs[0].id;
        setFormData({
          companyName: companyData.companyName,
          address: companyData.address,
          phoneNumber: companyData.phoneNumber,
          fax: companyData.fax,
          website: companyData.website,
        });
        setCompanyId(companyId);
        if (companyData.logoUrl) {
          setLogoPreview(companyData.logoUrl);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <h1 className="text-2xl font-bold mb-6">Company Information</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 w-full">
        {/* Logo Upload Section */}
        <div className="flex flex-col gap-y-5 items-start gap-6">
          <div className="p-6 border-1 border-gray-300 rounded-lg md:w-1/2">
            <div className="relative w-full">
              <label className="block w-full h-full cursor-default rounded-lg border-2 border-dashed border-gray-300 transition-colors">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Logo Not Available
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label htmlFor="companyName" className="block font-medium mb-2">
                Company name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                className="w-full p-2 border-1 border-gray-200 rounded bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label htmlFor="address" className="block font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                className="w-full p-2 border-1 border-gray-200 rounded bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-2">
                Phone number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                className="w-full p-2 border-1 border-gray-200 rounded bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label htmlFor="fax" className="block font-medium mb-2">
                Fax
              </label>
              <input
                type="tel"
                id="fax"
                name="fax"
                value={formData.fax}
                className="w-full p-2 border-1 border-gray-200 rounded bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label htmlFor="website" className="block font-medium mb-2">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                className="w-full p-2 border-1 border-gray-200 rounded bg-gray-100"
                disabled
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
