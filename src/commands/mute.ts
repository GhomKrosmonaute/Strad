import * as app from "../app.js"

export default new app.Command({
  name: "mute",
  description: "Mute member",
  channelType: "guild",
  middlewares: [app.modOnly],
  positional: [
    {
      name: "target",
      castValue: "member",
      description: "Member to mute",
      required: true,
    },
    {
      name: "duration",
      description: "Duration in minutes",
      castValue: "number",
      required: true,
    },
    {
      name: "reason",
      description: "Reason of mute",
      checkValue: (value) => value.length > 10,
      required: true,
    },
  ],
  async run(message) {
    message.delete().catch()

    const role = app.getRole(message, "mute")
    const member: app.GuildMember = message.args.target
    const duration: number = message.args.duration
    const reason: string = message.args.reason

    if (duration < 1 || duration > 360)
      return app.getChannel(message, "command").send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Durée non conforme")
            .setDescription(
              "La durée doit être comprise entre 1 et 360 minutes (6 heures). Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`."
            )
            .setColor(app.ALERT),
        ],
      })

    if (reason.length < 10)
      return app.getChannel(message, "command").send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Raison insuffisante")
            .setDescription(
              "La raison doit contenir au moins 10 caractères. Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`."
            )
            .setColor(app.ALERT),
        ],
      })

    await member.roles.add(role, `${reason} • ${duration} minute(s)`)

    const embed = new app.MessageEmbed()
      .setTitle("Réduction au silence")
      .setDescription(
        `${member} a été réduit au silence pour une durée de ${duration} minute(s).\nRaison : "${reason}"`
      )
      .setColor(app.ALERT)

    await app.getChannel(message, "log").send({ embeds: [embed] })
    await app.sendThenDelete(app.getChannel(message, "command"), embed)

    setTimeout(
      (member: app.GuildMember) => {
        member.roles
          .remove(role, `Fin de la réduction au silence de ${member}.`)
          .catch()
      },
      duration * 60000,
      member
    )
  },
})
