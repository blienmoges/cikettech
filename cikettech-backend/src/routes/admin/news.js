const { createCrudRouter } = require("../../utils/crud");
const news = require("../../data/admin/news");

module.exports = createCrudRouter({ collection: "news", seed: news, deleteRoles: ["Administrator"] });
