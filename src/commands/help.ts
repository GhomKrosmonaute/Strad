import * as app from "../app"

const command: app.Command<app.GuildMessage> = {
  name: "help",
  aliases: ["h", "usage"],
  guildChannelOnly: true,
  description: "Help menu",
  longDescription: "Display all commands of bot or detail a target command.",
  positional: [
    {
      name: "command",
      description: "The target command name.",
    },
  ],
  flags: [
    {
      name: "all",
      flag: "a",
      aliases: ["old"],
      description: "Show all commands",
    },
  ],
  async run(message) {
    message.delete().catch()

    if (message.args.command) {
      const cmd = app.commands.resolve(message.args.command)

      if (cmd) {
        return app.sendCommandDetails(message, cmd)
      } else {
        await message.channel.send(
          new app.MessageEmbed()
            .setColor("RED")
            .setAuthor(
              `Unknown command "${message.args.command}"`,
              message.client.user?.displayAvatarURL()
            )
        )
      }
    } else {
      if (message.args.all) {
        new app.Paginator(
          app.Paginator.divider(
            await Promise.all(
              app.commands.map(async (cmd) => {
                return `**${message.usedPrefix}${cmd.name}** - ${
                  (await app.scrap(cmd.description, message)) ??
                  "no description"
                }`
              })
            ),
            10
          ).map((page) => {
            return new app.MessageEmbed()
              .setColor("BLURPLE")
              .setAuthor(
                "Command list",
                message.client.user?.displayAvatarURL()
              )
              .setDescription(page.join("\n"))
              .setFooter(`${message.usedPrefix}help <command>`)
          }),
          message.channel,
          (reaction, user) => user.id === message.author.id
        )
      } else {
        const channel = message.client.channels.cache.get(app.commandChannel)

        if (!channel?.isText()) return

        await channel.send(
          new app.MessageEmbed()
            .setTitle("Help")
            .setDescription(
              `Pour m'appeler, utilise le préfixe **Strad** (c'est mon nom !).\nExemple : \`Strad help\` pour afficher cet encart ^^`
            )
            .setColor(app.NEUTRAL_BLUE)
            .addField(
              "Général",
              [
                "`help` • Affiche cet encart.",
                "`rank` • Affiche ton profil.",
                "`top` • Affiche le classement du serveur.",
                "`daily` • Permet de récupérer ta récompense journalière !",
                "`key <valeur>` • Crée une clé ayant la valeur en Blocs définie en argument.",
                "`redeem <clé>` • Utilise la clé spécifiée en argument afin que tu puisses récupérer sa valeur en Blocs.",
                "`check <empreinte>` • Permet de vérifier l'existence, la validité, la propriété, la valeur et l'apparence d'une clé en spécifiant son empreinte en argument.",
              ].join("\n")
            )
            .addField(
              "Premium",
              [
                "`nick <pseudonyme>` • Change de pseudonyme et ce, seulement sur Stradivarius !",
                "`say <message>` • Fais parler Strad avec le message de ton choix !",
              ].join("\n")
            )
            .addField(
              "Boutique",
              [
                "`shop` • Ouvre la boutique du serveur.",
                "`buy <numéro de l'article>` • Permet d'acheter l'article de boutique dont le numéro est spécifié en argument.",
              ].join("\n")
            )
            .addField(
              "Divers",
              [
                "`repo` • Affiche le lien vers mon dépôt GitHub.",
                "`stats` • Affiche des informations me concernant.",
              ].join("\n")
            )
            .setFooter(
              "Strad help",
              message.client.user.displayAvatarURL({ dynamic: true })
            )
            .setColor(app.NEUTRAL_BLUE)
        )

        if (message.member.roles.cache.has(app.moderatorRole)) {
          return message.author.send(
            new app.MessageEmbed()
              .setTitle("Help (suite)")
              .setDescription(
                "Les commandes affichées ci-dessous sont réservées aux Modérateurs (et au-dessus)."
              )
              .setColor(app.MODERATOR)
              .addField(
                "Commandes",
                [
                  "`mute <@membre> <durée> <raison>` • Réduit au silence le membre mentionné et ce, pour la durée spécifiée en argument (entre 1 et 360 minutes - soit 6 heures). Nécessite de spécifier une raison.",
                  "`kick <@membre> <raison>` • Expulse le membre mentionné. Nécessite de spécifier une raison.",
                  "`ban <@membre> <raison>` • Bannit de manière permanente le membre mentionné. Nécessite de spécifier une raison.",
                ].join("\n")
              )
          )
        }
      }
    }
  },
}

module.exports = command
