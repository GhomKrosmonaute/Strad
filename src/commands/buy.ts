import * as app from "../app"

import users from "../tables/users"
import items from "../tables/items"
import has_item from "../tables/has_item"

export default new app.Command({
  name: "buy",
  description: "Buy article",
  channelType: "guild",
  positional: [
    {
      name: "choice",
      description: "Index of article",
      castValue: "number",
      required: true,
    },
  ],
  async run(message) {
    message.delete().catch()

    const BLOCK = app.emoji(message.client, "BLOCK")

    const channel = app.getChannel(message, "command")

    const result = await users.query
      .select("money")
      .where("id", message.author.id)
      .first()

    const item = await items.query
      .select()
      .where("id", message.args.choice)
      .first()

    const money = result?.money ?? 0

    if (!item)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Achat impossible")
          .setDescription("Cet article est introuvable.")
          .setColor(app.ALERT)
      )

    const priceAfterDiscount = Math.round(
      item.price - item.price * (item.discount / 100)
    )

    if (!item.is_buyable)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Achat impossible")
          .setDescription("Cet article n'est pas à vendre.")
          .setColor(app.ALERT)
      )

    if (item.quantity >= 0 && item.quantity < item.buy_amount)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Achat impossible")
          .setDescription(
            `Il ne reste plus assez de stocks pour acheter **${item.buy_amount} x ${item.name}**.`
          )
          .setColor(app.ALERT)
      )

    if (money < priceAfterDiscount)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Achat impossible")
          .setDescription(
            `Tu n'as pas assez d'argent pour acheter **${item.buy_amount} x ${
              item.name
            }**. Il te manque encore ${priceAfterDiscount - money} ${BLOCK} !`
          )
          .setColor(app.ALERT)
      )

    // Demande de confirmation

    await channel.send(
      new app.MessageEmbed()
        .setTitle("Confirmation d'achat")
        .setDescription(
          `${message.member}, acheter **${item.buy_amount} x ${item.name}** pour **${priceAfterDiscount}** ${BLOCK} ?`
        )
        .setColor(app.SHOP)
        .setFooter('Envoie "Oui" ou "Non"')
    )

    app.onceMessage(message.member, async (message) => {
      message.delete().catch()

      if (message.content.toLowerCase() !== "oui")
        return channel.send(
          new app.MessageEmbed()
            .setTitle("Achat annulé")
            .setDescription("La transaction a été annulée.")
            .setColor(app.ALERT)
        )

      // Prélèvement de l'argent sur le compte de l'utilisateur
      await users.query
        .update({
          money: money - priceAfterDiscount,
        })
        .where("id", message.author.id)

      const has = await has_item.query
        .select()
        .where("user_id", message.author.id)
        .and.where("item_id", item.id)
        .first()

      await (has
        ? has_item.query
            .update({
              amount: has.amount + item.buy_amount,
            })
            .where("user_id", message.author.id)
            .and.where("item_id", item.id)
        : has_item.query.insert({
            user_id: message.author.id,
            item_id: item.id,
            amount: item.buy_amount,
          }))

      channel.send(
        new app.MessageEmbed()
          .setTitle("Achat réussi")
          .setDescription(
            `Tu as acheté **${item.buy_amount} x ${item.name}** pour **${priceAfterDiscount}** ${BLOCK} !`
          )
          .setColor(app.VALID)
          .setFooter('Tape "Strad rank" pour accéder à ton inventaire')
      )

      if (item.quantity !== -1) {
        await items.query
          .update({
            quantity: item.quantity - item.buy_amount,
          })
          .where("id", item.id)
      }
    })
  },
})
