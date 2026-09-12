require("dotenv").config();

const app = require("./src/app");
const { startBackupSchedule } = require("./src/db/backup");

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CIKETTECH backend listening on port ${PORT}`);
});

startBackupSchedule();