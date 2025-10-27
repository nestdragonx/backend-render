import express from "express";
import cors from "cors";
import loginRoute from "./login.js";
import checkTokenRoute from "./checktoken.js";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary (kalau kamu pakai upload)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // agar bisa kirim base64 gambar

// === ROUTES LOGIN & TOKEN ===
app.use("/api/login", loginRoute);
app.use("/api/checkToken", checkTokenRoute);

// === ROUTE UPLOAD GAMBAR ===
app.post("/api/upload", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar tidak ditemukan" });

    // Upload ke Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "skb-carousel",
    });

    res.json({ success: true, url: uploadRes.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: "Gagal upload" });
  }
});

// === ROUTE DEFAULT ===
app.get("/", (req, res) => {
  res.json({ message: "Backend SKB aktif 🚀" });
});

// === EXPORT KE VERCEL ===
export default app;
