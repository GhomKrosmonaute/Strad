import * as app from "../app"

const listener: app.Listener<"guildBanAdd"> = {
  event: "guildBanAdd",
  async run(guild, user) {
    return app
      .getChannel(guild, "log")
      .send(
        new app.MessageEmbed()
          .setTitle("Membre Banni")
          .setDescription(`**${user.tag}** vient de se faire bannir.`)
          .setColor("#f44242")
      )
  },
}

module.exports = listener
