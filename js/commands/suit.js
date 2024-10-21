import { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder 
} from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';
import { getToonRendition, getModified } from '../utils.js';
import SuitCalculator from 'toonapi-calculator/js/suits.js';

const gear = 'https://i.imgur.com/ezVOZkx.png';
const sellIcon = 'https://i.imgur.com/gGr9Mqp.png';
const cashIcon = 'https://i.imgur.com/Wo4aeDt.png';
const lawIcon = 'https://i.imgur.com/mYUrd1D.png';
const bossIcon = 'https://i.imgur.com/QrV9Zrx.png';

let footer = '';

export const data = new SlashCommandBuilder()
        .setName('suit')
        .setDescription('Find information about your cog suits.')
        .setIntegrationTypes(1)
        .setContexts([0, 1, 2])
        .addUserOption(option => 
            option.setName('user')
            .setDescription('(Optional) Get the specified user\'s toon info.')
            .setRequired(false)
        )

export async function execute(req, res, item) {
    const toon = item.data;

    const row = new ActionRowBuilder()
        .addComponents(
            getSellButton(),
            getCashButton(),
            getLawButton(),
            getBossButton()
        )

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [getHomeEmbed(toon)],
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
            case 'home':
                embed = getHomeEmbed(item);
                row = getHomeRow();
                break;
            case 'sell':
                embed = getSellEmbed(item);
                row = getSellRow();
                break;
            case 'cash':
                embed = getCashEmbed(item);
                row = getCashRow();
                break;
            case 'law':
                embed = getLawEmbed(item);
                row = getLawRow();
                break;
            case 'boss':
                embed = getBossEmbed(item);
                row = getBossRow();
                break;
            default:
                return;
        }
    } else {
        switch (customId) {
            case 'suit-home':
                embed = getHomeEmbed(item)
                row = getHomeRow()
                break;
            case 'suit-sell':
                embed = getSellEmbed(item)
                row = getSellRow()
                break;
            case 'suit-cash':
                embed = getCashEmbed(item)
                row = getCashRow()
                break;
            case 'suit-law':
                embed = getLawEmbed(item)
                row = getLawRow()
                break;
            case 'suit-boss':
                embed = getBossEmbed(item)
                row = getBossRow()
                break;
            default:
                return;
        }
    }

    return { embed, row };
}

function getBossRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('boss'),
            getHomeButton(),
            getSellButton(),
            getCashButton(),
            getLawButton()
        );
}

function getLawRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('law'),
            getHomeButton(),
            getSellButton(),
            getCashButton(),
            getBossButton()
        );
}

function getCashRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('cash'),
            getHomeButton(),
            getSellButton(),
            getLawButton(),
            getBossButton()
        );
}

function getSellRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('sell'),
            getHomeButton(),
            getCashButton(),
            getLawButton(),
            getBossButton()
        );
}

function getHomeRow() {
    return new ActionRowBuilder()
        .addComponents(
            getRefreshButton('home'),
            getSellButton(),
            getCashButton(),
            getLawButton(),
            getBossButton()
        );
}

function getHomeEmbed(item) {
    const toon = item.data;
    return new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
        .setTitle('Cog Suits')
        .setDescription('View your current suits or select department for more information.')
        .setThumbnail(gear)
        .addFields(
            { name: 'Sellbot', value: getBasicSuitInfo(toon.cogsuits, 's')},
            { name: 'Cashbot', value: getBasicSuitInfo(toon.cogsuits, 'm')},
            { name: 'Lawbot', value: getBasicSuitInfo(toon.cogsuits, 'l')},
            { name: 'Bossbot', value: getBasicSuitInfo(toon.cogsuits, 'c')},
        )
        .setTimestamp(item.modified)
}

function getSellEmbed(item) {
    const embed = getSuitEmbed(item, 'Sellbot', 's')
    return embed.setThumbnail(sellIcon);
}

function getCashEmbed(item) {
    const embed = getSuitEmbed(item, 'Cashbot', 'm');
    return embed.setThumbnail(cashIcon);
}

function getLawEmbed(item) {
    const embed = getSuitEmbed(item, 'Lawbot', 'l');
    return embed.setThumbnail(lawIcon);
}

function getBossEmbed(item) {
    const embed = getSuitEmbed(item, 'Bossbot', 'c');
    return embed.setThumbnail(bossIcon);
}

function getSuitEmbed(item, title, type) {
    const toon = item.data;
    const suit = toon.cogsuits;
    if (suit[type].hasDisguise) {
        return new EmbedBuilder()
            .setColor('Red')
            .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
            .setTitle(getBasicSuitInfo(suit, type))
            .setDescription(`${simplifyNeeded(suit, type)} to go!\nProgress: ${simplifyPromo(suit, type)}`)
            .addFields( 
                { name: 'Recommended Activities', value: getSuitPath(suit, type) },
            )
            .setFooter({ text: `The recommended activites are optional!`, iconURL: gear })
            .setTimestamp(item.modified)
    } else {
        return new EmbedBuilder()
            .setColor('Red')
            .setAuthor({ name: toon.toon.name, iconURL: getToonRendition(toon, 'laffmeter') })
            .setTitle(title)
            .setDescription(`This toon has no ${title} disguise.`)
            .setTimestamp(item.modified)
    }
}

function getHomeButton() {
    return new ButtonBuilder()
        .setCustomId('suit-home')
        .setLabel('Home')
        .setStyle('Primary')
}

function getRefreshButton(type) {
    return new ButtonBuilder()
        .setCustomId(`suit-refresh:${type}`)
        .setLabel('Refresh')
        .setStyle('Danger')
}

function getSellButton() {
    return new ButtonBuilder()
        .setCustomId('suit-sell')
        .setLabel('Sellbot')
        .setStyle('Secondary')
}

function getCashButton() {
    return new ButtonBuilder()
        .setCustomId('suit-cash')
        .setLabel('Cashbot')
        .setStyle('Secondary')
}

function getLawButton() {
    return new ButtonBuilder()
        .setCustomId('suit-law')
        .setLabel('Lawbot')
        .setStyle('Secondary')
}

function getBossButton() {
    return new ButtonBuilder()
        .setCustomId('suit-boss')
        .setLabel('Bossbot')
        .setStyle('Secondary')
}

function getSuitPath(toon, type) {
    const calc = new SuitCalculator(JSON.stringify(toon));
    const { path, total } = calc.getBestPathWeighted(type);
    let weighted = {};
    path.forEach(item => {
        weighted[item] = (weighted[item] || 0) + 1;
    })

    let result = '';
    for (const [item, count] of Object.entries(weighted)) {
        result += `(${count}) ${item}\n`;
    }
    return result + `**Estimated earnings:** ${total}`;
}

function getBasicSuitInfo(toon, type) {
    const suitType = toon[type];
    if (suitType.hasDisguise) {
        const prestige = suitType.version == 2 ? ' v2.0' : '';
        return `${suitType.suit.name}, Level ${suitType.level}${prestige}`
    }
    return 'No disguise!';
}

function simplifyPromo(toon, type) {
    const calc = new SuitCalculator(JSON.stringify(toon));
    return `${calc.getCurrent(type)} / ${calc.getTarget(type)}`;
}

function simplifyNeeded(toon, type) {
    const calc = new SuitCalculator(JSON.stringify(toon));
    return calc.getNeeded(type);
}
