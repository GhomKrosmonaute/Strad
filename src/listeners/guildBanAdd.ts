import * as app from "../app"

const listener: app.Listener<"guildBanAdd"> = {
  event: "guildBanAdd",
  description: "Ban message",
  async run(ban) {
    return app
      .getChannel(ban, "log")
      .send({
        embeds: [
          new app.MessageEmbed()
            .setTitle("Membre Banni")
            .setDescription(`**${ban.user.tag}** vient de se faire bannir.`)
            .setColor("#f44242"),
        ],
      })
  },
}

export default listener
