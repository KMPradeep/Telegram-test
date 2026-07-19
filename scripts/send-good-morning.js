const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variable.");
  process.exit(1);
}

const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, text: "Good morning! ☀️" }),
});

const result = await response.json();

if (!response.ok || !result.ok) {
  console.error(`Failed to send Telegram message to chat_id "${chatId}":`, result);
  process.exit(1);
}

console.log("Good morning message sent.");
