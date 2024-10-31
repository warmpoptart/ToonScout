import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { InteractionResponseType } from 'discord-interactions';

export const data = new SlashCommandBuilder()
        .setName('sillymeter')
        .setDescription('Get the silly meter status.')
        .setIntegrationTypes(1)
        .setContexts([0, 1, 2])

export async function execute(req, res, target) {
    const meter = await getMeter();
    const status = meter.state;
    const hp = meter.hp;
    
    const embed = new EmbedBuilder()
        .setColor('Pink')
        .setTimestamp(new Date(meter.asOf*1000))
    
    if (meter) {
        let title = '';
        if (status === 'Active') {
            title += "The Silly Meter is rising...";

            const rewardPercentages = meter.rewardPoints.map(points => {
                if (hp === 0) return 0;
                return (points / hp) * 100;
            });
            
            const rewards = meter.rewards.map((team, index) => ({
                name: `${team} (${rewardPercentages[index]}%)`,
                value: meter.rewardDescriptions[index],
                inline: false
            }));
            
            embed.setDescription(`**${meter.hp}** to go!`)
            embed.addFields(rewards);
            
        } else if (status === 'Reward') {
            title += "The Silly Meter is active!"
            
            const hp = meter.
            const rewardPercentages = meter.rewardPoints.map(points => {
                if (hp === 0) return 0;
                return (points / hp) * 100;
            });
            
            const teams = ``;
            const points = ``;
            meter.rewards.forEach((reward, index) => {
                teams += `${reward}\n`;
                points += `${rewardPercentages[index]}%\n`;
            });
            
            const end = new Date(meter.nextUpdateTimestamp*1000);
            embed.setDescription(`**${winner} won!**\nReward ends in ${end}`)
            embed.addFields(
                { name: 'Team', value: teams, inline: true},
                { name: 'Percentage', value: teams, inline: true}
            )
    
        } else if (status === 'Inactive') {
            title += "The Silly Meter is cooling down..."



        }
    } else {
        embed.addFields({ name: 'Status', value: 'The silly meter could not be found.' });
    }
    
    embed.setTitle(title);
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [embed],
        }
    });
}

async function getMeter() {
    const response = await fetch('https://www.toontownrewritten.com/api/sillymeter', {
        headers: { 'User-Agent': 'ToonScout' },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error("Could not get silly meter data.");
        return null;
    }
}