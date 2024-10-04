import { useState } from "react";
import { TextField } from "@mui/material";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmNewPassword === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New Password should be different from the Old Password");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New Password & Confirm Password don't match");
      return;
    }

    try {
      setIsUpdating(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("No user is currently logged in.");
        setIsUpdating(false);
        return;
      }
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(
        "Failed to update password. Please check your current password and try again."
      );
    } finally {
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="flex flex-col min-h-[94.9vh] justify-center items-center overflow-x-hidden w-full gap-y-12 z-20">
      {" "}
      {/* Increase z-index to 20 */}
      <div className="w-[90%] smd:w-[80%] lg:w-[60%] flex flex-col justify-center items-center mt-8 mb-20 bg-white shadow-lg rounded-md z-10">
        {" "}
        {/* Ensure the form has a lower z-index than sidebar */}
        <ToastContainer />
        <div className="py-12 text-2xl font-semibold"> Change Password </div>
        <div className="w-[85%] lg:w-[70%] flex flex-col justify-center items-center gap-4 mb-10">
          <TextField
            id="currentpassword"
            name="currentpassword"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <TextField
            id="newpassword"
            name="newpassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            id="confirmnewpassword"
            name="confirmnewpassword"
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
          />
          <button
            className=" w-full rounded-xl cursor-pointer bg-[#4501ff] text-white font-semibold p-3"
            onClick={handleSubmit}
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
