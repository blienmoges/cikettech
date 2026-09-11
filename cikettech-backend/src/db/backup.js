const fs = require("fs");
const path = require("path");
const { db } = require("./index");

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, "..", "..", "backups");
const MAX_BACKUPS = 14; // keep the last 14 (e.g. two weeks at one backup/day)

function backupDatabase() {
  // In-memory databases (used in tests) have nothing on disk to back up.
  if (db.name === ":memory:") return null;

  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const destination = path.join(BACKUP_DIR, `data-${stamp}.sqlite`);

  // better-sqlite3's backup() takes a consistent snapshot even while the
  // database is being written to (WAL mode), unlike copying the file directly.
  db.backup(destination)
    .then(() => rotateBackups())
    .catch((err) => console.error("[backup] failed:", err.message));

  return destination;
}

function rotateBackups() {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("data-") && f.endsWith(".sqlite"))
    .sort(); // ISO timestamps in the filename sort chronologically

  const excess = files.length - MAX_BACKUPS;
  if (excess > 0) {
    for (const file of files.slice(0, excess)) {
      fs.unlinkSync(path.join(BACKUP_DIR, file));
    }
  }
}

function startBackupSchedule(intervalMs = 24 * 60 * 60 * 1000) {
  if (db.name === ":memory:") return null;
  backupDatabase();
  return setInterval(backupDatabase, intervalMs);
}

module.exports = { backupDatabase, startBackupSchedule, BACKUP_DIR };
