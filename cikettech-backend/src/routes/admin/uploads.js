const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "..", "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const allowedTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".pdf", "application/pdf"],
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.has(ext) || allowedTypes.get(ext) !== file.mimetype) {
      return cb(new Error("Only JPG, PNG, GIF, WEBP, and PDF files are allowed."));
    }
    cb(null, true);
  },
});

const router = express.Router();

function hasValidSignature(filePath, ext) {
  const bytes = fs.readFileSync(filePath).subarray(0, 12);
  if ([".jpg", ".jpeg"].includes(ext)) return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === ".png") return bytes.toString("hex") === "89504e470d0a1a0a";
  if (ext === ".gif") return bytes.toString("ascii", 0, 6) === "GIF87a" || bytes.toString("ascii", 0, 6) === "GIF89a";
  if (ext === ".webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (ext === ".pdf") return bytes.toString("ascii", 0, 5) === "%PDF-";
  return false;
}

async function scanForMalware(filePath) {
  if (!process.env.CLAMSCAN_PATH) return;
  await execFileAsync(process.env.CLAMSCAN_PATH, ["--no-summary", filePath], { timeout: 30_000 });
}

router.post("/", (req, res) => upload.single("file")(req, res, async (error) => {
  if (error) return res.status(400).json({ error: error.message });
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const ext = path.extname(req.file.originalname).toLowerCase();
  try {
    if (!hasValidSignature(req.file.path, ext)) throw new Error("The file content does not match its declared type.");
    await scanForMalware(req.file.path);
  } catch (scanError) {
    fs.rmSync(req.file.path, { force: true });
    return res.status(400).json({ error: scanError.code === "ENOENT" ? "Malware scanner is unavailable." : scanError.code === 1 || scanError.message.includes("FOUND") ? "Malware was detected." : scanError.message });
  }
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname,
    size: req.file.size,
  });
}));

module.exports = router;
