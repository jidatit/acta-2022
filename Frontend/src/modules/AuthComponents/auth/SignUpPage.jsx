import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import image from "../../../images/Group 1000006084.png";
import bcrypt from "bcryptjs";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db, auth } from "../../../config/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import Loader from "../../SharedUiComponents/Loader";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selected, setSelected] = useState("SignUp As");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    driverStatus: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyCollection = collection(db, "companyInfo");
      const companySnapshot = await getDocs(companyCollection);
      const companyData = companySnapshot.docs.map((doc) => doc.data());

      if (companyData.length > 0) {
        setCompanyInfo(companyData[0]); // Assuming you want the first document
        setLogoPreview(companyData[0].logoUrl);
      }
    };

    fetchCompanyInfo();
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const RegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        setLoading(false);
        return toast.error("Passwords do not match!");
      }

      const hashedPassword = bcrypt.hashSync(formData.password, 10);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let collectionName = "TruckDrivers";

      await addDoc(collection(db, collectionName), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        userType: "TruckDriver",
        driverStatus: "registered",
        dateCreated: new Date(),
      });

      if (collectionName !== "Admin") {
        await sendEmailVerification(user);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSelected("SignUp As");

      toast.success("You registered successfully!");
      setLoading(false);
      if (collectionName === "admin") {
        setTimeout(() => {
          navigate("/AdminLayout/users");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/verificationPage");
        }, 3000);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);

      // Check for specific Firebase error codes
      if (err.code === "auth/email-already-in-use") {
        toast.error(
          "You are Blocked By Admins. Please use a different email or try logging in."
        );
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address. Please check your email format.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };
  return (
    <div className="flex flex-row items-center justify-center w-screen h-[93vh] ssm:h-screen p-3 bg-black">
      <div className="hidden md:flex flex-col gap-y-6 justify-center items-center w-[50%] h-full">
        <div className="flex items-center justify-center w-full">
          <div className="w-full p-2 smd:px-3 flex items-center justify-center smd:py-2 text-lg smd:text-2xl font-bold text-black rounded-lg">
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

      <div className="flex flex-col gap-y-5 ssm:gap-y-10 justify-center rounded-md items-center w-[95%] md:w-[60%] h-[92%] smd:h-full bg-white ">
        <h1 className="w-full text-lg ssm:text-2xl md:text-3xl font-bold text-center text-black">
          Sign Up
        </h1>
        <form
          className="flex flex-col gap-y-3 ssm:gap-y-5 justify-center items-center w-[90%] smd:w-[80%]"
          onSubmit={RegisterUser}
        >
          <div className="flex flex-col w-full gap-4 md:flex-row">
            <input
              type="text"
              id="name"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-black focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
              placeholder="username"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="email"
            id="email"
            className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-black focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
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
              )}
            </span>
          </div>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-black focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute cursor-pointer right-3 top-3"
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash size={25} className="text-gray-500" />
              ) : (
                <IoMdEye size={25} className="text-gray-500" />
              )}
            </span>
          </div>
          <button
            type="submit"
            className="inline-block w-full px-5 py-3 mt-3 font-medium text-white bg-black rounded shadow-md cursor-pointer font-radios hover:bg-[#272727]"
            disabled={loading}
          >
            {loading ? <Loader /> : "Sign Up"}
          </button>

          <div className="flex flex-row items-center justify-center gap-x-1">
            <span className="font-radios">Already Signed Up?</span>
            <Link
              to="/signIn"
              className="font-bold text-black hover:text-black"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
