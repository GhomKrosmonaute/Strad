import * as app from "../app"

const listener: app.Listener<"guildBanRemove"> = {
  event: "guildBanRemove",
  description: "Unban message",
  async run(ban) {
    return app.getChannel(ban, "log").send({
      embeds: [
        new app.MessageEmbed()
          .setTitle("Membre Débanni")
          .setDescription(`**${ban.user.tag}** vient de se faire débannir.`)
          .setColor("#21b1ff"),
      ],
    })
  },
}

export default listener
