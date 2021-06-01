import * as app from "../app"

import users from "../tables/users"
import rewards from "../tables/rewards"

module.exports = new app.Command({
  name: "daily",
  description: "Daily gift",
  channelType: "guild",
  async run(message) {
    message.delete().catch()

    const CREA = app.emoji(message.client, "CREA")
    const BLOCK = app.emoji(message.client, "BLOCK")
    const UPVOTE = app.emoji(message.client, "UPVOTE")
    const DOWNVOTE = app.emoji(message.client, "DOWNVOTE")
    const DOWNLOAD = app.emoji(message.client, "DOWNLOAD")

    const channel = app.getCommandChannel(message)

    const todayDate = app.dayjs().format("DD/MM/YY")

    const user = await users.query
      .select()
      .where("id", message.author.id)
      .first()

    if (!user)
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Votre profil est inexistant !")
          .setDescription(
            `Merci de contacter <@${352176756922253321}> pour qu'il corrige ça.`
          )
          .setColor(app.ALERT)
      )

    if (user.last_daily !== todayDate) {
      // Si l'utilisateur n'a pas encore demandé son daily aujourd'hui, alors...
      const rewardList = await rewards.query
        .select()
        .where("rewarded_id", message.author.id)
        .and.where("daily_date", null)

      const { length: upvotes } = rewardList.filter((r) => r.type === "UV")
      const { length: downvotes } = rewardList.filter((r) => r.type === "DV")
      const { length: downloads } = rewardList.filter((r) => r.type === "DL")

      const finalCreaReward = downvotes < upvotes ? upvotes - downvotes : 0
      const finalBlockReward = 50 + upvotes * 5 + downloads * 2

      // Suppression des votes
      await rewards.query
        .update({
          daily_date: todayDate,
        })
        .where("daily_date", null)
        .and.where("rewarded_id", message.author.id)

      // Ajout des Blocs et des Créas
      // Mise à jour de la date du dernier daily
      await users.query
        .update({
          money: user.money + finalBlockReward,
          user_tag: message.member.displayName,
          last_daily: todayDate,
          crea_amount: user.crea_amount + finalCreaReward,
        })
        .where("id", message.author.id)

      return channel.send(
        new app.MessageEmbed()
          .setAuthor(
            `Récompense quotidienne (${message.member.displayName})`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor(app.VALID)
          .addField("Blocs", `+ **${finalBlockReward}** ${BLOCK}`, true)
          .addField("Créas", `+ **${finalCreaReward}** ${CREA}`, true)
          .setDescription(
            `Voici ta récompense journalière ! Pour accéder à ton compte, fais \`Strad rank\`.
        **${upvotes}** ${UPVOTE} • **${downvotes}** ${DOWNVOTE} • **${downloads}** ${DOWNLOAD}`
          )
          .setFooter("Strad daily")
      )
    } else {
      return channel.send(
        new app.MessageEmbed()
          .setAuthor(
            `Récompense quotidienne (${message.member.displayName})`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor(app.ALERT)
          .setDescription(
            `Tu as déjà obtenu ta récompense aujourd'hui. Récupère-la ${app
              .dayjs()
              .endOf("day")
              .fromNow()} !`
          )
          .setFooter("Strad daily")
      )
    }
  },
})
