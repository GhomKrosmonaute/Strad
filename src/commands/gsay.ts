import * as app from "../app.js"

export default new app.Command({
  name: "gsay",
  description: "Send message in specific channel",
  channelType: "guild",
  middlewares: [app.mentorOnly],
  rest: {
    name: "content",
    description: "Content of sent message",
    required: true,
  },
  positional: [
    {
      name: "channel",
      castValue: "channel",
      description: "Target channel",
      required: true,
    },
  ],
  async run(message) {
    const CHECK_TRUE = app.emoji(message.client, "CHECK_TRUE")

    await message.args.channel.send(message.args.content)
    return message.author.send(`${CHECK_TRUE} Envoyé !`)
  },
})
