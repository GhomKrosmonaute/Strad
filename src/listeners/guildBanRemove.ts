import * as app from "../app"

const listener: app.Listener<"guildBanRemove"> = {
  event: "guildBanRemove",
  async run(guild, user) {
    return app
      .getChannel(guild, "log")
      .send(
        new app.MessageEmbed()
          .setTitle("Membre Débanni")
          .setDescription(`**${user.tag}** vient de se faire débannir.`)
          .setColor("#21b1ff")
      )
  },
}

export default listener
