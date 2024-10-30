import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';
import { getToonRendition } from '../utils.js';
import { getScoutToken } from '../db/scoutData/scoutService.js';
import { GolfCalculator } from 'toonapi-calculator';

const pencil = 'https://i.imgur.com/MEUlLCS.png';
const trophyIcon = 'https://i.imgur.com/Sl1ep8e.png';

export const data = new SlashCommandBuilder()
        .setName('golf')
        .setDescription('Get advising on what trophies to go for next.')
        .setIntegrationTypes(1)
        .setContexts([0, 1, 2])
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Optional) Get the specified user\'s toon info.')
            .setRequired(false)
        )

export async function execute(req, res, target) {
    const item = await getScoutToken(target);
    const toon = item.data;
    
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle(`Golf Trophies (${getTotalEarned(toon.golf)}/30)`)
        .setThumbnail(pencil)
        .setDescription(getTrophies(toon.golf))
        .setFooter({ text: getLaff(toon.golf), iconURL: trophyIcon})
        .setTimestamp(item.modified)

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [embed]
        }
    });
}

function getLaff(toon) {
    const calc = new GolfCalculator(JSON.stringify(toon));
    const pts = calc.getCurrentProgress();
    return `${pts}/3 laff points earned.`;
}

function getTrophies(toon) {
    if (getTotalEarned(toon) === 30) {
        return 'You have maxed golfing! Congratulations!';
    }
    const calc = new GolfCalculator(JSON.stringify(toon));
    let trophies = calc.getBestTrophy().slice(0,5);
    trophies = trophies.map((t, index) => 
        `**${index+1}. ${t.name}**Progress: ${t.progress.current}/${t.progress.required}\n${t.progress.difference} more to go!\n`
    ).join('\n');
    return trophies;
}

function getTotalEarned(toon) {
    const calc = new GolfCalculator(JSON.stringify(toon));
    return calc.getTotalEarned();
}
