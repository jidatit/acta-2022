import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { auth, db } from "../../../config/firebaseConfig";
import image from "../../../images/rafiki.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IoMdEye } from "react-icons/io";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "../../SharedUiComponents/Loader";
import { Camera } from "lucide-react";

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  useEffect(() => {
    // Try to get cached data first

    const cachedLogoUrl = localStorage.getItem("companyLogo");
    const lastFetchTimestamp = localStorage.getItem("lastCompanyInfoFetch");

    if (cachedLogoUrl) {
      // setCompanyInfo(JSON.parse(cachedCompanyInfo));
      setLogoPreview(cachedLogoUrl);
    }

    // Set up real-time listener for changes
    const companyCollection = collection(db, "companyInfo");
    const unsubscribe = onSnapshot(companyCollection, (snapshot) => {
      const companyData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0]; // Getting first document

      if (companyData) {
        // Compare with cached data
        const cachedData = JSON.parse(
          localStorage.getItem("companyInfo") || "{}"
        );

        // Check if data has changed
        if (JSON.stringify(cachedData) !== JSON.stringify(companyData)) {
          // Update state
          setCompanyInfo(companyData);
          setLogoPreview(companyData.logoUrl);

          // Update cache
          // localStorage.setItem("companyInfo", JSON.stringify(companyData));
          localStorage.setItem("companyLogo", companyData.logoUrl);
          localStorage.setItem("lastCompanyInfoFetch", Date.now().toString());
        }
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, [db]);
  const refreshCache = async () => {
    const companyCollection = collection(db, "companyInfo");
    const companySnapshot = await getDocs(companyCollection);
    const companyData = companySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))[0];

    if (companyData) {
      setCompanyInfo(companyData);
      setLogoPreview(companyData.logoUrl);
      localStorage.setItem("companyInfo", JSON.stringify(companyData));
      localStorage.setItem("companyLogo", companyData.logoUrl);
      localStorage.setItem("lastCompanyInfoFetch", Date.now().toString());
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Step 2: Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const queryCollection = async (collectionName, uid) => {
    const q = query(collection(db, collectionName), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0];
    }
    return null;
  };

  // Enhanced getUserInfo function
  const getUserInfo = async (uid) => {
    if (!uid) return null;

    try {
      // Check in both collections
      const adminData = await queryCollection("admin", uid);
      if (adminData) return adminData;

      const driverData = await queryCollection("TruckDrivers", uid);
      if (driverData) return driverData;

      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  // Step 3: Handle form submission
  const LoginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First attempt authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Check if user exists in database
      const userData = await getUserInfo(user.uid);

      if (!userData) {
        // User exists in Authentication but not in database
        await auth.signOut(); // Sign out the user
        toast.error(
          "You are Blocked By Admins. Please use a different email or try logging in."
        );
        return;
      }

      // Show success message before navigation
      await toast.success("You signed in successfully", {
        duration: 2000,
        position: "top-right",
      });

      // Small delay to ensure toast is visible
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use userData instead of currentUser for navigation
      if (userData.userType === "Admin") {
        await toast.success("You signed in successfully", {
          duration: 2000,
          position: "top-right",
        });
        navigate("/AdminLayout/users");
      } else {
        await toast.success("You signed in successfully", {
          duration: 2000,
          position: "top-right",
        });
        navigate("/TruckDriverLayout/applicationForm1");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Sign-in failed: Your email or password is incorrect";

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "You are Blocked By Admins. Please use a different email or try logging in.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center w-screen h-[85vh] overflow-hidden ssm:h-screen p-3 bg-black">
      <div className="hidden md:flex flex-col gap-y-10 justify-center items-center w-[50%] h-full ">
        <div className="flex items-center justify-center w-full">
          <div className=" p-2 smd:px-3 flex items-center justify-center smd:py-2 text-lg smd:text-2xl font-bold text-black rounded-lg">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-[80%] max-h-[48vh] h-[40vh] rounded-xl text-center mx-auto object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500"> Logo</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-lg font-radios w-[80%] text-white">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
          deserunt minus beatae fuga, quidem vel animi dolorem, eaque esse hic
          dicta molestiae veritatis impedit modi ad quo quod aperiam accusantium
          cumque inventore laboriosam quam labore obcaecati. Laborum quisquam
          facere sequi?
        </p>
      </div>

      <div className="flex flex-col gap-y-10 justify-center rounded-md items-center w-[90%] md:w-[50%] h-[80%] ssm:h-[70%] md:h-full bg-white">
        <h1 className="w-full text-2xl md:text-3xl font-bold text-center text-black">
          Login
        </h1>
        <form
          className="flex flex-col items-center justify-center w-[80%] md:w-[60%] gap-y-5 "
          onSubmit={LoginUser}
        >
          <input
            type="email"
            id="email"
            className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-black focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange} // Handle input change
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-black focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute cursor-pointer right-3 top-3"
            >
              {showPassword ? (
                <FaRegEyeSlash size={25} className="text-gray-500" />
              ) : (
                <IoMdEye size={25} className="text-gray-500" />
              )}{" "}
              {/* Replace with eye and eye-slash icons */}
            </span>
          </div>
          <div className="flex flex-col w-full gap-x-1">
            <Link
              to={"/forgotPassword"}
              className="w-full text-black cursor-pointer text-end"
              // Handle forgot password navigation
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="inline-block w-full px-5 py-3 mt-3 font-medium text-white bg-black rounded shadow-md cursor-pointer font-radios hover:bg-[#353535] "
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </div>

          <div className="flex flex-row items-center justify-center gap-x-1 ">
            <span className="font-radios">Already Signed In?</span>
            <Link
              to={"/signUp"}
              className="font-bold text-black hover:text-[#272727]"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
