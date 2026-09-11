require("dotenv").config();

const app = require("./src/app");
const { startBackupSchedule } = require("./src/db/backup");

const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.json({
    message: "CIKETTECH backend is running",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`CIKETTECH backend listening on http://localhost:${PORT}`);
});

startBackupSchedule();
