# Deploying the Good Morning scheduler

This is a long-running Node worker that sends a "Good morning" Telegram message
every day at **07:00 IST** (`Asia/Kolkata`). Unlike GitHub Actions cron, a
dedicated always-on host fires at the exact time.

## How it works

- `index.js` schedules the job with `node-cron` using the `Asia/Kolkata`
  timezone, so it runs at 07:00 IST regardless of the server's own timezone.
- It also starts a tiny HTTP server so the process can be deployed as a "web
  service" and pass platform health checks. Hitting `GET /send` triggers the
  message immediately (handy for testing).

## Required environment variables

| Variable              | Description                                  |
| --------------------- | -------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`  | Bot token from @BotFather                    |
| `TELEGRAM_CHAT_ID`    | Your personal chat ID (not the bot's ID)     |
| `CRON_SCHEDULE`       | Optional. Defaults to `0 7 * * *`            |
| `CRON_TIMEZONE`       | Optional. Defaults to `Asia/Kolkata`         |
| `PORT`                | Optional. Set automatically by most hosts    |

## Railway

1. Create a new project → **Deploy from GitHub repo** → pick this repo.
2. Railway auto-detects the `Dockerfile`.
3. Under **Variables**, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
4. Deploy. The service stays running and fires at 07:00 IST daily.

## Render

1. New → **Web Service** → connect this repo.
2. Environment: **Docker** (uses the `Dockerfile`).
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` under **Environment**.
4. Note: Render's *free* web services sleep after inactivity, which would stop
   the scheduler. Use a paid instance (or a Background Worker) to keep it alive
   24/7.

## Fly.io

1. `fly launch` (detects the `Dockerfile`; keep it as an always-on machine).
2. `fly secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...`
3. `fly deploy`.

## Test it

After deploying, hit the service URL with `/send`:

```
curl https://<your-service-url>/send
```

A message should arrive in Telegram immediately.
