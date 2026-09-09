const { createCrudRouter } = require("../../utils/crud");
const products = require("../../data/admin/products");

module.exports = createCrudRouter({ collection: "products", seed: products, deleteRoles: ["Administrator"] });
