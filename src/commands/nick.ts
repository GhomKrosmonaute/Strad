import * as app from "../app"

import has_item from "../tables/has_item"

const command: app.Command<app.GuildMessage> = {
  name: "nick",
  description: "Change your nickname",
  guildChannelOnly: true,
  positional: [
    {
      name: "name",
      description: "New nickname",
    },
  ],
  async run(message) {
    message.delete().catch()

    const channel = app.getCommandChannel(message)

    if (!message.args.name)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Aide")
          .setDescription(
            `Changer de pseudonyme : \`Strad nick <pseudonyme>\`.\nRétablir le pseudonyme par défaut (gratuit) : \`Strad nick default\`.`
          )
          .setColor(app.NEUTRAL_BLUE)
      )

    if (message.args.name.toLowerCase() === "default") {
      await message.member.setNickname(message.author.username)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Changement de pseudonyme")
          .setDescription("Ton pseudonyme est revenu à la normale !")
          .setColor(app.NEUTRAL_BLUE)
      )
    }

    const itemId = 1
    const newNickname = message.args.name
    const username = message.author.username

    const nickItem = await has_item.query
      .select()
      .where("user_id", message.author.id)
      .and.where("item_id", itemId)
      .first()

    if (!nickItem || nickItem.amount < 1)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Boutique")
          .setDescription("Pour avoir accès à ça, fais `Strad shop` !")
          .setColor(app.SHOP)
      )

    try {
      await message.member.setNickname(newNickname)
    } catch (error) {
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Changement de pseudonyme")
          .setDescription("Je ne peux pas te mettre ce pseudonyme, désolé !")
          .setColor(app.ALERT)
      )
    }

    await has_item.query
      .update({
        amount: nickItem.amount - 1,
      })
      .where("user_id", message.author.id)
      .and.where("item_id", itemId)

    await channel.send(
      new app.MessageEmbed()
        .setTitle("Changement de pseudonyme")
        .setDescription("Génial, ta nouvelle identité est prête !")
        .setColor(app.VALID)
    )

    return app
      .getLogChannel(message)
      .send(
        new app.MessageEmbed()
          .setTitle("Changement de pseudonyme")
          .setDescription(`${username} a changé son pseudo en "${newNickname}"`)
          .setColor(app.NEUTRAL_BLUE)
      )
  },
}

module.exports = command
