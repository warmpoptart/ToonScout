import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';
import { getToonRendition } from '../utils.js';
import { getScoutToken } from '../db/scoutData/scoutService.js';
import { RacingCalculator } from 'toonapi-calculator';

const car = 'https://i.imgur.com/oOEXNMv.png';
const trophyIcon = 'https://i.imgur.com/Sl1ep8e.png';

export const data = new SlashCommandBuilder()
        .setName('race')
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
        .setColor('Gold')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle(`Racing Trophies (${getTotalEarned(toon.racing)}/30)`)
        .setThumbnail(car)
        .setDescription(getTrophies(toon.racing))
        .setFooter({ text: getLaff(toon.racing), iconURL: trophyIcon})
        .setTimestamp(item.modified)

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [embed]
        }
    });
}

function getLaff(toon) {
    const calc = new RacingCalculator(JSON.stringify(toon));
    const pts = calc.getCurrentProgress();
    return `${pts}/3 laff points earned.`;
}

function getTrophies(toon) {
    const calc = new RacingCalculator(JSON.stringify(toon));
    let trophies = calc.getBestTrophy().slice(0,5);
    trophies = trophies.map((t, index) => 
        `**${index+1}. ${t.name}**Progress: ${t.progress.current}/${t.progress.required}\n${t.progress.difference} more to go!\n`
    ).join('\n');
    return trophies !== '' ? trophies : 'You have maxed racing! Congratulations!';
}

function getTotalEarned(toon) {
    const calc = new RacingCalculator(JSON.stringify(toon));
    return calc.getTotalEarned();
}
