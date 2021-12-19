import * as app from "../app.js"

const listener: app.Listener<"guildMemberAdd"> = {
  event: "guildMemberAdd",
  description: "New member",
  async run(member) {
    const logs = app.getChannel(member, "log")
    const count = app.getCategory(member, "memberCount")
    const apprentice = app.getRole(member, "apprentice")

    member.roles.add(apprentice).catch()

    member
      .send(
        [
          "Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?",
          "Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:",
          "\nOn a tous envie de te connaître ! :violin:",
          "\n> https://discord.gg/4MmJwgj",
        ].join("\n")
      )
      .catch()

    count.setName(`STRADIVARIUS | ${member.guild.memberCount} MEMBRES`).catch()

    logs
      .send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Nouveau Membre")
            .setDescription(
              `**<@${member.user.id}>** vient de rejoindre le serveur !`
            )
            .setColor(app.NEUTRAL_BLUE),
        ],
      })
      .catch()
  },
}

export default listener
