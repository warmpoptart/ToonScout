import 'dotenv/config';
import { verifyKey } from 'discord-interactions';
import { getFakeUsername } from './game.js';

const DEFAULT_PORT = 1547;
const MAX_PORT = 1552;
const ENDPOINT = "info.json"; 

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    console.log(signature, timestamp, clientKey);

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function LocalToonRequest() {
    let port = DEFAULT_PORT;
    let url;
    let res;

    while (port <= MAX_PORT) {
        url = `htttp://localhost:${port}/${ENDPOINT}`;

        const uniqueToken = Math.random().toString(36).substring(2);
        try {
            const response = await fetch(`http://localhost:${port}/{ENDPOINT}`, {
                headers: {
                    Host: `localhost:${port}`,
                    'User-Agent': 'LocalToon (test)',
                    Authorization: uniqueToken,
                },
            });
    
            if (res.ok) {
                // parse as JSON
                return await response.json();
            }
        } catch (error) {
            console.log(`Error making request on port ${port}:`, error);
        }
        port++;
    }
    throw new Error('Failed to connect to API server on any port');
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

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}