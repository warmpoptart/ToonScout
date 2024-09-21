import 'dotenv/config';
import { verifyKey } from 'discord-interactions';

const DEFAULT_PORT = 1547;
const MAX_PORT = 1552;
const ENDPOINT = "info.json"; 
let authToken = null;
initAuthToken();

function initAuthToken() {
    if (!authToken) {
        authToken = Math.random().toString(36).substring(2);
        console.log("New session token generated.");
    }
}

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      ...options,
    });
    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      console.log(res.status);
      throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;
  }

export async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;

    try {
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}

export async function LocalToonRequest() {
    let port = DEFAULT_PORT;
    initAuthToken();
    
    while (port <= MAX_PORT) {
        const url = `http://localhost:${port}/${ENDPOINT}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Host: `localhost:${port}`,
                    'User-Agent': 'ToonScout',
                    Authorization: authToken,
                    'Connection': 'close',
                },
            });
    
            if (response.ok) {
                // parse as JSON
                return await response.json();
            } else {
                const body = await response.text();
                console.log(`Error on port ${port}: ${response.status} ${response.statusText}`, body);
            }
        } catch (error) {
            console.log(`Error making request on port ${port}:`, error);
        }
        port++
    }
    throw new Error('Failed to connect to API server on any port');
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function simplifyLaff(toon) {
    return toon.laff.max;
}

export function simplifyLocation(toon) {
    return toon.location.neighborhood;
}