import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import users from "../model/Users.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { users_name, users_email, users_password, users_role } = req.body;
  try {
    const existing = await users.findOne({ where: { users_email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(users_password, 10);
    const user = await users.create({
      users_name,
      users_email,
      users_password: hashedPassword,
      users_role,
    });
    console.log("Body received:", req.body);

    const token = generateToken(user.users_id, user.users_role);
    res.status(201).json({
      user: {
        users_id: user.users_id,
        users_name: user.users_name,
        users_email: user.users_email,
        users_role: user.users_role,
        users_created_at: user.users_created_at
      },
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { users_email, users_password } = req.body;

  try {
    const user = await users.findOne({ where: { users_email, disabled: 0 } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(users_password, user.users_password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user.users_id, user.users_role);
    res.json({
      user: {
        users_id: user.users_id,
        users_name: user.users_name,
        users_email: user.users_email,
        users_role: user.users_role,
        users_created_at: user.users_created_at,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


export const getUserProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findOne({
      where: { users_id: id, disabled: 0 },
      attributes: { exclude: ["users_password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      users_id: user.users_id,
      users_name: user.users_name,
      users_email: user.users_email,
      users_role: user.users_role,
      users_created_at: user.users_created_at,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.findAll({
      attributes: { exclude: ["users_password"] },
      where: { disabled: 0 }, 
    });
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { users_name,users_email, users_password } = req.body;

  try {
    const user = await users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (users_email && user.users_email !== users_email) {
      const existing = await users.findOne({ where: { users_email } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    if (users_password) {
      user.users_password = await bcrypt.hash(users_password, 10);
    }

    user.users_name = users_name || user.users_name;
    user.users_email = users_email || user.users_email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        users_id: user.users_id,
        users_name: user.users_name,
        users_email: user.users_email,
        users_role: user.users_role,
        users_created_at: user.users_created_at
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findByPk(id);
    if (!user || user.disabled === 1) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    user.disabled = 1;
    await user.save();

    res.json({ message: "User soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};


// export const restoreUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await users.findByPk(id);
//     if (!user || user.disabled === 0) {
//       return res.status(404).json({ message: "User not found or not deleted" });
//     }

//     user.disabled = 0;
//     await user.save();

//     res.json({ message: "User restored successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to restore user", error: err.message });
//   }
// };