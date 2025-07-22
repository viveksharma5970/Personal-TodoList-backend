// routes/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/user.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ msg: "Login successful", token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
