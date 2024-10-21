import { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder 
} from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';
import FishCalculator from 'toonapi-calculator/js/fish.js';
import { getToonRendition, getModified } from '../utils.js';

const fisherman = 'https://static.toontownrewritten.wiki/uploads/e/eb/Crocodile_fishing.png';
const bucket = 'https://i.imgur.com/jpy0keb.png';
const teleport = 'https://i.imgur.com/DtJjCcH.png';
const fish = [
    'https://i.imgur.com/4XkjqzJ.png',
    'https://i.imgur.com/EiedLlg.png',
    'https://i.imgur.com/NHPl4Y9.png',
    'https://i.imgur.com/RnmDLY2.png',
    'https://i.imgur.com/a56BVTE.png',
    'https://i.imgur.com/k5Xc46Z.png',
    'https://i.imgur.com/UusWLZn.png',
    'https://i.imgur.com/QkVyni1.png',
    'https://i.imgur.com/JeaexHO.png',
    'https://i.imgur.com/ATQp9jz.png',
    'https://i.imgur.com/4Pz49Hc.png',
    'https://i.imgur.com/P93jQf5.png',
    'https://i.imgur.com/AHefykm.png',
    'https://i.imgur.com/cMBgGLz.png',
    'https://i.imgur.com/ETCwwNU.png',
]
let footer = '';

export const data = new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Get advising on catching new fish.')
        .setIntegrationTypes(1)
        .setContexts([0, 1, 2])
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Optional) Get the specified user\'s toon info.')
            .setRequired(false)
        )

export async function execute(req, res, item) {
    footer = getFooter(toon);
    const row = new ActionRowBuilder()
        .addComponents(
            getWhatButton(),
            getWhereButton()
        )
    
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [getHomeEmbed(item)],
            components: [row]
        }
    });
}

export async function handleButton(req, customId, item) {
    let embed;
    let row;

    const [, actionWithState] = customId.split('-');
    const [action, state] = actionWithState.split(':');

    if (action === 'refresh') {
        switch (state) {
            case 'where':
                embed = getWhereEmbed(item);
                row = getWhereRow();
                break;
            case 'what':
                embed = getWhatEmbed(item);
                row = getWhatRow();
                break;
            default:
                return;
        }
    } else {
        switch (customId) {
            case 'fish-home':
                embed = getHomeEmbed(item);
                row = getHomeRow();
                break;
            case 'fish-where':
                embed = getWhereEmbed(item);
                row = getWhereRow();
                break;
            case 'fish-what':
                embed = getWhatEmbed(item);
                row = getWhatRow();
                break;
            default:
                return;
        }
    }

    return { embed, row };
}

function getHomeEmbed(item) {
    const toon = item.data;
    return new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle('Welcome to the Fish Advisor!')
        .setDescription(`You have caught **${getFishCount(toon.fish)}**!`)
        .setImage(fisherman)
        .addFields(
            { name: 'What?', value: 'Find what new fish are easiest to catch!'},
            { name: 'Where?', value: 'Find what locations give you the best\nchance at catching a new fish!'},
        )
        .setFooter(footer)
        .setTimestamp(item.modified)
}

function getWhereEmbed(item) {
    const toon = item.data;
    return new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle('Where should I go?')
        .setThumbnail(teleport)
        .setDescription(getFishInfo(toon.fish, 'where'))
        .setFooter(footer)
        .setTimestamp(item.modified)
}

function getWhatEmbed(item) {
    const toon = item.data;
    return new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle('What should I catch?')
        .setThumbnail(getRandomFish())
        .setDescription(getFishInfo(toon.fish, 'what'))
        .setFooter(footer)
        .setTimestamp(item.modified)
}

function getFooter(toon) {
    return { text: `Number of buckets is an estimate. | ${getFishCount(toon.fish)}`, iconURL: bucket }
}

function getFishCount(toon) {
    const fishcalc = new FishCalculator(JSON.stringify(toon));
    const catchable = fishcalc.getCatchable().length;
    const caught = fishcalc.getCaught().length;
    return `${caught}/${catchable} fish`;
}

function getWhereButton() {
    return new ButtonBuilder()
        .setCustomId('fish-where')
        .setLabel('Where?')
        .setStyle('Secondary')
}

function getWhatButton() {
    return new ButtonBuilder()
        .setCustomId('fish-what')
        .setLabel('What?')
        .setStyle('Secondary')
}

function getHomeButton() {
    return new ButtonBuilder()
        .setCustomId('fish-home')
        .setLabel('Home')
        .setStyle('Primary')
}

function getRefreshButton(type) {
    return new ButtonBuilder()
        .setCustomId(`fish-refresh:${type}`)
        .setLabel('Refresh')
        .setStyle('Danger')
}

function getHomeRow() {
    return new ActionRowBuilder()
        .addComponents(
            getWhatButton(), 
            getWhereButton()
        )
}

function getWhatRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('what'),
            getHomeButton(), 
            getWhereButton()
        )
}

function getWhereRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('where'),
            getHomeButton(), 
            getWhatButton()
        )
}

function getRandomFish() {
    const random = Math.floor(Math.random() * fish.length);
    return fish[random];
}

function getFishInfo(toon, type) {
    const fishcalc = new FishCalculator(JSON.stringify(toon));
    let topFive;

    if (fishcalc.getNew().length == 0) {
        return `You have maxed fishing. Congratulations!`;
	}    

    if (type === 'where') {
        topFive = fishcalc.sortBestLocation().slice(0,5);
	topFive = topFive.map(([location, { total, buckets }], index) =>`**${index + 1}. **${location} (${(total*100).toFixed(2)}%)**\nBuckets: ${buckets}\n`).join('\n');
        return topFive;
    } else if (type === 'what') {
        topFive = fishcalc.sortBestRarity().slice(0,5);
        topFive = topFive.map((fish, index) => `**${index+1}. ${fish.name} (${(fish.probability*100).toFixed(2)}%)**Location: ${fish.location}\nBuckets: ${fish.buckets}\n`).join('\n');
  	return topFive;
    }
}
