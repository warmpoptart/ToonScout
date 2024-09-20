import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const NAME_COMMAND = {
    name: 'name',
    type: 1, // 1 is CHAT_INPUT, or slash commands
    description: 'Print your toon name.',
    integration_types: [1],
    contexts: [0, 1, 2], // can be used in servers (0), DMs with bot (1), and other DMs (2)
}

const ALL_COMMANDS = [
  NAME_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
