import * as app from "../app"
import discord from "discord.js"

export function sendLog(
  client: app.Client,
  embed: app.MessageEmbed,
  color = "BLURPLE"
) {
  const logChannel = client.channels.cache.get(app.logChannel)
  if (logChannel?.isText()) logChannel.send(embed)
}

export async function sendThenDelete(
  channel: discord.TextChannel | discord.DMChannel | discord.NewsChannel,
  content: discord.MessageEmbed | string,
  timeout = 5000
) {
  return new Promise((resolve, reject) =>
    channel
      .send(content)
      .then((message) => {
        setTimeout(() => {
          message.delete().then(resolve).catch(reject)
        }, timeout)
      })
      .catch(reject)
  )
}
