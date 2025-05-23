import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { InteractionResponseType } from "discord-interactions";
import { updateHidden } from "../util/api.js";

export const data = new SlashCommandBuilder()
  .setName("hidden")
  .setDescription(
    "Toggle your information visibility. If visible, others can view your toon."
  )
  .setIntegrationTypes(1)
  .setContexts([0, 1, 2]);

export async function execute(req, res, target) {
  const hidden = await updateHidden(target);
  const embed = new EmbedBuilder()
    .setColor("White")
    .setDescription(`Your visiblity is now set to: **${hidden}**`);

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
      flags: 64,
    },
  });
}
