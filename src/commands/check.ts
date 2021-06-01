import * as app from "../app"

import blocks_keys from "../tables/blocks_keys"

module.exports = new app.Command({
  name: "check",
  description: "Check key validity",
  channelType: "guild",
  positional: [
    {
      name: "key",
      description: "Key to check",
      required: true,
    },
  ],
  async run(message) {
    message.delete().catch()

    const BLOCK = app.emoji(message.client, "BLOCK")
    const KEY_VALID = app.emoji(message.client, "KEY_VALID")
    const KEY_USED = app.emoji(message.client, "KEY_USED")

    const channel = app.getChannel(message, "command")

    const key = await blocks_keys.query
      .select()
      .where("key_print", message.args.key)
      .first()

    if (key) {
      const keyOwner = await message.client.users.fetch(key.creator_id)
      const keyUser = key.recipient_id
        ? await message.client.users.fetch(key.recipient_id)
        : "-"
      const validity = key.recipient_id
        ? `Utilisée ${KEY_USED}`
        : `Valide ${KEY_VALID}`
      const redeemDate = key.recipient_id ? ", le " + key.redeem_date : ""
      const keySimFace = `**${key.key_face.slice(
        0,
        1
      )}**???-????-???**${key.key_face.slice(-1)}**`

      return channel.send(
        new app.MessageEmbed()
          .setTitle(`Clé d'empreinte ${key.key_print}`)
          .setDescription(
            `Les informations concernant la clé d'empreinte \`${key.key_print}\` sont affichées ci-dessous.`
          )
          .setColor(key.recipient_id ? app.ALERT : app.VALID)
          .addField("Apparence de la clé", keySimFace)
          .addField("Créée par", `${keyOwner}, le ${key.creation_date}`)
          .addField("Utilisée par", `${keyUser}${redeemDate}`)
          .addField("Validité", validity)
          .addField("Valeur", `${key.key_value} ${BLOCK}`)
          .setFooter("Strad check <empreinte>")
      )
    } else {
      return channel.send(
        new app.MessageEmbed()
          .setTitle("Clé introuvable")
          .setDescription(
            `L'empreinte \`${message.args.key}\` n'est liée à aucune clé existante.\nFormat : \`XX-XXXX\`.`
          )
          .setColor(app.ALERT)
      )
    }
  },
})
