import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // Ambil dari Vercel ENV

router.get("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ valid: false });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false });
  }
});

export default router;
