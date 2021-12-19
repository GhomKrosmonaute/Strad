import * as app from "../app.js"

const listener: app.Listener<"messageCreate"> = {
  event: "messageCreate",
  description: "Handle messages for Stradivarius",
  async run(message) {
    if (message.type === "CHANNEL_PINNED_MESSAGE") return message.delete()

    if (!app.isNormalMessage(message)) return
    if (!app.isGuildMessage(message)) return
    if (message.author.bot) return

    const member = await message.member.fetch()

    const sanctioned = app.getRole(message, "sanction")
    const mentor = app.getRole(message, "mentor")

    if (member.roles.cache.has(sanctioned.id)) message.delete().catch()

    if (
      message.content.match(/discord\.(me|gg)/gi) &&
      !member.roles.cache.has(mentor.id)
    ) {
      await message.delete()

      await app.sendThenDelete(
        message.channel,
        `${message.author}, la publicité pour les serveurs Discord est défendue sur Stradivarius.`
      )

      return app.getChannel(message, "log").send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Tentative de publicité")
            .setDescription(
              `${message.author} a tenté de faire sa publicité dans le salon ${message.channel}.\nContenu du message : *${message.cleanContent}*`
            )
            .setColor(app.WARNING),
        ],
      })
    }

    if (app.creationChannels.includes(message.channel.id)) {
      if (message.content.includes("[RES]")) message.pin().catch()

      if (app.containsMedia(message)) {
        await message.react("✨")
        await app.sendThenDelete(
          message.channel,
          `(Clique sur ✨ si tu souhaites recevoir un feedback)`
        )
      }
    } else if (
      message.channel.id === app.channels.beforeAfter &&
      message.attachments.size === 0
    ) {
      await member.send(
        [
          "Hey, tu ne peux poster qu'un montage de tes créations dans le salon #before-after ! :smile:",
          "Crée une image avec quelques-unes de tes premières créations avec, à côté, certaines de tes dernières !",
          "On pourra ainsi voir les progrès que tu as fait sur Stradivarius :wink:",
        ].join("\n")
      )

      message.delete().catch()
    }

    if (
      message.channel.id === app.channels.presentation &&
      member.roles.cache.has(app.roles.apprentice)
    ) {
      await member.roles.add(app.roles.waiting)
      return message.member.send(
        "Merci de t'être présenté ! Nous t'avons mis en attente. Tu auras très bientôt ta place parmi nous ! <:sdvr_heart:623611615404621874>"
      )
    }

    const content = message.cleanContent.toLowerCase()

    if (content in app.answers)
      await message.channel.send(
        app.answers[content as keyof typeof app.answers]
      )
  },
}

export default listener
