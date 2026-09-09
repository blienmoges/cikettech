const { createCrudRouter } = require("../../utils/crud");
const downloads = require("../../data/admin/downloads");

module.exports = createCrudRouter({ collection: "downloads", seed: downloads, deleteRoles: ["Administrator"] });
