import * as app from "../app"

const command: app.Command<app.GuildMessage> = {
  name: "kick",
  description: "Kick a member",
  guildChannelOnly: true,
  middlewares: [app.modOnly],
  positional: [
    {
      name: "target",
      castValue: "member",
      description: "Member to ban",
      required: true,
    },
    {
      name: "reason",
      description: "Reason of ban",
      checkValue: (value) => value.length > 10,
    },
  ],
  async run(message) {
    await message.args.target.kick({
      reason: message.args.reason,
    })

    const embed = new app.MessageEmbed()
      .setTitle("Expulsion")
      .setDescription(
        `${message.args.target} a été expulsé de Stradivarius.\nRaison : "${message.args.reason}"`
      )
      .setColor(app.ALERT)

    await app.getLogChannel(message).send(embed)
    return app.getCommandChannel(message).send(embed)
  },
}

module.exports = command
