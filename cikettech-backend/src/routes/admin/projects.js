const { createCrudRouter } = require("../../utils/crud");
const projects = require("../../data/admin/projects");

module.exports = createCrudRouter({ collection: "projects", seed: projects, deleteRoles: ["Administrator"] });
