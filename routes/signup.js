import bcrypt from "bcryptjs";
import { User } from "../models/user.js";


export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};
