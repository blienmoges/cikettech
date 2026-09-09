const { createCrudRouter } = require("../../utils/crud");
const awards = require("../../data/admin/awards");

module.exports = createCrudRouter({ collection: "awards", seed: awards, deleteRoles: ["Administrator"] });
