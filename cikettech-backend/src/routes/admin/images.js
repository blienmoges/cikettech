const path = require("path");
const fs = require("fs");
const { createCrudRouter } = require("../../utils/crud");
const images = require("../../data/admin/images");

const uploadsDir = path.join(__dirname, "..", "..", "..", "uploads");

module.exports = createCrudRouter({
  collection: "images",
  seed: images,
  deleteRoles: ["Administrator"],
  afterDelete: (record) => {
    if (record?.src?.startsWith("/uploads/")) {
      fs.unlink(path.join(uploadsDir, path.basename(record.src)), () => {});
    }
  },
});
