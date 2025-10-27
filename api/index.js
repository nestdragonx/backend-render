const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Konfigurasi Cloudinary dari environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
  res.send("✅ Backend aktif di Vercel!");
});

app.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.image;
    const result = await cloudinary.uploader.upload(fileStr, { folder: "uploads" });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ JANGAN pakai app.listen() di Vercel!
// ✅ Ganti dengan export handler:
module.exports = app;
