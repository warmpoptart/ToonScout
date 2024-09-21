import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
    VerifyDiscordRequest,
    LocalToonRequest,
} from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
    const { type, data, member } = req.body;

    // verification requests
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }
    
    
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        console.log(`USER [ ${member.user.username} ] RAN [ ${name} ]`);
        
        try {
            if (name === 'name') {
                const toon = await LocalToonRequest();
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: JSON.stringify(toon.toon),
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
