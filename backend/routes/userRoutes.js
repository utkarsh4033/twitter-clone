import express from "express";
import {
  register,
  login,
  getUserProfileById,
  getAllUsers,
  updateUserProfile,
  deleteUser,
} from "../Controllers/userController.js";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validateInput.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/:id", protect, getUserProfileById);
router.put("/:id", protect, registerValidation, updateUserProfile);
router.delete("/:id", protect, deleteUser);
router.get("/", protect, getAllUsers);
export default router;
