import * as app from "../app"

import items from "../tables/items"

module.exports = new app.Command({
  name: "shop",
  description: "The shop command",
  channelType: "guild",
  async run(message) {
    message.delete().catch()

    const BLOCK = app.emoji(message.client, "BLOCK")
    const DISCOUNT = app.emoji(message.client, "DISCOUNT")

    const itemList = await items.query
      .select()
      .where("is_buyable", true)
      .orderBy("id", "asc")

    const embed = new app.MessageEmbed()
      .setAuthor("Boutique")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/543888518167003136/602227009468235791/SDVR_item.png"
      )
      .addField(
        "Aide",
        `Acheter un article : \`Strad buy <numéro de l'article>\`\nExemple : \`Strad buy 1\` (pour acheter un changement de pseudonyme).`
      )
      .setFooter("Strad shop")
      .setColor(app.SHOP)

    for (const item of itemList) {
      if (item.discount > 100) item.discount = 100
      else if (item.discount < 0) item.discount = 0

      const notSaleableText = item.is_saleable
        ? "Cet item peut être vendu."
        : "Cet item ne peut pas être vendu."

      const itemEmoji = message.client.emojis.cache.get(item.emoji)

      const discountText = item.discount > 0 ? ` • ${DISCOUNT}` : ""
      const priceAfterDiscount = Math.round(
        item.price - item.price * (item.discount / 100)
      )
      const priceText =
        item.discount > 0
          ? `~~${item.price}~~ ${priceAfterDiscount} ${BLOCK} (-${item.discount} %)`
          : `${item.price} ${BLOCK}`

      const itemQuantity = item.quantity === -1 ? "∞" : item.quantity

      embed.addField(
        `${itemEmoji} ${item.buy_amount} x ${item.name}${discountText}`,
        [
          `**Description :** ${item.description}`,
          `**Prix :** ${priceText}`,
          `**Stock :** ${itemQuantity}`,
          `**Numéro d'article :** ${item.id}`,
          `${notSaleableText}`,
        ].join("\n")
      )
    }

    return app.getCommandChannel(message).send(embed)
  },
})
