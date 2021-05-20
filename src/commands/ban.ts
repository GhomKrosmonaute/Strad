import * as app from "../app"

const command: app.Command<app.GuildMessage> = {
  name: "ban",
  description: "Ban a member",
  guildChannelOnly: true,
  middlewares: [app.modOnly],
  positional: [
    {
      required: true,
      name: "target",
      castValue: "member",
      description: "Member to ban",
    },
    {
      name: "reason",
      description: "Reason of ban",
      checkValue: (value) => value.length > 10,
    },
  ],
  async run(message) {
    await message.args.target.ban({
      reason: message.args.reason,
    })

    return message.channel.send(
      new app.MessageEmbed()
        .setTitle("Bannissement")
        .setDescription(
          `${message.args.target} a été banni de Stradivarius.\nRaison : "${message.args.reason}"`
        )
        .setColor(app.ALERT)
    )
  },
}

module.exports = command
