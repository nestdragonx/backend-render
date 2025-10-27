import express from "express";
import cors from "cors";
import loginRoute from "./login.js";
import checkTokenRoute from "./checktoken.js";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary (opsional)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// === ROUTES LOGIN & TOKEN ===
// ❗ Hapus “/api” karena sudah otomatis ditangani oleh folder “api/”
app.use("/login", loginRoute);
app.use("/checkToken", checkTokenRoute);

// === ROUTE UPLOAD GAMBAR ===
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

// === ROUTE DEFAULT ===
app.get("/", (req, res) => {
  res.json({ message: "Backend SKB aktif 🚀" });
});

// === EXPORT UNTUK VERCEL ===
export default app;
