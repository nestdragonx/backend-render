import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- ENV dari Vercel ---
const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// --- Login Route ---
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Password salah" });
  }
  const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// --- Token Check Route ---
app.get("/checkToken", (req, res) => {
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

// --- Cloudinary Upload ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

app.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar tidak ditemukan" });

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "skb-carousel",
    });

    res.json({ success: true, url: uploadRes.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: "Gagal upload" });
  }
});

// --- Root Test ---
app.get("/", (req, res) => {
  res.json({ message: "Backend SKB aktif 🚀" });
});

// --- Export ke Vercel ---
export default app;

export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Mulai server ---
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}