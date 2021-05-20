import Discord from "discord.js"
import * as command from "../app/command"

import guilds from "../tables/guilds.native"

export async function prefix(guild?: Discord.Guild): Promise<string> {
  let prefix = process.env.BOT_PREFIX as string
  if (guild) {
    const guildData = await guilds.query
      .where("id", guild.id)
      .select("prefix")
      .first()
    if (guildData) {
      return guildData.prefix ?? prefix
    }
  }
  return prefix
}

export const modOnly: command.Middleware<command.GuildMessage> = (message) => {
  return (
    message.member.roles.cache.some((role) => role.name === "Modérateur") ||
    "You must be a moderator!"
  )
}
