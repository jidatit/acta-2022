import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useState, useRef } from "react";
import { db, storage } from "../../../config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Camera, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CompanyInformationForm() {
  const [mainFormData, setMainFormData] = useState({
    id: null, // Add ID to main form data
    companyName: "",
    address: "",
    phoneNumber: "",
    fax: "",
    website: "",
  });

  const [additionalForms, setAdditionalForms] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [mainLogo, setMainLogo] = useState(null);
  const [mainLogoPreview, setMainLogoPreview] = useState(null);
  const [additionalLogos, setAdditionalLogos] = useState({});
  const [additionalLogoPreviews, setAdditionalLogoPreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isInitialMount = useRef(true);

  // Generate unique ID for main company if it doesn't exist
  const generateMainCompanyId = useCallback(() => {
    if (!mainFormData.id) {
      const newId = `main_company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setMainFormData((prev) => ({
        ...prev,
        id: newId,
      }));
      return newId;
    }
    return mainFormData.id;
  }, [mainFormData.id]);

  // Fetch company info from Firestore
  useEffect(() => {
    const companyCollection = collection(db, "companyInfo");
    const unsubscribe = onSnapshot(companyCollection, (snapshot) => {
      if (!snapshot.empty) {
        const companyData = snapshot.docs[0].data();
        const companyId = snapshot.docs[0].id;

        // Only set data on initial mount to prevent interference with user input
        if (isInitialMount.current) {
          // Set main company data with ID
          setMainFormData({
            id:
              companyData.id ||
              `main_company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            companyName: companyData.companyName || "",
            address: companyData.address || "",
            phoneNumber: companyData.phoneNumber || "",
            fax: companyData.fax || "",
            website: companyData.website || "",
          });

          setCompanyId(companyId);

          if (companyData.logoUrl) {
            setMainLogoPreview(companyData.logoUrl);
          }

          // Set additional companies data
          if (
            companyData.additionalCompanies &&
            Array.isArray(companyData.additionalCompanies)
          ) {
            // Add unique IDs to additional companies if they don't have them
            const companiesWithIds = companyData.additionalCompanies.map(
              (company, index) => ({
                ...company,
                id: company.id || `company_${Date.now()}_${index}`,
              })
            );
            setAdditionalForms(companiesWithIds);

            // Set logo previews for additional companies
            const previews = {};
            companiesWithIds.forEach((company) => {
              if (company.logoUrl) {
                previews[company.id] = company.logoUrl;
              }
            });
            setAdditionalLogoPreviews(previews);
          }

          isInitialMount.current = false;
        }
      } else {
        // If no company exists, generate ID for main company
        if (isInitialMount.current && !mainFormData.id) {
          generateMainCompanyId();
          isInitialMount.current = false;
        }
      }
    });

    return () => unsubscribe();
  }, [mainFormData.id, generateMainCompanyId]);

  const handleMainInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setMainFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Fixed function to prevent focus loss - using company ID instead of index
  const handleAdditionalInputChange = useCallback((companyId, field, value) => {
    setAdditionalForms((prev) => {
      return prev.map((company) =>
        company.id === companyId ? { ...company, [field]: value } : company
      );
    });
  }, []);

  const handleMainLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setMainLogo(file);
        const previewUrl = URL.createObjectURL(file);
        setMainLogoPreview(previewUrl);
      } else {
        setError("Please select an image file");
      }
    }
  }, []);

  const handleAdditionalLogoChange = useCallback((companyId, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setAdditionalLogos((prev) => ({
          ...prev,
          [companyId]: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setAdditionalLogoPreviews((prev) => ({
          ...prev,
          [companyId]: previewUrl,
        }));
      } else {
        setError("Please select an image file");
      }
    }
  }, []);

  const addMoreCompany = useCallback(() => {
    const newCompanyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setAdditionalForms((prev) => [
      ...prev,
      {
        id: newCompanyId,
        companyName: "",
      },
    ]);
  }, []);

  const removeCompany = useCallback((companyId) => {
    setAdditionalForms((prev) =>
      prev.filter((company) => company.id !== companyId)
    );

    // Clean up logos and previews using company ID
    setAdditionalLogos((prev) => {
      const updated = { ...prev };
      delete updated[companyId];
      return updated;
    });

    setAdditionalLogoPreviews((prev) => {
      const updated = { ...prev };
      delete updated[companyId];
      return updated;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Ensure main company has an ID
      const mainCompanyId = mainFormData.id || generateMainCompanyId();

      // Upload main logo if new one selected
      let mainLogoUrl = mainLogoPreview;
      if (mainLogo) {
        const storageRef = ref(
          storage,
          `company-logos/main-${mainCompanyId}-${Date.now()}-${mainLogo.name}`
        );
        const uploadResult = await uploadBytes(storageRef, mainLogo);
        mainLogoUrl = await getDownloadURL(uploadResult.ref);
      }

      // Upload additional logos and prepare additional companies data
      const processedAdditionalCompanies = await Promise.all(
        additionalForms.map(async (company) => {
          let logoUrl = additionalLogoPreviews[company.id] || null;

          if (additionalLogos[company.id]) {
            const storageRef = ref(
              storage,
              `company-logos/additional-${company.id}-${Date.now()}-${additionalLogos[company.id].name}`
            );
            const uploadResult = await uploadBytes(
              storageRef,
              additionalLogos[company.id]
            );
            logoUrl = await getDownloadURL(uploadResult.ref);
          }

          return {
            ...company,
            logoUrl,
          };
        })
      );

      // Prepare complete company data with main company ID
      const companyData = {
        id: mainCompanyId, // Include ID in the saved data
        companyName: mainFormData.companyName,
        address: mainFormData.address,
        phoneNumber: mainFormData.phoneNumber,
        fax: mainFormData.fax,
        website: mainFormData.website,
        logoUrl: mainLogoUrl,
        additionalCompanies: processedAdditionalCompanies,
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
      }
    } catch (err) {
      setError("Error saving company information. Please try again.");
      toast.error("Error saving company information. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 pr-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Company Information</h1>
        <button
          type="button"
          onClick={addMoreCompany}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-[#353535]"
        >
          <Plus className="w-4 h-4" />
          Add More Company ({additionalForms.length})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* Main Company Form */}
        <MainCompanyFormSection
          formData={mainFormData}
          onInputChange={handleMainInputChange}
          logoPreview={mainLogoPreview}
          onLogoChange={handleMainLogoChange}
        />

        {/* Additional Company Forms */}
        {additionalForms.map((formData, index) => (
          <AdditionalCompanyFormSection
            key={formData.id}
            formData={formData}
            onInputChange={handleAdditionalInputChange}
            logoPreview={additionalLogoPreviews[formData.id]}
            onLogoChange={handleAdditionalLogoChange}
            index={index}
            onRemove={removeCompany}
          />
        ))}

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

// Separate component for main company form to prevent re-renders
const MainCompanyFormSection = ({
  formData,
  onInputChange,
  logoPreview,
  onLogoChange,
}) => (
  <div className="p-6 border-1 border-gray-300 rounded-lg">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Main Company Information</h3>
    </div>

    {/* Logo Upload Section */}
    <div className="mb-6">
      <div className="relative w-32 h-32 mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={onLogoChange}
          className="hidden"
          id="logo-upload-main"
        />
        <label
          htmlFor="logo-upload-main"
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
              <span className="mt-2 text-sm text-gray-500">Upload Logo</span>
            </div>
          )}
        </label>
      </div>
    </div>

    {/* Form Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium mb-2">Company name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={onInputChange}
          className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Phone number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onInputChange}
          className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Fax</label>
        <input
          type="tel"
          name="fax"
          value={formData.fax}
          onChange={onInputChange}
          className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium mb-2">Website</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={onInputChange}
          className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>
    </div>
  </div>
);

// Separate component for additional company forms to prevent re-renders
const AdditionalCompanyFormSection = ({
  formData,
  onInputChange,
  logoPreview,
  onLogoChange,
  index,
  onRemove,
}) => {
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onInputChange(formData.id, name, value);
    },
    [formData.id, onInputChange]
  );

  const handleLogoChange = useCallback(
    (e) => {
      onLogoChange(formData.id, e);
    },
    [formData.id, onLogoChange]
  );

  const handleRemove = useCallback(() => {
    onRemove(formData.id);
  }, [formData.id, onRemove]);

  return (
    <div className="p-6 border-1 border-gray-300 rounded-lg w-[60%]">
      <div className="flex justify-between items-center mb-4 ">
        <h3 className="text-lg font-semibold">
          Additional Company Information {index + 1}
        </h3>
        <button
          type="button"
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 p-2"
          title="Remove Company"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Logo Upload Section */}
      <div className="flex justify-between w-full">
        <div className=" w-[50%] ">
          <div className="mt-2">
            <label className="block font-medium mb-2">Company name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleInputChange}
              className="w-full p-2 border-1 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="relative w-32 h-32 mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id={`logo-upload-${formData.id}`}
            />
            <label
              htmlFor={`logo-upload-${formData.id}`}
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
      </div>
    </div>
  );
};
