import * as app from "../app"

export function sendLog(
  client: app.Client,
  embed: app.MessageEmbed,
  color = "BLURPLE"
) {
  const logChannel = client.channels.cache.get(app.logChannel)
  if (logChannel?.isText()) logChannel.send(embed)
}

export function sendEmbedThenDelete(
  message: app.CommandMessage,
  embed: app.MessageEmbed
) {
  message.channel.send(embed).then((message) => {
    setTimeout(() => {
      message.delete().catch()
    }, 5000)
  })
  message.delete().catch()
}
