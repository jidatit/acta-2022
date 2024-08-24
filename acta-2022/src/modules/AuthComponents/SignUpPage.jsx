import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import image from "../../images/Group 1000006084.png";
import bcrypt from "bcryptjs";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db, auth } from "../../config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selected, setSelected] = useState("SignUp As");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  // Step 2: Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Step 3: Handle form submission
  const RegisterUser = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match!");
      }

      const hashedPassword = bcrypt.hashSync(formData.password, 10);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let collectionName = "admin";
      // switch (selected) {
      //   case "TruckDriver":
      //     collectionName = "TruckDrivers";
      //     break;
      //   case "Admin":
      //     collectionName = "admins";
      //     break;

      //   default:
      //     throw new Error("Invalid user type selected");
      // }

      // Store additional user information in the appropriate Firestore collection
      await addDoc(collection(db, collectionName), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: hashedPassword,
        userType: "Admin",
        dateCreated: new Date(),
      });
      console.log(collectionName);
      if (collectionName !== "admin") {
        await sendEmailVerification(user);
      }

      // Clear the form fields after successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSelected("SignUp As");

      toast.success("You registered successfully!");
      if (collectionName === "admin") {
        setTimeout(() => {
          navigate("/AdminLayout");
        }, 3000);
      }
      if (collectionName !== "admin") {
        setTimeout(() => {
          navigate("/verificationPage");
        }, 3000);
      }
      // const queryCollection = async (collectionName) => {
      //   const q = query(
      //     collection(db, collectionName),
      //     where("uid", "==", user.uid)
      //   );
      //   const querySnapshot = await getDocs(q);
      //   if (!querySnapshot.empty) {
      //     return querySnapshot.docs.map((doc) => ({
      //       ...doc.data(),
      //       id: doc.id,
      //     }))[0];
      //   } else {
      //     return null;
      //   }
      // };

      // Check in "admins" collection
      // let userData = await queryCollection("admins");
      // if (userData) {
      //   setTimeout(() => {
      //     navigate("/AdminLayout");
      //   }, 3000);
      // }

      // // Check in "employees" collection
      // userData = await queryCollection("employees");
      // if (userData) {
      //   setTimeout(() => {
      //     navigate("/EmployeeLayout");
      //   }, 3000);
      // }

      // // Check in "users" collection
      // userData = await queryCollection("virtual-assistants");
      // if (userData) {
      //   setTimeout(() => {
      //     navigate("/VirtualAssistantLayout");
      //   }, 3000);
      // }
    } catch (err) {
      console.error(err);
      toast.error(`Registration failed: ${err.message}`);
    } // Log form data to the console
  };
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen p-3 bg-blue-500">
      <div className="flex flex-col gap-y-6 justify-center items-center w-[50%] h-full ">
        <h1 className="w-full text-3xl font-extrabold text-center text-white">
          LOGO
        </h1>
        <div className="flex items-center justify-center w-full">
          <img
            src={image}
            alt="......."
            className="w-[85%] object-cover mx-auto "
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

      <div className="flex flex-col gap-y-10 justify-center rounded-md items-center w-[50%] h-full bg-white">
        <h1 className="w-full text-3xl font-bold text-center text-black">
          Sign Up Your Account
        </h1>
        <form
          className="flex flex-col gap-y-5 justify-center items-center w-[80%]"
          onSubmit={RegisterUser}
        >
          <div className="flex w-full gap-x-4">
            <input
              type="text"
              id="firstName"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-blue-500 focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange} // Handle input change
              required
            />
            <input
              type="text"
              id="lastName"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-blue-500 focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange} // Handle input change
              required
            />
          </div>
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

          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="block w-full p-4 text-sm text-gray-900 bg-blue-100 rounded-lg focus:ring-blue-500 focus:border-gray-400 dark:placeholder-gray-500 dark:focus:border-gray-400 dark:shadow-sm-light"
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
              )}{" "}
              {/* Replace with eye and eye-slash icons */}
            </span>
          </div>
          <input
            type="submit"
            className="inline-block px-5 py-3 mt-3 font-medium text-white bg-indigo-600 rounded shadow-md cursor-pointer font-radios w-96 shadow-indigo-500/20 hover:bg-indigo-700"
            value={"Sign Up"}
          />
          <div className="flex flex-row items-center justify-center gap-x-1 ">
            <span className="font-radios">Already Signed Up?</span>
            <Link
              to={"/signIn"}
              className="font-bold text-blue-500 hover:text-blue-700"
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
