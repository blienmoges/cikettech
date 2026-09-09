const { createCrudRouter } = require("../../utils/crud");
const entries = require("../../data/admin/knowledgeBase");

module.exports = createCrudRouter({ collection: "knowledgeBase", seed: entries, deleteRoles: ["Administrator"] });
