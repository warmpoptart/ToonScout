import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
    VerifyDiscordRequest,
    LocalToonRequest,
    SimplifyLaff,
} from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
    const { type, data, member } = req.body;
    const user = member.user.username;

    // verification requests
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }
    
    // checking for commands
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name: command } = data;

        console.log(`USER [ ${user} ] RAN [ ${command} ]`);
        
        try {
            if (command === 'info') {
                const LOCAL_TOON = await LocalToonRequest();
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `${user}'s ${LOCAL_TOON.toon.species}, **${LOCAL_TOON.toon.name}**, 
                        has **${simplifyLaff(LOCAL_TOON)} laff** and is located in 
                        ${simplifyLocation(LOCAL_TOON)}.`,
                    },
                });
            };
        } catch (error) {
            console.error('Error fetching toon name:', error);
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Error fetching name.`,
                },
            });
        }
    }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
