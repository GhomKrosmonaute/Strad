import * as app from "../app"

import users from "../tables/users"
import has_item from "../tables/has_item"

module.exports = new app.Command({
  name: "rank",
  description: "Show your rank",
  channelType: "guild",
  async run(message) {
    const BLOCK = app.emoji(message.client, "BLOCK")
    const CREA = app.emoji(message.client, "CREA")

    const user = await app.ensureUser(message.member)

    const userRanking = await users.query
      .select()
      .orderBy("crea_amount", "desc")
    const userItems: {
      id: number
      emoji: string
      amount: number
    }[] = await has_item.query
      .select("has_item.item_id AS id, emoji, has_item.amount AS amount")
      .innerJoin("items", "items.id", "has_item.item_id")
      .where("has_item.user_id", message.author.id)
      .and.where("amount", "!=", 0)
      .orderBy("has_item.item_id", "asc")

    const userInventory =
      (userItems[0]
        ? userItems.map((item) => `${item.emoji} x ${item.amount}`)
        : []
      ).join(" • ") ||
      "Ton inventaire est vide. Fais `Strad shop` pour acheter des items !"

    const userRank = userRanking.indexOf(user) + 1

    return app.getCommandChannel(message).send(
      new app.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField("Valeur du compte", `${user.money} ${BLOCK}`, true)
        .addField("Nombre de Créas", `${user.crea_amount} ${CREA}`, true)
        .addField("Rang", `#${userRank}`, true)
        .addField("Titre artistique", user.rank, true)
        .addField("Inventaire", userInventory)
        .setFooter("Strad rank")
        .setColor(message.member.displayColor)
    )
  },
})
