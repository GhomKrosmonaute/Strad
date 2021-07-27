import * as app from "../app"

export default new app.Command({
  name: "kick",
  description: "Kick member",
  channelType: "guild",
  middlewares: [app.modOnly],
  positional: [
    {
      name: "target",
      castValue: "member",
      description: "Member to kick",
      required: true,
    },
    {
      name: "reason",
      description: "Reason of kick",
      checkValue: (value) => value.length > 10,
      required: true,
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

    await app.getChannel(message, "log").send(embed)
    return app.sendThenDelete(app.getChannel(message, "command"), embed)
  },
})
