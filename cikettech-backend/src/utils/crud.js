const express = require("express");
const { db, seedIfEmpty } = require("../db");
const { requireRole } = require("../middleware/auth");

/**
 * Builds a simple REST router (list/get/create/update/delete) backed by a SQLite
 * table, persisting across server restarts. Each record is stored as a JSON blob
 * so different resources can keep their own ad-hoc shape.
 *
 * @param {object} options
 * @param {string} options.collection - table name for this resource
 * @param {object[]} [options.seed] - initial records, inserted only if the table is empty
 * @param {string} [options.idKey="id"] - field used as the record's identifier
 * @param {(req) => object} [options.transformCreate] - builds the record to insert from the request (defaults to req.body)
 * @param {(record: object) => void} [options.afterDelete] - side effect to run after a record is removed
 * @param {string[]} [options.deleteRoles] - if set, only these roles may DELETE (requires requireAuth to have already run and set req.user)
 */
function createCrudRouter({ collection, seed = [], idKey = "id", transformCreate, afterDelete, deleteRoles }) {
  seedIfEmpty(collection, seed, idKey);

  const listStmt = db.prepare(`SELECT data FROM "${collection}" ORDER BY seq ASC`);
  const getStmt = db.prepare(`SELECT data FROM "${collection}" WHERE id = ?`);
  const idsStmt = db.prepare(`SELECT id FROM "${collection}"`);
  const insertStmt = db.prepare(`INSERT INTO "${collection}" (id, data) VALUES (?, ?)`);
  const updateStmt = db.prepare(`UPDATE "${collection}" SET data = ? WHERE id = ?`);
  const deleteStmt = db.prepare(`DELETE FROM "${collection}" WHERE id = ?`);

  function nextId() {
    const ids = idsStmt.all().map((r) => Number(r.id)).filter((n) => Number.isFinite(n));
    return String((ids.length ? Math.max(...ids) : 0) + 1);
  }

  const router = express.Router();

  router.get("/", (req, res) => {
    res.json(listStmt.all().map((row) => JSON.parse(row.data)));
  });

  router.get("/:id", (req, res) => {
    const row = getStmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: `No record found for ${idKey} "${req.params.id}"` });
    res.json(JSON.parse(row.data));
  });

  router.post("/", (req, res) => {
    const base = transformCreate ? transformCreate(req) : req.body;
    const id = base?.[idKey] || nextId();
    const record = { ...base, [idKey]: id };
    insertStmt.run(String(id), JSON.stringify(record));
    res.status(201).json(record);
  });

  function handleUpdate(req, res) {
    const row = getStmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: `No record found for ${idKey} "${req.params.id}"` });
    const existing = JSON.parse(row.data);
    const merged = { ...existing, ...req.body, [idKey]: existing[idKey] };
    updateStmt.run(JSON.stringify(merged), req.params.id);
    res.json(merged);
  }

  router.put("/:id", handleUpdate);
  router.patch("/:id", handleUpdate);

  const deleteMiddleware = deleteRoles ? [requireRole(...deleteRoles)] : [];

  router.delete("/:id", ...deleteMiddleware, (req, res) => {
    const row = getStmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: `No record found for ${idKey} "${req.params.id}"` });
    const removed = JSON.parse(row.data);
    deleteStmt.run(req.params.id);
    if (afterDelete) afterDelete(removed);
    res.json({ message: "Deleted.", removed });
  });

  return router;
}

module.exports = { createCrudRouter };
