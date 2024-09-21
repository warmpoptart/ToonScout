import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import { gagTracks } from './game.js';

const INFO = {
    name: 'info',
    type: 1, // 1 is CHAT_INPUT, or slash commands
    description: 'Show your toon\'s name, laff, and location.',
    integration_types: [1],
    contexts: [0, 1, 2], // can be used in servers (0), DMs with bot (1), and other DMs (2)
}

const TASK = {
    name: 'tasks',
    type: 1, 
    description: 'Show an overview of one or all your tasks.',
    integration_types: [1],
    contexts: [0, 1, 2],
}

const GAGS = {
    name: 'gags',
    type: 1, 
    description: 'Show an overview of one or all your gags.',
    integration_types: [1],
    contexts: [0, 1, 2],
    options: [
        {
            type: 3,
            name: 'track',
            description: 'The gag track you want to show.',
            required: false,
            choices: gagTracks,
        },
    ],
}

// const BLANK = {
//     name: '',
//     type: 1, 
//     description: '',
//     integration_types: [1],
//     contexts: [0, 1, 2],
// }

const ALL_COMMANDS = [
  INFO,
  TASK,
  GAGS,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
