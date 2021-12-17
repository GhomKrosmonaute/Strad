import * as app from "../app"

export default new app.Command({
  name: "repo",
  description: "The repo command",
  channelType: "guild",
  aliases: ["repos", "github", "git", "contribute"],
  async run(message) {
    const repos = {
      Nouveau: "https://github.com/CamilleAbella/Strad",
      Ancien: "https://github.com/Tagueo/new-strad",
    }
    return app.getChannel(message, "command").send({
      embeds: [
        new app.MessageEmbed()
          .setAuthor("Dépôts de Strad", message.client.user.displayAvatarURL())
          .setColor("#21b1ff")
          .setDescription(
            `Tu veux participer à mon développement ? Tu peux contribuer dès maintenant sur mon dépôt GitHub :smile:\nN'oublie pas de mettre une petite étoile si tu me trouves cool :blue_heart:`
          )
          .addField(
            "Liens",
            Object.entries(repos)
              .map(([label, link]) => `${label}: ${link}`)
              .join("\n")
          ),
      ],
    })
  },
})
