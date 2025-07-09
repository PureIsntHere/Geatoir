# Geatóir

A simple Discord verification bot using Linkvertise to give out a role.

## Prerequisites

- Node.js v16 or newer
- npm (comes with Node.js)
- A Discord bot token with `GUILD_MEMBERS` and `SEND_MESSAGES` permissions
- Linkvertise publisher token and code

## Installation

```bash
git clone https://github.com/yourusername/geatoir.git
cd geatoir
npm install
```

## Configuration

Open `index.js` and set the following constants at the top of the file:

```js
const DISCORD_TOKEN     = 'Bot Token Here';
const GUILD_ID          = 'Server ID Here';
const ROLE_ID           = 'Role ID Here';
const LINKVERTISE_CODE  = 1111111;
const ANTI_BYPASS_TOKEN = 'Your Anti-Bypass Token';
const LOG_CHANNEL_ID    = 'Log Channel ID';
const MESSAGE_CHANNEL_ID= 'Message Channel ID';
const BASE_URL          = 'http://localhost:3000';
```

Make sure to replace each placeholder with your actual values.

## Usage

```
node index.js
-or if you've created a start script
npm start
```

- The webserver listens on port `3000` by default.
- Static assets are served under `/assets`.
- On startup, the bot sends or updates a claim button in `MESSAGE_CHANNEL_ID`.

## Deployment

For production, use a process manager like [PM2](https://pm2.keymetrics.io/) and HTTPS either behind a reverse proxy or Cloudflare Tunnel:

```bash
npm install -g pm2
pm2 start index.js --name geatoir
```

## License

MIT
