const { db } = require("../../db");

db.prepare(`CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, data TEXT NOT NULL)`).run();

const defaults = {
  name: "Admin User",
  email: "admin@cikettech.com",
  role: "Administrator",
  language: "English",
  emailNotifications: true,
  socialLinks: {
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  },
};

function getSettings() {
  const row = db.prepare(`SELECT data FROM settings WHERE id = 'singleton'`).get();
  if (!row) {
    db.prepare(`INSERT INTO settings (id, data) VALUES ('singleton', ?)`).run(JSON.stringify(defaults));
    return { ...defaults };
  }
  const stored = JSON.parse(row.data);
  // Merge in any default fields added after this row was first created (e.g. socialLinks).
  return { ...defaults, ...stored, socialLinks: { ...defaults.socialLinks, ...stored.socialLinks } };
}

function updateSettings(patch) {
  const current = getSettings();
  const { role, socialLinks, ...rest } = patch || {}; // role is not user-editable
  const next = {
    ...current,
    ...rest,
    socialLinks: socialLinks ? { ...current.socialLinks, ...socialLinks } : current.socialLinks,
  };
  db.prepare(`UPDATE settings SET data = ? WHERE id = 'singleton'`).run(JSON.stringify(next));
  return next;
}

module.exports = { getSettings, updateSettings };
