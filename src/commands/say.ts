import * as app from "../app"

import has_item from "../tables/has_item"

module.exports = new app.Command({
  name: "say",
  description: "The say command",
  channelType: "guild",
  rest: {
    all: true,
    name: "text",
    description: "Text to say",
    required: true,
  },
  async run(message) {
    message.delete().catch()

    const sayItem = await has_item.query
      .select()
      .where("user_id", message.author.id)
      .and.where("item_id", 2)
      .first()

    if (!sayItem || sayItem.amount < 1)
      return app
        .getCommandChannel(message)
        .send(
          new app.MessageEmbed()
            .setTitle("Boutique")
            .setDescription("Pour avoir accès à ça, fais `Strad shop` !")
            .setColor(app.SHOP)
        )

    await message.channel.send(message.args.text)

    await has_item.query
      .update({
        amount: sayItem.amount - 1,
      })
      .where("user_id", message.author.id)
      .and.where("item_id", 2)

    return app
      .getLogChannel(message)
      .send(
        new app.MessageEmbed()
          .setTitle("Strad say")
          .setDescription(
            `${message.author} a envoyé un message via Strad : "${message.args.text}"`
          )
          .setColor(app.NEUTRAL_BLUE)
      )
  },
})
