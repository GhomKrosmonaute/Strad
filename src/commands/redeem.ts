import * as app from "../app"

import users from "../tables/users"
import blocks_keys from "../tables/blocks_keys"

module.exports = new app.Command({
  name: "redeem",
  description: "",
  channelType: "guild",
  positional: [
    {
      name: "key",
      description: "Key to redeem",
      required: true,
    },
  ],
  async run(message) {
    message.delete().catch()

    const BLOCK = app.emoji(message.client, "BLOCK")

    const channel = app.getCommandChannel(message)

    const todayDate = app.dayjs().format("DD/MM/YY")

    const blockKey = await blocks_keys.query
      .select()
      .where("key_print", message.args.key)
      .first()

    if (blockKey) {
      const user = await app.ensureUser(message.author.id)

      if (!blockKey.recipient_id) {
        await blocks_keys.query
          .update({
            recipient_id: message.author.id,
            redeem_date: todayDate,
          })
          .where("id", blockKey.id)

        await users.query
          .update({
            money: user.money + blockKey.key_value,
          })
          .where("id", message.author.id)

        await channel.send(
          new app.MessageEmbed()
            .setTitle("Récupération réussie")
            .setDescription(
              `Youpi ! Tu viens de recevoir **${blockKey.key_value}** ${BLOCK} !`
            )
            .setColor(app.VALID)
            .setFooter("Strad redeem <clé>")
        )

        return app
          .getLogChannel(message)
          .send(
            new app.MessageEmbed()
              .setTitle("Récupération de clé")
              .setDescription(
                `${message.author} a utilisé la clé \`${message.args.key}\` d'une valeur de **${blockKey.key_value}** ${BLOCK}.`
              )
              .setColor(app.NEUTRAL_BLUE)
          )
      } else {
        return channel.send(
          new app.MessageEmbed()
            .setTitle("Récupération impossible")
            .setDescription(
              `La clé \`${message.args.key}\` a déjà été utilisée. En cas de litige, contacte un Mentor en message privé.`
            )
            .setColor(app.ALERT)
        )
      }
    } else {
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Récupération impossible")
          .setDescription(
            `La clé \`${message.args.key}\` n'est pas valide.\nFormat : \`XXXX-XXXX-XXXX-XXXX\`.`
          )
          .setColor(app.ALERT)
      )
    }
  },
})
