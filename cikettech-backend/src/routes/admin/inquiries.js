const { createCrudRouter } = require("../../utils/crud");
const inquiries = require("../../data/admin/inquiries");

module.exports = createCrudRouter({ collection: "inquiries", seed: inquiries, deleteRoles: ["Administrator"] });
