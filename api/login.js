import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Ambil dari environment variables di Vercel
const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/", (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Password salah" });
  }

  // Buat token JWT berlaku 1 jam
  const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
