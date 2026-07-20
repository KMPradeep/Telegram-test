// Sends the good morning message to Telegram.
// Throws on any failure; the token is never included in error output.
export async function sendGoodMorning() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variable.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: "Good morning! ☀️" }),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      `Failed to send Telegram message to chat_id "${chatId}": ${JSON.stringify(result)}`
    );
  }

  return result;
}
