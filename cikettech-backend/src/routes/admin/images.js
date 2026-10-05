const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { createCrudRouter } = require("../../utils/crud");
const images = require("../../data/admin/images");

const uploadsDir = path.join(__dirname, "..", "..", "..", "uploads");

const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function deleteCloudinaryAsset(src) {
  try {
    const parsed = new URL(src);
    const pathname = decodeURIComponent(parsed.pathname);
    const segments = pathname.split("/upload/");
    if (segments.length !== 2) return;
    const parts = segments[1].split("/");
    if (parts[0].startsWith("v")) parts.shift();
    const publicId = parts.join("/").replace(/\.[^/.]+$/, "");
    if (publicId) {
      cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    }
  } catch {
    // ignore malformed URLs and fall through to local cleanup
  }
}

module.exports = createCrudRouter({
  collection: "images",
  seed: images,
  deleteRoles: ["Administrator"],
  afterDelete: (record) => {
    if (record?.src?.startsWith("/uploads/")) {
      fs.unlink(path.join(uploadsDir, path.basename(record.src)), () => {});
      return;
    }
    if (typeof record?.src === "string" && /https?:\/\//.test(record.src)) {
      deleteCloudinaryAsset(record.src);
    }
  },
});
