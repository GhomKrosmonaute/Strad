import discord from "discord.js"

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

export function containsMedia(message: discord.Message) {
  const mContent = message.content.toUpperCase()
  return (
    (message.attachments.size !== 0 || mContent.includes("HTTP")) &&
    !mContent.includes("[PARTAGE]") &&
    !mContent.includes("[RES]") &&
    !mContent.includes("GIPHY.COM") &&
    !mContent.includes("TENOR.COM")
  )
}
