import jwt from "jsonwebtoken";

export const generateToken = (users_id, users_role) => {
  return jwt.sign({ id: users_id, role: users_role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};