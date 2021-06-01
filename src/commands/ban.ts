import * as app from "../app"

module.exports = new app.Command({
  name: "ban",
  description: "Ban member",
  channelType: "guild",
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
      required: true,
    },
  ],
  async run(message) {
    await message.args.target.ban({
      reason: message.args.reason,
    })

    const embed = new app.MessageEmbed()
      .setTitle("Bannissement")
      .setDescription(
        `${message.args.target} a été banni de Stradivarius.\nRaison : "${message.args.reason}"`
      )
      .setColor(app.ALERT)

    await app.getChannel(message, "log").send(embed)
    return app.sendThenDelete(app.getChannel(message, "command"), embed)
  },
})
