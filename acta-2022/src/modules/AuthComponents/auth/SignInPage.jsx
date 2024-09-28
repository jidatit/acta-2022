import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { auth, db } from "../../../config/firebaseConfig";
import image from "../../../images/rafiki.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IoMdEye } from "react-icons/io";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaRegEyeSlash } from "react-icons/fa";
import Loader from "../../SharedUiComponents/Loader";


const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Step 3: Handle form submission
  const LoginUser = async (e) => {
    e.preventDefault();
    setLoading(true); // Prevent default form submission
    try {
      // Attempt to sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      //console.log("User signed in:", user);

      const queryCollection = async (collectionName) => {
        const q = query(
          collection(db, collectionName),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))[0];
        } else {
          return null;
        }
      };
      toast.success("You signed in successfully");
      // Check in "admins" collection
      let userData = await queryCollection("admin");
      if (userData) {
        setLoading(false); // Stop loading
        navigate("/AdminLayout");
      }

      userData = await queryCollection("TruckDrivers");
      if (userData) {
        setLoading(false); // Stop loading
        navigate("/TruckDriverLayout/applicationForm1");
      }
    } catch (error) {
      // Stop loading in case of error

      toast.error("Sign-in failed: Your Email or password is incorrect ");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center w-screen h-[93vh] ssm:h-screen p-3 bg-[#3B82F6]">
      <div className="hidden md:flex flex-col gap-y-10 justify-center items-center w-[50%] h-full ">
        <h1 className="w-full text-3xl font-extrabold text-center text-white">
          LOGO
        </h1>
        <div className="flex items-center justify-center w-full">
          <img
            src={image}
            alt="......."
            className="w-[55%] object-cover mx-auto "
          />
        </div>

        <p className="text-lg font-radios w-[80%] text-white">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
          deserunt minus beatae fuga, quidem vel animi dolorem, eaque esse hic
          dicta molestiae veritatis impedit modi ad quo quod aperiam accusantium
          cumque inventore laboriosam quam labore obcaecati. Laborum quisquam
          facere sequi?
        </p>
      </div>

      <div className="flex flex-col gap-y-10 justify-center rounded-md items-center w-[90%] md:w-[50%] h-[70%] md:h-full bg-white">
        <h1 className="w-full text-2xl md:text-3xl font-bold text-center text-black">
          Login to Your Account
        </h1>
        <form
          className="flex flex-col items-center justify-center w-[80%] md:w-[60%] gap-y-5 "
          onSubmit={LoginUser}
        >
          <input
            type="email"
            id="email"
            className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-blue-500 focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange} // Handle input change
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-blue-500 focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
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
              className="inline-block w-full px-5 py-3 mt-3 font-medium text-white bg-indigo-600 rounded shadow-md cursor-pointer font-radios shadow-indigo-500/20 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </div>

          <div className="flex flex-row items-center justify-center gap-x-1 ">
            <span className="font-radios">Already Signed In?</span>
            <Link
              to={"/signUp"}
              className="font-bold text-blue-500 hover:text-blue-700"
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
