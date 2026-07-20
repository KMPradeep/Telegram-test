import { sendGoodMorning } from "../src/send-message.js";

try {
  await sendGoodMorning();
  console.log("Good morning message sent.");
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
