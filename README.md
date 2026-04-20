# Telegram Messenger

A monorepo for a custom messenger frontend in React and backend in Nest.js using the Telegram Bot API.

## Setup

1. Install dependencies from the workspace root:
   ```bash
   npm install
   ```

2. Create a `.env` file in `server/` with your Telegram bot token:
   ```bash
   cp server/.env.example server/.env
   ```
   Then set `BOT_TOKEN`.

3. Optionally create `client/.env` from `client/.env.example` to override the backend URL:
   ```bash
   copy client\.env.example client\.env
   ```

## Development

- Start both apps together:
  ```bash
  npm run dev
  ```

- Start only the backend:
  ```bash
  npm run start:server
  ```

- Start only the frontend:
  ```bash
  npm run start:client
  ```

## How it works

- Frontend: `client/` uses Vite, React, and Axios to call the backend.
- Backend: `server/` uses Nest.js and `node-telegram-bot-api` for Telegram message delivery and incoming message polling.
- The backend exposes REST endpoints for chat summaries and chat-specific conversation history.

## Notes

- Use a valid Telegram bot token and a chat ID for a chat or user that has started the bot.
- The frontend is configured for `http://localhost:3000` by default.
