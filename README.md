# ToonScout

## [Suggestions or bug reports? Submit here!](https://github.com/erin-miller/ToonScout/issues)

ToonScout is a web application and Discord bot that provides advising and information for Toontown Rewritten players. ToonScout is not affiliated with Toontown Rewritten or The Walt Disney Company.

You can access ToonScout at [scouttoon.info](https://scouttoon.info).

## Support

If you have any questions or need help, please join the [ToonScout Discord server](https://discord.gg/Qb929SrdRP) and open a ticket.

# Contributing

If you would like to contribute, please ask for assignments to issues or submit a pull request.

Dev environments are set up using [Docker](https://docs.docker.com/desktop/).

Before building, you must create a `.env` file in each of `packages/api`, `packages/bot`, and `packages/webapp` by copying `example.env` to `.env` and editing as needed.

```pwsh
Copy-Item example.env .env
```

To run locally, run the following commands in the root directory:

```bash
npm install # installs dev dependencies

docker compose up --build # builds the containers for all packages
```

The web app will be available at [localhost:5000](http://localhost:5000). The Discord bot runs on port `4000` and the API runs on port `3000`.

To test Discord interactions locally, your Discord bot must allow for redirects from `localhost:5000`. This can be done in the [Discord Developer Portal](https://discord.com/developers/applications) by adding `http://localhost:5000` to the OAuth2 redirect URLs.

Furthermore, two _optional_ network tunnels are established for the webapp and bot server with Ngrok, seen at [localhost:4040](http://localhost:4040). You need a [Ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken) in `ngrok.yml` to run the tunnel.

The tunnels are especially helpful for testing Discord interactions between the webapp and the bot. Please be patient as you first enter the webapp tunnel, as Next.js has to build the app.

## Hot Reload with Docker Compose

This repo supports hot reload for both the webapp and API using Docker Compose's `develop: watch:` feature.

### Quick Start

1. **Start dev environment with hot reload:**

   ```sh
   docker compose up --watch
   ```

2. **Edit code in `packages/webapp` or `packages/api`.**
   - Changes sync automatically and trigger reloads in the containers.

**Note:** Hot reload is for development only.

---
