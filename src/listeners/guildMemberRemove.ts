import * as app from "../app"

const listener: app.Listener<"guildMemberRemove"> = {
  event: "guildMemberRemove",
  async run(member) {
    app
      .getCategory(member, "memberCount")
      .setName(`STRADIVARIUS | ${member.guild.memberCount} MEMBRES`)
      .catch()
    app
      .getChannel(member, "log")
      .send(
        new app.MessageEmbed()
          .setTitle("Ancien membre")
          .setDescription(
            `**${
              member.user?.tag ?? member.displayName
            }** vient de quitter le serveur.`
          )
          .setColor(app.ALERT)
      )
      .catch()
  },
}

export default listener
