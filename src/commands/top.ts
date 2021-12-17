import * as app from "../app"

import users from "../tables/users"

export default new app.Command({
  name: "top",
  aliases: ["ladder", "board", "leaderboard", "lb"],
  description: "Leaderboard",
  channelType: "guild",
  async run(message) {
    message.delete().catch()

    const quantity = 10

    const userRanking = await users.query
      .select()
      .orderBy("crea_amount", "desc")
      .limit(quantity)

    const CREA = app.emoji(message.client, "CREA")

    const embed = new app.MessageEmbed()
      .setTitle("Stradivarius - Classement (Créas)")
      .setFooter("Strad top")
      .setColor(app.SDVR)

    userRanking
      .slice(0, 2)
      .forEach((user, index) =>
        embed.addField(
          `${index + 1}. ${user.tag}`,
          `**${user.crea_amount}** ${CREA}`,
          true
        )
      )

    embed.addField(
      `Top ${quantity}`,
      userRanking
        .slice(2, quantity)
        .map(
          (user, index) => `\`${index + 1}. ${user.crea_amount}\` - ${user.tag}`
        )
        .join("\n"),
      false
    )

    return app.getChannel(message, "command").send({ embeds: [embed] })
  },
})
