import express from "express";
import {
  blockUser,
  createUser,
  deleteUser,
  UnblockUser,
} from "../Controllers/Admin-Controllers.js";

const AdminRoutes = express.Router();

AdminRoutes.post("/createUser", createUser);
AdminRoutes.post("/blockUser", blockUser);
AdminRoutes.post("/UnblockUser", UnblockUser);
AdminRoutes.delete("/deleteUser", deleteUser);
export default AdminRoutes;
