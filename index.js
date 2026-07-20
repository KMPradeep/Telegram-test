import http from "node:http";
import cron from "node-cron";
import { sendGoodMorning } from "./src/send-message.js";

// 7:00 AM in India Standard Time, every day. node-cron handles the timezone,
// so this fires at exactly 07:00 IST regardless of the server's own timezone.
const SCHEDULE = process.env.CRON_SCHEDULE || "0 7 * * *";
const TIMEZONE = process.env.CRON_TIMEZONE || "Asia/Kolkata";

if (!cron.validate(SCHEDULE)) {
  console.error(`Invalid CRON_SCHEDULE: "${SCHEDULE}"`);
  process.exit(1);
}

cron.schedule(
  SCHEDULE,
  async () => {
    try {
      await sendGoodMorning();
      console.log(`[${new Date().toISOString()}] Good morning message sent.`);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] ${err.message}`);
    }
  },
  { timezone: TIMEZONE }
);

console.log(`Scheduler started: "${SCHEDULE}" (${TIMEZONE}). Waiting for next run...`);

// Minimal HTTP server so the process satisfies platform health checks and can be
// deployed as a "web service" where a listening port is required (Railway/Render).
const port = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    if (req.url === "/send") {
      sendGoodMorning()
        .then(() => {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("sent\n");
        })
        .catch((err) => {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end(`${err.message}\n`);
        });
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok\n");
  })
  .listen(port, () => console.log(`Health server listening on port ${port}.`));
