const path = require("path");
const Database = require("better-sqlite3");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "..", "data.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

/**
 * Each "collection" is a table of (seq, id, data) rows, where `data` is a JSON blob.
 * This keeps the flexible, per-resource schemas the app already used as plain JS
 * objects/arrays, while giving them real persistence across server restarts.
 */
function ensureCollection(name) {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS "${name}" (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT UNIQUE NOT NULL,
      data TEXT NOT NULL
    )`
  ).run();
}

function seedIfEmpty(name, seedItems = [], idKey = "id") {
  ensureCollection(name);
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM "${name}"`).get();
  if (n === 0 && Array.isArray(seedItems) && seedItems.length) {
    const insert = db.prepare(`INSERT INTO "${name}" (id, data) VALUES (?, ?)`);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insert.run(String(row[idKey]), JSON.stringify(row));
    });
    insertMany(seedItems);
  }
}

module.exports = { db, ensureCollection, seedIfEmpty };
