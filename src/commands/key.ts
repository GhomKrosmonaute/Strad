import * as app from "../app.js"

import users from "../tables/users.js"
import blocks_keys from "../tables/blocks_keys.js"

export default new app.Command({
  name: "key",
  description: "Create key",
  channelType: "guild",
  positional: [
    {
      name: "value",
      description: "Value of key",
      castValue: "number",
      required: true,
    },
  ],
  async run(message) {
    const BLOCK = app.emoji(message.client, "BLOCK")

    const channel = app.getChannel(message, "command")
    const log = app.getChannel(message, "log")

    const minAllowedValue = 50
    const maxAllowedValue = 15000
    const key_value: number = message.args.value

    if (key_value < minAllowedValue || key_value > maxAllowedValue)
      return channel.send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Création de clé impossible")
            .setDescription(
              "Tu dois saisir une valeur en Blocs comprise entre 50 et 15000."
            )
            .setColor(app.ALERT),
        ],
      })

    const key_face = await app.createKey()
    const key_print = await app.createFingerPrint()
    const creation_date = app.dayjs().format("DD/MM/YY")

    const user = await app.ensureUser(message.member)

    const { money } = user

    if (key_value > money)
      return channel.send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Création de clé impossible")
            .setDescription(
              `Tu n'as pas assez de Blocs pour créer cette clé. Il te manque **${
                key_value - money
              }** ${BLOCK} !`
            )
            .setColor(app.ALERT),
        ],
      })

    await users.query
      .update({
        money: money - key_value,
      })
      .where("id", message.author.id)

    await blocks_keys.query.insert({
      key_face,
      key_print,
      key_value,
      creator_id: message.author.id,
      creation_date,
    })

    await channel.send({
      embeds: [
        new app.MessageEmbed()
          .setTitle("Création effectuée")
          .setDescription(
            "Ta clé a correctement été débloquée. Tu viens de la recevoir en message privé !"
          )
          .setColor(app.VALID)
          .setFooter("Strad key <valeur>"),
      ],
    })

    await message.author.send({
      embeds: [
        new app.MessageEmbed()
          .setTitle("Création de clé")
          .setDescription(
            [
              `Voici ta clé d'une valeur de **${key_value}** ${BLOCK} (clique pour l'afficher) :`,
              `||\`\`\`${key_face}\`\`\`||`,
              "Fais bien attention de ne pas la partager à n'importe qui !",
              "Afin de l'utiliser, le bénéficiaire de la clé devra taper la commande : `Strad redeem <clé>`.",
              "Il recevra ainsi la valeur en Blocs de la clé !",
            ].join("\n")
          )
          .setColor(app.NEUTRAL_BLUE)
          .addField(
            "Empreinte de la clé",
            [
              `\`\`\`${key_print}\`\`\``,
              "Note : L'empreinte n'est pas secrète, elle est directement liée à ta clé.",
              "Tu peux partager l'empreinte au destinataire de celle-ci afin d'attester qu'elle t'appartient, qu'elle est valide et qu'elle a bien la valeur en Blocs annoncée.",
              "Cela peut se révéler bien utile dans le cas d'un échange !",
            ].join("\n")
          ),
      ],
    })

    return log.send({
      embeds: [
        new app.MessageEmbed()
          .setTitle("Création de clé")
          .setDescription(
            `${message.author} a créé une clé d'empreinte \`${key_print}\` et d'une valeur de **${key_value}** ${BLOCK}.`
          )
          .setColor(app.NEUTRAL_BLUE),
      ],
    })
  },
})
