import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../../../config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

export default function CompanyInformationForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    phoneNumber: "",
    fax: "",
    website: "",
  });
  const [companyId, setCompanyId] = useState(null); // Store company document ID
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Fetch company info from Firestore
  useEffect(() => {
    const companyCollection = collection(db, "companyInfo");
    const unsubscribe = onSnapshot(companyCollection, (snapshot) => {
      if (!snapshot.empty) {
        const companyData = snapshot.docs[0].data(); // Assuming single company
        const companyId = snapshot.docs[0].id;
        setFormData({
          companyName: companyData.companyName,
          address: companyData.address,
          phoneNumber: companyData.phoneNumber,
          fax: companyData.fax,
          website: companyData.website,
        });
        setCompanyId(companyId); // Store the document ID
        if (companyData.logoUrl) {
          setLogoPreview(companyData.logoUrl);
        }
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setLogo(file);
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
      } else {
        setError("Please select an image file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Upload logo to Firebase Storage if a new logo was selected
      let logoUrl = logoPreview; // Preserve existing logo URL if no new logo is uploaded
      if (logo) {
        const storageRef = ref(
          storage,
          `company-logos/${Date.now()}-${logo.name}`
        );
        const uploadResult = await uploadBytes(storageRef, logo);
        logoUrl = await getDownloadURL(uploadResult.ref);
      }

      // Prepare company data to be saved or updated
      const companyData = {
        ...formData,
        logoUrl,
        updatedAt: serverTimestamp(),
      };

      if (companyId) {
        // Update existing company document
        await setDoc(doc(db, "companyInfo", companyId), companyData, {
          merge: true,
        });
        toast.success("Company information updated successfully!");
      } else {
        // Add new company document if none exists
        await addDoc(collection(db, "companyInfo"), {
          ...companyData,
          createdAt: serverTimestamp(),
        });
        toast.success("Company information saved successfully!");

        // Reset form after creating new entry
        setFormData({
          companyName: "",
          address: "",
          phoneNumber: "",
          fax: "",
          website: "",
        });
        setLogo(null);
        setLogoPreview(null);
      }
    } catch (err) {
      setError("Error saving company information. Please try again.");
      toast.error("Error saving company information. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Cleanup preview URL on component unmount
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <h1 className="text-2xl font-bold mb-6">Company Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Logo Upload Section */}
        <div className="p-6 border-1 border-gray-300 rounded-lg">
          <div className="relative w-32 h-32 mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer block w-full h-full rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Upload Logo
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-1 border-gray-300 rounded-lg">
          <div>
            <label htmlFor="companyName" className="block font-medium mb-2">
              Company name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
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
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
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
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
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
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
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
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white rounded hover:bg-[#353535] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
